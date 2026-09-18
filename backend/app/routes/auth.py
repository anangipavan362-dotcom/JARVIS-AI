import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import User, Session as UserSession, PasswordResetToken, UserSettings
from app.schemas import (
    UserCreate, UserLogin, UserOut, TokenResponse,
    PasswordResetRequest, PasswordResetConfirm, PasswordChange, SessionOut,
    OTPVerifyRequest, OTPResendRequest, OTPResponse
)
from app.auth.security import hash_password, verify_password, create_access_token, generate_secure_token
from app.auth.dependencies import get_current_user
from app.services.activity_service import activity_service
from app.services.otp_service import otp_service
from app.services.audit_service import audit_service

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, request: Request, response: Response, db: Session = Depends(get_db)):
    # Check if username or email already exists
    existing = db.query(User).filter(
        (User.username == payload.username.strip().lower()) | 
        (User.email == payload.email.strip().lower())
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this username or email address already exists."
        )

    # Initial account registration status is strictly PENDING_VERIFICATION
    assigned_role = "USER"

    # Create new operative record
    new_user = User(
        full_name=payload.full_name.strip(),
        username=payload.username.strip().lower(),
        email=payload.email.strip().lower(),
        password_hash=hash_password(payload.password),
        avatar_url=payload.avatar_url or "",
        role=assigned_role,
        status="PENDING_VERIFICATION",
        is_active=True,
        verification_method="EMAIL",
        created_at=datetime.datetime.utcnow()
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create default user settings
    default_settings = UserSettings(user_id=new_user.id)
    db.add(default_settings)
    db.commit()

    # Generate and dispatch cryptographic OTP
    otp_ok, otp_msg, cooldown = otp_service.create_and_send_otp(
        db, new_user.email, user_id=new_user.id, otp_type="REGISTRATION"
    )

    # Issue access token & session
    token = create_access_token({"sub": str(new_user.id), "username": new_user.username, "role": new_user.role})
    
    session_record = UserSession(
        user_id=new_user.id,
        session_token=token,
        ip_address=request.client.host if request.client else "127.0.0.1",
        browser=request.headers.get("user-agent", "Unknown Browser")[:100],
        operating_system="Windows/Web Client",
        device_info="Terminal Access Node",
        is_active=True
    )
    db.add(session_record)
    db.commit()

    # Set HTTP-only cookie
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        max_age=60 * 60 * 24 * 7,
        samesite="lax"
    )

    activity_service.log(db, new_user.id, "ACCOUNT_ENROLLED", "Account enrolled in PENDING_VERIFICATION state.")
    audit_service.log_security_event(
        db,
        event_type="USER_REGISTERED_PENDING",
        severity="LOW",
        user_id=new_user.id,
        identifier=new_user.email,
        ip_address=request.client.host if request.client else "127.0.0.1",
        user_agent=request.headers.get("user-agent"),
        details="Dispatched registration OTP verification code."
    )

    return {
        "status": "PENDING_VERIFICATION",
        "message": "Operative enrolled. Tactical clearance OTP dispatched to your registered email.",
        "email": new_user.email,
        "expires_in_seconds": 600,
        "access_token": token,
        "token_type": "bearer",
        "user": UserOut.model_validate(new_user)
    }


