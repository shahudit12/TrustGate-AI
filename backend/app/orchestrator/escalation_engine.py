from typing import Dict, Any
from app.models.schemas.trust import RiskLevel


class EscalationEngine:
    def evaluate_escalation(self, risk_level: RiskLevel, score: float) -> Dict[str, Any]:
        if risk_level == RiskLevel.CRITICAL or score < 40.0:
            return {
                "escalated": True,
                "reason": "Critical risk score below threshold",
                "action": "BLOCK_SESSION_REQUIRE_MANUAL_AUDIT"
            }
        elif risk_level == RiskLevel.HIGH:
            return {
                "escalated": True,
                "reason": "High risk detected",
                "action": "REQUIRE_ADDITIONAL_BIOMETRIC_CHALLENGE"
            }
        return {"escalated": False, "action": "ALLOW"}
