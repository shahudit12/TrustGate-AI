from app.repositories.session_repository import SessionRepository, VerificationSessionStatus
from app.repositories.audit_repository import AuditRepository
from app.repositories.passport_repository import PassportRepository


def test_session_repository_lifecycle():
    repo = SessionRepository()
    sess = repo.create("sess_test_1", "user_100")
    assert sess.session_id == "sess_test_1"
    assert sess.status == VerificationSessionStatus.INITIALIZED

    repo.update_status("sess_test_1", VerificationSessionStatus.FACE_ANALYZING)
    updated = repo.get("sess_test_1")
    assert updated.status == VerificationSessionStatus.FACE_ANALYZING

    repo.update_result("sess_test_1", "face", {"confidence": 0.98})
    assert updated.results["face"]["confidence"] == 0.98

    repo.cancel("sess_test_1")
    assert updated.is_cancelled is True
    assert updated.status == VerificationSessionStatus.FAILED


def test_audit_repository_logging():
    repo = AuditRepository()
    entry = repo.record_event(
        session_id="sess_test_1",
        component="FACE_ENGINE",
        action="ANALYZE",
        duration_ms=120.5,
        status="SUCCESS",
        metadata={"mesh": 468}
    )
    assert entry.session_id == "sess_test_1"
    assert entry.component == "FACE_ENGINE"
    assert entry.duration_ms == 120.5

    logs = repo.get_by_session("sess_test_1")
    assert len(logs) == 1
    assert logs[0].action == "ANALYZE"


def test_passport_repository_storage():
    repo = PassportRepository()
    p_data = {"passport_id": "TP-AZURE-100", "session_id": "sess_100", "risk": "LOW", "trust_score": 98.4}
    repo.save("TP-AZURE-100", p_data)

    retrieved = repo.get("TP-AZURE-100")
    assert retrieved["session_id"] == "sess_100"

    by_sess = repo.find_by_session("sess_100")
    assert by_sess["passport_id"] == "TP-AZURE-100"

    low_risk = repo.list_all(risk_filter="LOW")
    assert len(low_risk) == 1
