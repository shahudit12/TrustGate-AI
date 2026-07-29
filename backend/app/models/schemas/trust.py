from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum


class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class TrustComponent(BaseModel):
    score: float
    confidence: float
    weight: float


class XAIFactor(BaseModel):
    factor_id: str
    description: str
    impact: str
    severity: str
    technical_detail: str


class TrustScoreResult(BaseModel):
    session_id: str
    overall_score: float
    risk_level: RiskLevel
    face_component: TrustComponent
    voice_component: Optional[TrustComponent] = None
    behavioral_component: Optional[TrustComponent] = None
    xai_factors: List[XAIFactor] = Field(default_factory=list)
    recommendation: str
    requires_human_review: bool


class VerificationSessionStatus(str, Enum):
    INITIALIZED = "INITIALIZED"
    FACE_ANALYZING = "FACE_ANALYZING"
    VOICE_ANALYZING = "VOICE_ANALYZING"
    BEHAVIORAL_ANALYZING = "BEHAVIORAL_ANALYZING"
    CHALLENGE_RUNNING = "CHALLENGE_RUNNING"
    RISK_COMPUTING = "RISK_COMPUTING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    ESCALATED = "ESCALATED"