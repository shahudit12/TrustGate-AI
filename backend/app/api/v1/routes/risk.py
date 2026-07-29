from fastapi import APIRouter, Depends, HTTPException, status
from app.models.schemas.risk import RiskComputeRequest, RiskComputeResponse
from app.risk.risk_engine import risk_engine, RiskEngine
from app.models.schemas.face import FaceAnalysisResult

router = APIRouter()


def get_risk_engine() -> RiskEngine:
    return risk_engine


@router.post("/compute", response_model=RiskComputeResponse, summary="Compute Multi-Modal Risk Synthesis")
async def compute_risk(
    request: RiskComputeRequest,
    engine: RiskEngine = Depends(get_risk_engine)
) -> RiskComputeResponse:
    """
    Synthesizes Face, Voice, Behavioral, and Challenge signals to compute overall risk score,
    feature contributions, and XAI explainability factors.
    """
    try:
        dummy_face = FaceAnalysisResult(
            confidence=request.face_confidence,
            overall_confidence=request.face_confidence,
            spoof_score=1.0 - request.face_confidence
        )
        return engine.compute_detailed_response(
            session_id=request.session_id,
            face_result=dummy_face
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Risk computation failed: {str(e)}"
        )
