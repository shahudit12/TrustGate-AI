import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_face_analyze_endpoint():
    payload = {"image_base64": "test_face_image", "session_id": "sess_api_1"}
    response = client.post("/api/v1/face/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "confidence" in data
    assert "liveness" in data
    assert "spoof_score" in data
    assert "landmarks" in data
    assert "processing_time" in data
    assert "explanation" in data


def test_voice_analyze_endpoint():
    payload = {"audio_base64": "test_voice_audio", "session_id": "sess_api_1"}
    response = client.post("/api/v1/voice/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "speaker_confidence" in data
    assert "spoof_probability" in data
    assert "speech_quality" in data
    assert "transcript" in data
    assert "explanation" in data


def test_behavioral_analyze_endpoint():
    payload = {"session_id": "sess_api_1", "tab_switches": 0}
    response = client.post("/api/v1/behavioral/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "typing_dynamics" in data
    assert "mouse_movement_score" in data
    assert "anomaly_score" in data
    assert "explanation" in data


def test_challenge_endpoints():
    gen_res = client.post("/api/v1/challenge/generate", json={"session_id": "sess_api_1"})
    assert gen_res.status_code == 200
    gen_data = gen_res.json()
    assert "challenge" in gen_data
    assert "prompt" in gen_data

    eval_res = client.post("/api/v1/challenge/evaluate", json={
        "session_id": "sess_api_1",
        "challenge_id": gen_data["challenge_id"],
        "response_data": {"passed": True}
    })
    assert eval_res.status_code == 200
    assert eval_res.json()["result"] == "PASSED"


def test_risk_compute_endpoint():
    payload = {"session_id": "sess_api_1", "face_confidence": 0.98}
    response = client.post("/api/v1/risk/compute", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "overall_confidence" in data
    assert "risk_level" in data
    assert "weighted_score" in data
    assert "feature_contributions" in data
    assert "explainability" in data


def test_decision_evaluate_endpoint():
    payload = {"trust_score": 98.4, "risk_level": "LOW"}
    response = client.post("/api/v1/decision/evaluate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["decision"] == "APPROVED"
    assert "explanation" in data


def test_orchestrator_pipeline_endpoint():
    payload = {
        "session_id": "sess_api_full_flow",
        "user_id": "api_test_user",
        "image_base64": "demo_image",
        "audio_base64": "demo_audio"
    }
    response = client.post("/api/v1/orchestrator/verify/run", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["session_id"] == "sess_api_full_flow"
    assert "passport" in data
    assert "decision" in data
    assert "report" in data


def test_passport_endpoints():
    list_res = client.get("/api/v1/passport/list")
    assert list_res.status_code == 200
    assert len(list_res.json()["passports"]) > 0

    get_res = client.get("/api/v1/passport/TP-AZURE-99842")
    assert get_res.status_code == 200
    assert get_res.json()["passport_id"] == "TP-AZURE-99842"


def test_reports_endpoint():
    rep_res = client.get("/api/v1/reports/sess_api_full_flow")
    assert rep_res.status_code == 200
    data = rep_res.json()
    assert data["session_id"] == "sess_api_full_flow"
    assert "trust_score" in data
    assert "vector_matrix" in data
