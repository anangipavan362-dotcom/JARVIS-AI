import pytest
from app.models import User, OTPVerification
from app.auth.security import create_access_token


def test_otp_verification_flow(client, db_session):
    # 1. Register new operative
    reg_payload = {
        "full_name": "Carol Danvers",
        "username": "captain_marvel",
        "email": "carol@avengers.org",
        "password": "QuantumPower999!"
    }
    reg_res = client.post("/api/auth/register", json=reg_payload)
    assert reg_res.status_code == 201
    reg_data = reg_res.json()
    assert reg_data["status"] == "PENDING_VERIFICATION"
    assert reg_data["email"] == "carol@avengers.org"

    # User in DB should have status PENDING_VERIFICATION
    user = db_session.query(User).filter(User.email == "carol@avengers.org").first()
    assert user is not None
    assert user.status == "PENDING_VERIFICATION"

    # Find the dispatched OTP in DB
    otp_record = db_session.query(OTPVerification).filter(
        OTPVerification.email == "carol@avengers.org",
        OTPVerification.is_used == False
    ).first()
    assert otp_record is not None
    assert otp_record.otp_hash is not None

    # 2. Invalid OTP verification must fail
    bad_verify = client.post("/api/auth/verify-otp", json={
        "email": "carol@avengers.org",
        "code": "000000"
    })
    assert bad_verify.status_code == 400
    assert "invalid clearance code" in bad_verify.json()["detail"].lower()

    # 3. Simulate correct OTP verification
    # We can inject a known hash or use the test utility
    from app.services.otp_service import otp_service
    test_code = "123456"
    otp_record.otp_hash = otp_service.hash_otp(test_code)
    db_session.commit()

    good_verify = client.post("/api/auth/verify-otp", json={
        "email": "carol@avengers.org",
        "code": "123456"
    })
    assert good_verify.status_code == 200
    verify_data = good_verify.json()
    assert verify_data["user"]["status"] == "VERIFIED"
    assert verify_data["access_token"] is not None

    # DB record check
    db_session.refresh(user)
    assert user.status == "VERIFIED"
    assert user.is_active == True
    assert user.verified_at is not None


def test_advanced_admin_endpoints(client, db_session):
    # Create an admin operative
    admin_user = User(
        full_name="Nick Fury",
        username="fury_director",
        email="fury@shield.gov",
        password_hash="fakehash",
        role="ADMIN",
        status="VERIFIED",
        is_active=True
    )
    db_session.add(admin_user)
    db_session.commit()
    db_session.refresh(admin_user)

    admin_token = create_access_token({"sub": str(admin_user.id), "username": admin_user.username, "role": "ADMIN"})
    headers = {"Authorization": f"Bearer {admin_token}"}

    # 1. User detail dossier endpoint
    detail_res = client.get(f"/api/admin/users/{admin_user.id}", headers=headers)
    assert detail_res.status_code == 200
    detail_data = detail_res.json()
    assert detail_data["user"]["username"] == "fury_director"
    assert "conversations_count" in detail_data
    assert "recent_activities" in detail_data

    # 2. Analytics endpoint
    analytics_res = client.get("/api/admin/analytics", headers=headers)
    assert analytics_res.status_code == 200
    analytics_data = analytics_res.json()
    assert "total_users" in analytics_data
    assert "registration_timeline" in analytics_data
    assert "ai_activity_timeline" in analytics_data

    # 3. Audit logs endpoint
    audit_res = client.get("/api/admin/audit-logs", headers=headers)
    assert audit_res.status_code == 200
    assert isinstance(audit_res.json(), list)

    # 4. Security events endpoint
    sec_res = client.get("/api/admin/security/events", headers=headers)
    assert sec_res.status_code == 200
    assert isinstance(sec_res.json(), list)

    # 5. System settings list and update
    settings_res = client.get("/api/admin/settings", headers=headers)
    assert settings_res.status_code == 200
    settings_list = settings_res.json()
    assert len(settings_list) >= 5

    update_res = client.put("/api/admin/settings", json={
        "key": "otp_expiration_minutes",
        "value": "15"
    }, headers=headers)
    assert update_res.status_code == 200
    assert update_res.json()["value"] == "15"
