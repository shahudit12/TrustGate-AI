from app.models.schemas.trust import RiskLevel


class AdaptiveRouter:
    def should_require_voice(self, risk_level: RiskLevel, face_confidence: float) -> bool:
        return risk_level != RiskLevel.LOW or face_confidence < 0.9

    def should_require_behavioral(self, risk_level: RiskLevel) -> bool:
        return risk_level in [RiskLevel.MEDIUM, RiskLevel.HIGH, RiskLevel.CRITICAL]

    def should_require_challenge(self, risk_level: RiskLevel) -> bool:
        return risk_level in [RiskLevel.HIGH, RiskLevel.CRITICAL]
