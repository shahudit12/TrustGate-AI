import pytest
import asyncio
from app.orchestrator.ai_orchestrator import AIOrchestrator
from app.repositories.session_repository import SessionRepository
from app.repositories.audit_repository import AuditRepository


@pytest.mark.asyncio
async def test_full_pipeline_orchestration_with_report():
    session_repo = SessionRepository()
    audit_repo = AuditRepository()
    orchestrator = AIOrchestrator(session_repo=session_repo, audit_repo=audit_repo)

    req_data = {
        "session_id": "sess_integration_99",
        "user_id": "ciso_user",
        "image_base64": "demo_face_data",
        "audio_base64": "demo_voice_data",
        "behavioral": {"tab_switches": 0}
    }

    result = await orchestrator.run_verification(req_data)

    assert result["status"] == "success"
    assert result["session_id"] == "sess_integration_99"
    assert "trust_result" in result
    assert "decision" in result
    assert "passport" in result
    assert "report" in result
    assert result["decision"]["decision"] == "APPROVED"
    assert result["passport"]["passport_id"].startswith("TP-AZURE-")
    assert result["report"]["session_id"] == "sess_integration_99"

    # Check audit log entries
    session_audit = audit_repo.get_by_session("sess_integration_99")
    assert len(session_audit) >= 6
    components = [e.component for e in session_audit]
    assert "SESSION_ENGINE" in components
    assert "FACE_ENGINE" in components
    assert "RISK_ENGINE" in components
    assert "DECISION_ENGINE" in components
    assert "PASSPORT_SERVICE" in components


@pytest.mark.asyncio
async def test_pipeline_timeout_handling():
    orchestrator = AIOrchestrator()

    # Mock face_engine to sleep longer than timeout
    class SlowFaceEngine:
        async def analyze(self, req):
            await asyncio.sleep(2.0)

    orchestrator.face_engine = SlowFaceEngine()

    req_data = {"session_id": "sess_slow_100"}

    with pytest.raises(TimeoutError):
        await orchestrator.run_verification(req_data, timeout_seconds=0.1)


@pytest.mark.asyncio
async def test_pipeline_partial_failure_graceful_degradation():
    orchestrator = AIOrchestrator()

    # Mock voice engine to fail
    class FailingVoiceEngine:
        async def analyze(self, req):
            raise RuntimeError("Azure AI Speech microservice unreachable")

    orchestrator.voice_engine = FailingVoiceEngine()

    req_data = {
        "session_id": "sess_partial_fail_101",
        "audio_base64": "trigger_voice_step"
    }

    # Should not throw exception, but gracefully complete with audit warning
    result = await orchestrator.run_verification(req_data)
    assert result["status"] == "success"
    assert result["session_id"] == "sess_partial_fail_101"
