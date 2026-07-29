import pytest
from app.orchestrator.ai_orchestrator import AIOrchestrator


@pytest.mark.asyncio
async def test_full_orchestrator_execution_flow():
    orchestrator = AIOrchestrator()
    request_data = {
        "session_id": "session_test_100",
        "user_id": "test_user",
        "image_base64": "demo_image_base64",
        "audio_base64": "demo_audio_base64"
    }

    response = await orchestrator.run_verification(request_data)

    assert response["status"] == "success"
    assert response["session_id"] == "session_test_100"
    assert "trust_result" in response
    assert "passport" in response
    assert response["passport"]["session_id"] == "session_test_100"
    assert "signature_token" in response["passport"]