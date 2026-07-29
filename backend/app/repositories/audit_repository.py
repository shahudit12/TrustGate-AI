from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
from pydantic import BaseModel, Field


class AuditEntryModel(BaseModel):
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    session_id: str
    component: str
    action: str
    duration_ms: float = 0.0
    status: str = "SUCCESS"
    metadata: Dict[str, Any] = Field(default_factory=dict)
    severity: str = "INFO"


class AuditRepository:
    """
    Repository for storing and querying structured verification audit logs.
    """
    def __init__(self):
        self._audit_logs: List[AuditEntryModel] = []

    def record_event(
        self,
        session_id: str,
        component: str,
        action: str,
        duration_ms: float = 0.0,
        status: str = "SUCCESS",
        metadata: Optional[Dict[str, Any]] = None,
        severity: str = "INFO"
    ) -> AuditEntryModel:
        entry = AuditEntryModel(
            session_id=session_id,
            component=component,
            action=action,
            duration_ms=duration_ms,
            status=status,
            metadata=metadata or {},
            severity=severity
        )
        self._audit_logs.append(entry)
        return entry

    def get_by_session(self, session_id: str) -> List[AuditEntryModel]:
        return [entry for entry in self._audit_logs if entry.session_id == session_id]

    def get_all(self) -> List[AuditEntryModel]:
        return self._audit_logs


audit_repository = AuditRepository()
