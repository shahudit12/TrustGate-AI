from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from app.models.schemas.trust import RiskLevel, TrustComponent, XAIFactor


class RiskComputeRequest(BaseModel):
    session_id: str = Field(default="sess_demo")
    face_confidence: float = 0.98
    voice_confidence: Optional[float] = 0.96
    behavioral_anomaly_score: Optional[float] = 0.05
    challenge_confidence: Optional[float] = 0.98


class RiskComputeResponse(BaseModel):
    overall_confidence: float = 0.96
    risk_level: RiskLevel = RiskLevel.LOW
    weighted_score: float = 98.4
    feature_contributions: Dict[str, float] = Field(default_factory=lambda: {
        "face_liveness": 0.40,
        "voice_spectrogram": 0.35,
        "behavioral_velocity": 0.25
    })
    explainability: List[Dict[str, Any]] = Field(default_factory=list)
    recommendation: str = "PROCEED"
