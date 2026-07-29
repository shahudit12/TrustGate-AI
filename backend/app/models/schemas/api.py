from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from app.models.schemas.trust import VerificationSessionStatus, RiskLevel


class StatusResponse(BaseModel):
    status: str = Field(..., json_schema_extra={"example": "healthy"})
    service: str = Field(..., json_schema_extra={"example": "TrustGate AI"})
    message: Optional[str] = Field(default=None, json_schema_extra={"example": "Service operational"})


class TrustScoreRequest(BaseModel):
    session_id: str = Field(..., json_schema_extra={"example": "session_123"})


class TrustScoreResponseModel(BaseModel):
    score: float = Field(..., json_schema_extra={"example": 85.0})
    risk_level: RiskLevel = Field(..., json_schema_extra={"example": RiskLevel.LOW})
    session_id: str = Field(..., json_schema_extra={"example": "session_123"})
    components: Optional[Dict[str, Any]] = None
    xai_factors: Optional[List[Dict[str, Any]]] = None
    recommendation: Optional[str] = "PROCEED"


class TrustHistoryResponseModel(BaseModel):
    history: List[Dict[str, Any]] = Field(default_factory=list)


class StartVerificationRequest(BaseModel):
    user_id: Optional[str] = Field(default="demo_user", json_schema_extra={"example": "user_456"})


class StartVerificationResponse(BaseModel):
    session_id: str = Field(..., json_schema_extra={"example": "session_123"})
    status: VerificationSessionStatus = Field(..., json_schema_extra={"example": VerificationSessionStatus.INITIALIZED})


class VerificationStatusResponse(BaseModel):
    session_id: str = Field(..., json_schema_extra={"example": "session_123"})
    status: VerificationSessionStatus = Field(..., json_schema_extra={"example": VerificationSessionStatus.FACE_ANALYZING})


class VerificationResultResponse(BaseModel):
    session_id: str = Field(..., json_schema_extra={"example": "session_123"})
    result: str = Field(..., json_schema_extra={"example": "PASSED"})
    trust_score: Optional[float] = 98.4
    risk_level: Optional[str] = "LOW"
    passport_id: Optional[str] = "TP-AZURE-99842"
    ai_summary: Optional[str] = None


class ReportResponseModel(BaseModel):
    session_id: str = Field(..., json_schema_extra={"example": "session_123"})
    passport_id: Optional[str] = "TP-AZURE-99842"
    trust_score: float = 98.4
    risk_level: str = "LOW"
    issued_date: Optional[str] = None
    xai_reasoning: Optional[str] = None
    vector_matrix: List[Dict[str, Any]] = Field(default_factory=list)
    signature_hash: Optional[str] = None


class PassportResponseModel(BaseModel):
    passport_id: str = Field(..., json_schema_extra={"example": "passport_789"})
    passport: Dict[str, Any] = Field(default_factory=dict)


class PassportListResponse(BaseModel):
    passports: List[Dict[str, Any]] = Field(default_factory=list)
    total: int = 0


class ChatMessageRequest(BaseModel):
    message: str = Field(..., json_schema_extra={"example": "Verify user status"})
    domain: Optional[str] = Field(default="general", json_schema_extra={"example": "finance"})
    session_id: Optional[str] = Field(default=None, json_schema_extra={"example": "TP-AZURE-99842"})


class ChatMessageResponse(BaseModel):
    id: str = Field(..., json_schema_extra={"example": "ai-123456789"})
    role: str = Field(default="ai", json_schema_extra={"example": "ai"})
    message: str = Field(..., json_schema_extra={"example": "Verified access granted."})
    code_snippet: Optional[str] = None
    reasoning: Optional[Dict[str, Any]] = None


class DashboardStatsResponse(BaseModel):
    kpis: Dict[str, Any] = Field(default_factory=dict)
    funnel: List[Dict[str, Any]] = Field(default_factory=list)
    timeline: List[Dict[str, Any]] = Field(default_factory=list)
    risk_distribution: List[Dict[str, Any]] = Field(default_factory=list)
    devices: List[Dict[str, Any]] = Field(default_factory=list)


class TelemetryResponse(BaseModel):
    services: List[Dict[str, Any]] = Field(default_factory=list)


class PolicyRequest(BaseModel):
    policy_id: str
    action: str = "enforce"


class PolicyResponse(BaseModel):
    success: bool
    policy_id: str
    status: str
    message: str

