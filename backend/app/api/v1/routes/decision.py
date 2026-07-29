from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from app.engines.decision.decision_engine import decision_engine, DecisionEngine, DecisionResult

router = APIRouter()


class DecisionEvaluateRequest(BaseModel):
    trust_score: float = Field(..., json_schema_extra={"example": 98.4})
    risk_level: str = Field(default="LOW", json_schema_extra={"example": "LOW"})
    face_liveness_passed: bool = True
    voice_verified: bool = True
    behavioral_anomaly_score: float = 0.05
    spoof_detected: bool = False


def get_decision_engine() -> DecisionEngine:
    return decision_engine


@router.post("/evaluate", response_model=DecisionResult, summary="Evaluate Governance Decision (APPROVED/REVIEW_REQUIRED/REJECTED)")
async def evaluate_decision(
    request: DecisionEvaluateRequest,
    engine: DecisionEngine = Depends(get_decision_engine)
) -> DecisionResult:
    """
    Evaluates trust score and security policies to return APPROVED, REVIEW_REQUIRED, or REJECTED with explainability.
    """
    try:
        return engine.evaluate(
            trust_score=request.trust_score,
            risk_level=request.risk_level,
            face_liveness_passed=request.face_liveness_passed,
            voice_verified=request.voice_verified,
            behavioral_anomaly_score=request.behavioral_anomaly_score,
            spoof_detected=request.spoof_detected
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Decision evaluation failed: {str(e)}"
        )
