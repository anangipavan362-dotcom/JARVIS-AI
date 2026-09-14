import pytest
from app.models import User
from app.auth.security import create_access_token

def test_admin_authorization(client, db_session):
    # 1. Register Regular User
    res_user = client.post("/api/auth/register", json={
        "full_name": "Standard Operative",
        "username": "operative_99",
        "email": "op99@shield.gov",
        "password": "Password123!"
    })
    token_user = res_user.json()["access_token"]
    headers_user = {"Authorization": f"Bearer {token_user}"}

    # Regular user tries to access /api/admin/users -> MUST RETURN 403 FORBIDDEN
    forbidden_res = client.get("/api/admin/users", headers=headers_user)
    assert forbidden_res.status_code == 403
    assert "administrator privileges required" in forbidden_res.json()["detail"].lower()

    # Regular user tries to access /api/admin/stats -> MUST RETURN 403
    stats_res = client.get("/api/admin/stats", headers=headers_user)
    assert stats_res.status_code == 403

    # 2. Promote user to ADMIN in database
    user_record = db_session.query(User).filter(User.username == "operative_99").first()
    user_record.role = "ADMIN"
    db_session.commit()

    # Re-issue token with ADMIN role
    admin_token = create_access_token({"sub": str(user_record.id), "username": user_record.username, "role": "ADMIN"})
    headers_admin = {"Authorization": f"Bearer {admin_token}"}

    # Admin user accesses /api/admin/users -> 200 OK
    admin_users_res = client.get("/api/admin/users", headers=headers_admin)
    assert admin_users_res.status_code == 200
    assert len(admin_users_res.json()) >= 1

    # Admin user accesses /api/admin/stats -> 200 OK
    admin_stats_res = client.get("/api/admin/stats", headers=headers_admin)
    assert admin_stats_res.status_code == 200
    assert "total_users" in admin_stats_res.json()
