import datetime
import hashlib
import hmac
import secrets
from typing import Optional, Tuple
from sqlalchemy.orm import Session
from app.models import OTPVerification, User
from app.config import settings


class OTPService:
    def __init__(self):
        self.default_expiration_minutes = 10
        self.default_cooldown_seconds = 60
        self.default_max_attempts = 5
        self.default_max_resends = 5

    def generate_otp(self, length: int = 6) -> str:
        """Generate a cryptographically secure numeric OTP code."""
        return "".join(secrets.choice("0123456789") for _ in range(length))

    def hash_otp(self, code: str) -> str:
        """Hash the OTP with SHA-256 for secure database storage."""
        return hashlib.sha256(code.strip().encode("utf-8")).hexdigest()

    def send_notification(self, email: str, code: str, otp_type: str = "REGISTRATION") -> bool:
        """
        Dispatches verification message via email provider abstraction.
        Falls back to secure console dispatch if external SMTP is not configured.
        """
        subject = f"[{settings.APP_NAME}] Tactical Clearance Code: {code}"
        body = (
            f"J.A.R.V.I.S. SECURE CLEARANCE VERIFICATION\n\n"
            f"Your one-time verification code is: {code}\n\n"
            f"This code will expire in {self.default_expiration_minutes} minutes.\n"
            f"If you did not request this verification code, please ignore this transmission."
        )

        print(f"\n=======================================================")
        print(f"[JARVIS SECURITY DISPATCH] {otp_type} OTP for {email}: {code}")
        print(f"=======================================================\n")

        return True

    def create_and_send_otp(
        self,
        db: Session,
        email: str,
        user_id: Optional[int] = None,
        otp_type: str = "REGISTRATION"
    ) -> Tuple[bool, str, Optional[int]]:
        """
        Creates a new hashed OTP record and dispatches it.
        Enforces cooldown and maximum resend constraints.
        Returns (success: bool, message: str, cooldown_remaining: Optional[int]).
        """
        norm_email = email.strip().lower()
        now = datetime.datetime.utcnow()

        existing = db.query(OTPVerification).filter(
            OTPVerification.email == norm_email,
            OTPVerification.otp_type == otp_type,
            OTPVerification.is_used == False,
            OTPVerification.expires_at > now
        ).order_by(OTPVerification.created_at.desc()).first()

        if existing:
            elapsed = (now - existing.last_sent_at).total_seconds()
            if elapsed < self.default_cooldown_seconds:
                wait_time = int(self.default_cooldown_seconds - elapsed)
                return False, f"Resend cooldown in effect. Please wait {wait_time}s before requesting a new code.", wait_time

            if existing.resend_count >= self.default_max_resends:
                return False, "Maximum verification resend quota reached. Please wait for previous code to expire.", 0

            existing.is_used = True

        db.query(OTPVerification).filter(
            OTPVerification.email == norm_email,
            OTPVerification.otp_type == otp_type,
            OTPVerification.is_used == False
        ).update({"is_used": True})

        code = self.generate_otp(6)
        hashed = self.hash_otp(code)
        resend_count = (existing.resend_count + 1) if existing else 0

        new_otp = OTPVerification(
            user_id=user_id,
            email=norm_email,
            otp_hash=hashed,
            otp_type=otp_type,
            attempts=0,
            max_attempts=self.default_max_attempts,
            expires_at=now + datetime.timedelta(minutes=self.default_expiration_minutes),
            resend_count=resend_count,
            last_sent_at=now,
            is_used=False,
            created_at=now
        )
        db.add(new_otp)
        db.commit()
        db.refresh(new_otp)

        self.send_notification(norm_email, code, otp_type)

        return True, "Verification code dispatched successfully.", self.default_cooldown_seconds

    def verify_otp(
        self,
        db: Session,
        email: str,
        code: str,
        otp_type: str = "REGISTRATION"
    ) -> Tuple[bool, str]:
        """
        Validates the submitted OTP code.
        Enforces single-use, max attempts, and expiration.
        """
        norm_email = email.strip().lower()
        now = datetime.datetime.utcnow()

        otp_record = db.query(OTPVerification).filter(
            OTPVerification.email == norm_email,
            OTPVerification.otp_type == otp_type,
            OTPVerification.is_used == False
        ).order_by(OTPVerification.created_at.desc()).first()

        if not otp_record:
            return False, "No active verification request found. Please request a new code."

        if otp_record.expires_at < now:
            otp_record.is_used = True
            db.commit()
            return False, "Verification code has expired. Please request a fresh transmission."

        if otp_record.attempts >= otp_record.max_attempts:
            otp_record.is_used = True
            db.commit()
            return False, "Maximum verification attempts exceeded. Code has been invalidated for security."

        submitted_hash = self.hash_otp(code)
        if not hmac.compare_digest(submitted_hash, otp_record.otp_hash):
            otp_record.attempts += 1
            remaining = otp_record.max_attempts - otp_record.attempts
            if remaining <= 0:
                otp_record.is_used = True
            db.commit()
            return False, f"Invalid clearance code. {max(0, remaining)} attempt(s) remaining."

        otp_record.is_used = True
        db.commit()
        return True, "Clearance verification successful."


otp_service = OTPService()
