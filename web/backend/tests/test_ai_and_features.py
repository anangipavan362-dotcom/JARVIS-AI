import pytest

def test_dashboard_and_ai_endpoints(client):
    # Register user
    reg = client.post("/api/auth/register", json={
        "full_name": "Peter Parker",
        "username": "spidey",
        "email": "spidey@web.net",
        "password": "WebShooter123!"
    })
    token = reg.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Dashboard payload
    dash_res = client.get("/api/dashboard", headers=headers)
    assert dash_res.status_code == 200
    dash_data = dash_res.json()
    assert "ai_status" in dash_data
    assert "system_health_score" in dash_data
    assert dash_data["user"]["username"] == "spidey"

    # 2. AI Chat (Demo mode fallback when GEMINI_API_KEY is unset)
    chat_res = client.post("/api/ai/chat", json={
        "message": "Hello JARVIS, status report please."
    }, headers=headers)
    assert chat_res.status_code == 200
    chat_data = chat_res.json()
    assert "response" in chat_data
    assert len(chat_data["response"]) > 0

    # 3. Weather search
    weather_res = client.get("/api/weather?city=London", headers=headers)
    assert weather_res.status_code == 200
    wdata = weather_res.json()
    assert "temperature" in wdata
    assert "condition" in wdata

    # 4. Search endpoint
    search_res = client.get("/api/search?q=quantum+computing", headers=headers)
    assert search_res.status_code == 200
    sdata = search_res.json()
    assert "providers" in sdata
    assert len(sdata["providers"]) > 0
