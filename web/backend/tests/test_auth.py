import pytest

def test_user_registration_and_login(client):
    # 1. Registration
    reg_payload = {
        "full_name": "Tony Stark",
        "username": "ironman",
        "email": "tony@stark.corp",
        "password": "QuantumPassword123!"
    }
    reg_res = client.post("/api/auth/register", json=reg_payload)
    assert reg_res.status_code == 201
    data = reg_res.json()
    assert "access_token" in data
    assert data["user"]["username"] == "ironman"
    assert data["user"]["role"] == "USER"  # Default registration role is USER

    # 2. Duplicate registration fails
    dup_res = client.post("/api/auth/register", json=reg_payload)
    assert dup_res.status_code == 400
    assert "exists" in dup_res.json()["detail"].lower()

    # 3. Successful Login
    login_res = client.post("/api/auth/login", json={
        "username_or_email": "ironman",
        "password": "QuantumPassword123!"
    })
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    assert token is not None

    # 4. Invalid Login (wrong password)
    bad_login = client.post("/api/auth/login", json={
        "username_or_email": "ironman",
        "password": "WrongPassword999!"
    })
    assert bad_login.status_code == 401
    assert "access denied" in bad_login.json()["detail"].lower()

    # 5. Protected route with valid token
    headers = {"Authorization": f"Bearer {token}"}
    me_res = client.get("/api/auth/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["username"] == "ironman"

    # 6. Protected route without token or cookie fails
    client.cookies.clear()
    no_auth_res = client.get("/api/auth/me")
    assert no_auth_res.status_code == 401


def test_forgot_password_generic_response(client):
    # Requesting reset for non-existent email must not leak user existence
    res = client.post("/api/auth/forgot-password", json={"email": "unknown_operative@shield.gov"})
    assert res.status_code == 200
    assert res.json()["status"] == "SUCCESS"
