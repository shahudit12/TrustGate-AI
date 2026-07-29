"""
TrustGate AI — Trust Calculator

Calculates weighted trust scores across Face, Voice, and Behavioral components.
"""
from typing import Optional, Dict, Any
from app.models.schemas.trust import RiskLevel, TrustComponent
from app.risk.risk_levels import (
    FACE_WEIGHT,
    VOICE_WEIGHT,
    BEHAVIORAL_WEIGHT,
    RISK_THRESHOLD_LOW,
    RISK_THRESHOLD_MEDIUM,
    RISK_THRESHOLD_HIGH,
    determine_risk_level,
)

class TrustCalculator:
    def calculate(
        self,
        face_result: Optional[Any] = None,
        voice_result: Optional[Any] = None,
        behavioral_result: Optional[Any] = None,
        challenge_result: Optional[Any] = None,
    ) -> Dict[str, Any]:
        """
        Calculates composite score (0-100) and component breakdown.
        """
        total_weight = 0.0
        weighted_score = 0.0
        components = {}

        if face_result is not None:
            # Face component score (0-100)
            score = getattr(face_result, "overall_confidence", 0.85) * 100
            components["face"] = TrustComponent(score=score, confidence=0.95, weight=FACE_WEIGHT)
            weighted_score += score * FACE_WEIGHT
            total_weight += FACE_WEIGHT

        if voice_result is not None:
            score = getattr(voice_result, "overall_confidence", 0.85) * 100
            components["voice"] = TrustComponent(score=score, confidence=0.90, weight=VOICE_WEIGHT)
            weighted_score += score * VOICE_WEIGHT
            total_weight += VOICE_WEIGHT

        if behavioral_result is not None:
            score = getattr(behavioral_result, "overall_confidence", 0.85) * 100
            components["behavioral"] = TrustComponent(score=score, confidence=0.85, weight=BEHAVIORAL_WEIGHT)
            weighted_score += score * BEHAVIORAL_WEIGHT
            total_weight += BEHAVIORAL_WEIGHT

        if total_weight > 0:
            final_score = round(weighted_score / total_weight, 1)
        else:
            final_score = 85.0  # Default baseline in demo/fallback

        risk_level = determine_risk_level(final_score)

        return {
            "overall_score": final_score,
            "risk_level": risk_level,
            "components": components,
        }
