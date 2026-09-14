import pytest

def test_strict_user_data_isolation(client):
    # Register User A
    res_a = client.post("/api/auth/register", json={
        "full_name": "Agent A",
        "username": "agent_alpha",
        "email": "alpha@shield.gov",
        "password": "SecretPasswordA1!"
    })
    token_a = res_a.json()["access_token"]
    headers_a = {"Authorization": f"Bearer {token_a}"}

    # Register User B
    res_b = client.post("/api/auth/register", json={
        "full_name": "Agent B",
        "username": "agent_bravo",
        "email": "bravo@shield.gov",
        "password": "SecretPasswordB2!"
    })
    token_b = res_b.json()["access_token"]
    headers_b = {"Authorization": f"Bearer {token_b}"}

    # 1. User A creates Conversation
    convo_res = client.post("/api/conversations", json={"title": "Alpha Secret Mission"}, headers=headers_a)
    assert convo_res.status_code == 201
    convo_id = convo_res.json()["id"]

    # User B attempts to access User A's conversation -> MUST RETURN 404
    b_convo_res = client.get(f"/api/conversations/{convo_id}", headers=headers_b)
    assert b_convo_res.status_code == 404

    # User B attempts to delete User A's conversation -> MUST RETURN 404
    b_del_convo = client.delete(f"/api/conversations/{convo_id}", headers=headers_b)
    assert b_del_convo.status_code == 404

    # 2. User A creates Task
    task_res = client.post("/api/tasks", json={
        "title": "Alpha Classified Task",
        "priority": "URGENT",
        "category": "Infiltration"
    }, headers=headers_a)
    assert task_res.status_code == 201
    task_id = task_res.json()["id"]

    # User B attempts to update User A's task -> MUST RETURN 404
    b_task_update = client.put(f"/api/tasks/{task_id}", json={"completed": True}, headers=headers_b)
    assert b_task_update.status_code == 404

    # User B attempts to delete User A's task -> MUST RETURN 404
    b_task_del = client.delete(f"/api/tasks/{task_id}", headers=headers_b)
    assert b_task_del.status_code == 404

    # User B lists tasks -> MUST NOT contain User A's task
    b_tasks = client.get("/api/tasks", headers=headers_b).json()
    assert not any(t["id"] == task_id for t in b_tasks)

    # 3. User A creates Memory
    mem_res = client.post("/api/memory", json={
        "key": "AlphaFavoriteLanguage",
        "value": "Python and Rust",
        "category": "preferences"
    }, headers=headers_a)
    assert mem_res.status_code == 201
    mem_id = mem_res.json()["id"]

    # User B attempts to update User A's memory -> MUST RETURN 404
    b_mem_update = client.put(f"/api/memory/{mem_id}", json={"value": "Hacked Value"}, headers=headers_b)
    assert b_mem_update.status_code == 404

    # User B attempts to delete User A's memory -> MUST RETURN 404
    b_mem_del = client.delete(f"/api/memory/{mem_id}", headers=headers_b)
    assert b_mem_del.status_code == 404

    # User B lists memories -> MUST NOT contain User A's memory
    b_mems = client.get("/api/memory", headers=headers_b).json()
    assert not any(m["id"] == mem_id for m in b_mems)

    # 4. Settings Isolation
    # User A updates settings
    client.put("/api/profile/settings", json={"theme": "midnight_blue"}, headers=headers_a)
    # User B settings remain default
    b_settings = client.get("/api/profile/settings", headers=headers_b).json()
    assert b_settings["theme"] == "jarvis_dark"