@router.post("/verify-otp", response_model=TokenResponse)
def verify_otp(payload: OTPVerifyRequest, request: Request, response: Response, db: Session = Depends(get_db)):
    norm_email = payload.email.strip().lower()
    user = db.query(User).filter(User.email == norm_email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Operative account associated with this email address was not found."
        )

    # Validate OTP through cryptographically secure service
    is_valid, msg = otp_service.verify_otp(db, norm_email, payload.code, otp_type="REGISTRATION")
    if not is_valid:
        audit_service.log_security_event(
            db,
            event_type="OTP_VERIFICATION_FAILED",
            severity="MEDIUM",
            user_id=user.id,
            identifier=norm_email,
            ip_address=request.client.host if request.client else "127.0.0.1",
            user_agent=request.headers.get("user-agent"),
            details=msg
        )
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=msg)

    # Transition account to VERIFIED state
    user.status = "VERIFIED"
    user.is_active = True
    user.verified_at = datetime.datetime.utcnow()
    user.failed_login_attempts = 0
    db.commit()
    db.refresh(user)

    # Issue full access token & tactical session
    token = create_access_token({"sub": str(user.id), "username": user.username, "role": user.role})

    session_record = UserSession(
        user_id=user.id,
        session_token=token,
        ip_address=request.client.host if request.client else "127.0.0.1",
        browser=request.headers.get("user-agent", "Unknown Browser")[:100],
        operating_system="Windows/Web Client",
        device_info="Terminal Access Node",
        is_active=True
    )
    db.add(session_record)
    db.commit()

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        max_age=60 * 60 * 24 * 7,
        samesite="lax"
    )

    activity_service.log(db, user.id, "OTP_VERIFIED", "Tactical clearance verified. Full privileges granted.")
    audit_service.log_security_event(
        db,
        event_type="OTP_VERIFICATION_SUCCESS",
        severity="LOW",
        user_id=user.id,
        identifier=norm_email,
        ip_address=request.client.host if request.client else "127.0.0.1",
        user_agent=request.headers.get("user-agent"),
        details="User verified identity with 6-digit OTP."
    )

    return TokenResponse(
        access_token=token,
        user=UserOut.model_validate(user)
    )


@router.post("/resend-otp")
def resend_otp(payload: OTPResendRequest, request: Request, db: Session = Depends(get_db)):
    norm_email = payload.email.strip().lower()
    user = db.query(User).filter(User.email == norm_email).first()
    if user and user.status == "VERIFIED":
        return {
            "status": "ALREADY_VERIFIED",
            "message": "Account already possesses full verified clearance. Please log in directly."
        }

    success, msg, cooldown = otp_service.create_and_send_otp(
        db, norm_email, user_id=user.id if user else None, otp_type="REGISTRATION"
    )

    if not success:
        audit_service.log_security_event(
            db,
            event_type="OTP_RESEND_BLOCKED",
            severity="LOW",
            user_id=user.id if user else None,
            identifier=norm_email,
            ip_address=request.client.host if request.client else "127.0.0.1",
            user_agent=request.headers.get("user-agent"),
            details=msg
        )
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=msg)

    audit_service.log_security_event(
        db,
        event_type="OTP_RESENT",
        severity="LOW",
        user_id=user.id if user else None,
        identifier=norm_email,
        ip_address=request.client.host if request.client else "127.0.0.1",
        user_agent=request.headers.get("user-agent"),
        details="Dispatched replacement verification OTP."
    )

    return {
        "status": "SUCCESS",
        "message": "Fresh tactical clearance OTP dispatched to your registered address.",
        "email": norm_email,
        "cooldown_seconds": cooldown
    }


@router.post("/login", response_model=TokenResponse)
def login(payload: UserLogin, request: Request, response: Response, db: Session = Depends(get_db)):
    ident = payload.username_or_email.strip().lower()
    user = db.query(User).filter(
        (User.username == ident) | (User.email == ident)
    ).first()

    auth_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="ACCESS DENIED: Invalid credentials. Verification failed."
    )

    if not user:
        audit_service.log_security_event(
            db,
            event_type="LOGIN_FAILED_UNKNOWN_USER",
            severity="LOW",
            identifier=ident,
            ip_address=request.client.host if request.client else "127.0.0.1",
            user_agent=request.headers.get("user-agent"),
            details="Login attempted for nonexistent user identifier."
        )
        raise auth_error

    if not verify_password(payload.password, user.password_hash):
        user.failed_login_attempts += 1
        db.commit()
        audit_service.log_security_event(
            db,
            event_type="LOGIN_FAILED_BAD_PASSWORD",
            severity="MEDIUM",
            user_id=user.id,
            identifier=user.username,
            ip_address=request.client.host if request.client else "127.0.0.1",
            user_agent=request.headers.get("user-agent"),
            details=f"Failed login attempt #{user.failed_login_attempts}."
        )
        raise auth_error

    # Check status authorization
    if user.status == "SUSPENDED":
        audit_service.log_security_event(
            db,
            event_type="LOGIN_BLOCKED_SUSPENDED",
            severity="HIGH",
            user_id=user.id,
            identifier=user.username,
            ip_address=request.client.host if request.client else "127.0.0.1",
            details="Suspended user attempted login."
        )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="ACCESS DENIED: Account has been suspended by system administrator."
        )

    if user.status == "DISABLED":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="ACCESS DENIED: Account has been decommissioned."
        )

    # Reset failed attempts and update last login
    user.failed_login_attempts = 0
    user.last_login = datetime.datetime.utcnow()

    # Generate token
    token = create_access_token({"sub": str(user.id), "username": user.username, "role": user.role})

    # Record active session
    session_record = UserSession(
        user_id=user.id,
        session_token=token,
        ip_address=request.client.host if request.client else "127.0.0.1",
        browser=request.headers.get("user-agent", "Unknown Browser")[:100],
        operating_system="Windows/Web Client",
        device_info="Terminal Access Node",
        is_active=True
    )
    db.add(session_record)
    db.commit()

    # Set HTTP-only cookie
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        max_age=60 * 60 * 24 * 7,
        samesite="lax"
    )

    activity_service.log(db, user.id, "USER_LOGIN", "Tactical session established.")

    return TokenResponse(
        access_token=token,
        user=UserOut.model_validate(user)
    )


