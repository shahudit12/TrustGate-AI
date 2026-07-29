import time
from typing import Dict, Any, Optional
from app.models.schemas.trust import VerificationSessionStatus


class SessionManager:
    def __init__(self):
        self.sessions: Dict[str, Dict[str, Any]] = {}

    def create_session(self, session_id: str, user_id: str = "demo_user") -> Dict[str, Any]:
        sid = (session_id or "").strip()
        if not sid:
            raise ValueError("session_id cannot be empty")
        session_data = {
            "session_id": sid,
            "user_id": user_id or "demo_user",
            "status": VerificationSessionStatus.INITIALIZED,
            "created_at": time.time(),
            "updated_at": time.time(),
            "results": {}
        }
        self.sessions[sid] = session_data
        return session_data

    def get_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        if not session_id or not isinstance(session_id, str):
            return None
        return self.sessions.get(session_id.strip())

    def update_status(self, session_id: str, new_status: VerificationSessionStatus) -> Optional[Dict[str, Any]]:
        if not session_id or not isinstance(session_id, str):
            return None
        session = self.sessions.get(session_id.strip())
        if session:
            session["status"] = new_status
            session["updated_at"] = time.time()
        return session
