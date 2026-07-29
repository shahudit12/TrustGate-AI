from typing import Dict, Any, Optional
from datetime import datetime, timezone
from app.models.schemas.trust import VerificationSessionStatus


class SessionModel:
    def __init__(self, session_id: str, user_id: str = "demo_user"):
        self.session_id = session_id
        self.user_id = user_id
        self.status = VerificationSessionStatus.INITIALIZED
        self.created_at = datetime.now(timezone.utc).isoformat()
        self.updated_at = datetime.now(timezone.utc).isoformat()
        self.results: Dict[str, Any] = {}
        self.is_cancelled: bool = False

    def to_dict(self) -> Dict[str, Any]:
        return {
            "session_id": self.session_id,
            "user_id": self.user_id,
            "status": self.status.value if hasattr(self.status, "value") else str(self.status),
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "results": self.results,
            "is_cancelled": self.is_cancelled,
        }


class SessionRepository:
    """
    Repository for session state management following Repository Pattern.
    """
    def __init__(self):
        self._sessions: Dict[str, SessionModel] = {}

    def create(self, session_id: str, user_id: str = "demo_user") -> SessionModel:
        session = SessionModel(session_id=session_id, user_id=user_id)
        self._sessions[session_id] = session
        return session

    def get(self, session_id: str) -> Optional[SessionModel]:
        return self._sessions.get(session_id)

    def update_status(self, session_id: str, status: VerificationSessionStatus) -> Optional[SessionModel]:
        session = self.get(session_id)
        if session:
            session.status = status
            session.updated_at = datetime.now(timezone.utc).isoformat()
        return session

    def update_result(self, session_id: str, stage: str, data: Any) -> Optional[SessionModel]:
        session = self.get(session_id)
        if session:
            session.results[stage] = data
            session.updated_at = datetime.now(timezone.utc).isoformat()
        return session

    def cancel(self, session_id: str) -> Optional[SessionModel]:
        session = self.get(session_id)
        if session:
            session.is_cancelled = True
            session.status = VerificationSessionStatus.FAILED
            session.updated_at = datetime.now(timezone.utc).isoformat()
        return session

    def list_all(self) -> Dict[str, SessionModel]:
        return self._sessions


session_repository = SessionRepository()