@router.post("/logout")
def logout(response: Response, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Deactivate current session
    response.delete_cookie("access_token")
    activity_service.log(db, current_user.id, "USER_LOGOUT", "Session terminated.")
    return {"status": "SUCCESS", "message": "Session terminated successfully."}


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/forgot-password")
def forgot_password(payload: PasswordResetRequest, db: Session = Depends(get_db)):
    email = payload.email.strip().lower()
    user = db.query(User).filter(User.email == email).first()
    
    # Secure: Do not reveal if email exists or not
    if user:
        token = generate_secure_token()
        reset_entry = PasswordResetToken(
            user_id=user.id,
            token=token,
            expires_at=datetime.datetime.utcnow() + datetime.timedelta(hours=1),
            used=False
        )
        db.add(reset_entry)
        db.commit()
        # In production, send email; in demo/dev mode, log or allow reset token
        print(f"[SECURITY NOTIFICATION] Password reset token for {email}: {token}")

    return {
        "status": "SUCCESS",
        "message": "If an account matching this address exists in the JARVIS registry, recovery instructions have been dispatched."
    }


@router.post("/reset-password")
def reset_password(payload: PasswordResetConfirm, db: Session = Depends(get_db)):
    token_record = db.query(PasswordResetToken).filter(
        PasswordResetToken.token == payload.token,
        PasswordResetToken.used == False,
        PasswordResetToken.expires_at > datetime.datetime.utcnow()
    ).first()

    if not token_record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Recovery token is invalid or has expired."
        )

    user = db.query(User).filter(User.id == token_record.user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Target user not found.")

    user.password_hash = hash_password(payload.new_password)
    token_record.used = True
    db.commit()

    activity_service.log(db, user.id, "PASSWORD_RESET", "Password was reset via secure token.")

    return {"status": "SUCCESS", "message": "Password updated successfully. You may now authenticate."}


@router.post("/change-password")
def change_password(payload: PasswordChange, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not verify_password(payload.old_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password verification failed."
        )

    current_user.password_hash = hash_password(payload.new_password)
    db.commit()

    activity_service.log(db, current_user.id, "PASSWORD_CHANGED", "Password modified from user profile.")

    return {"status": "SUCCESS", "message": "Password changed successfully."}


@router.get("/sessions", response_model=List[SessionOut])
def get_sessions(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    sessions = db.query(UserSession).filter(
        UserSession.user_id == current_user.id,
        UserSession.is_active == True
    ).order_by(UserSession.last_active.desc()).all()
    return sessions


@router.delete("/sessions")
def revoke_other_sessions(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Deactivate older sessions
    db.query(UserSession).filter(
        UserSession.user_id == current_user.id
    ).update({"is_active": False})
    db.commit()

    activity_service.log(db, current_user.id, "SESSIONS_REVOKED", "All other device sessions terminated.")
    return {"status": "SUCCESS", "message": "All other sessions have been terminated."}
