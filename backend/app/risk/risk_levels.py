"""
TrustGate AI — Risk Levels & Thresholds
"""
from enum import Enum

class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

RISK_THRESHOLD_LOW = 80.0
RISK_THRESHOLD_MEDIUM = 60.0
RISK_THRESHOLD_HIGH = 40.0

FACE_WEIGHT = 0.40
VOICE_WEIGHT = 0.35
BEHAVIORAL_WEIGHT = 0.25

def determine_risk_level(score: float) -> RiskLevel:
    if score >= RISK_THRESHOLD_LOW:
        return RiskLevel.LOW
    elif score >= RISK_THRESHOLD_MEDIUM:
        return RiskLevel.MEDIUM
    elif score >= RISK_THRESHOLD_HIGH:
        return RiskLevel.HIGH
    else:
        return RiskLevel.CRITICAL
