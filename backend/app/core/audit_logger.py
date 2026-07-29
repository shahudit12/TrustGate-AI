import logging
from pydantic import BaseModel, Field
from datetime import datetime, timezone
from typing import Dict, Any


class AuditEvent(BaseModel):
    session_id: str
    event_type: str
    user_context: str
    details: Dict[str, Any]
    severity: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class AuditLogger:
    def __init__(self):
        self.logger = logging.getLogger("trustgate.audit")
        self.logger.setLevel(logging.INFO)
        handler = logging.StreamHandler()
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        handler.setFormatter(formatter)
        if not self.logger.handlers:
            self.logger.addHandler(handler)

    async def log_event(self, session_id: str, event_type: str, user_context: str, details: dict, severity: str):
        event = AuditEvent(
            session_id=session_id,
            event_type=event_type,
            user_context=user_context,
            details=details,
            severity=severity
        )
        self.logger.info(f"AUDIT_EVENT: {event.model_dump_json()}")