from fastapi import APIRouter, Depends, HTTPException, status
from app.models.schemas.behavioral import BehavioralAnalysisRequest, BehavioralAnalysisResult
from app.engines.behavioral.behavioral_engine import behavioral_engine, BehavioralEngine

router = APIRouter()


def get_behavioral_engine() -> BehavioralEngine:
    return behavioral_engine


@router.post("/analyze", response_model=BehavioralAnalysisResult, summary="Perform Behavioral Telemetry Analysis")
async def analyze_behavioral(
    request: BehavioralAnalysisRequest,
    engine: BehavioralEngine = Depends(get_behavioral_engine)
) -> BehavioralAnalysisResult:
    """
    Analyzes mouse velocity dynamics, keyboard flight/dwell timing, and automation bot signals.
    """
    try:
        return await engine.analyze(request)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Behavioral analysis failed: {str(e)}"
        )


@router.post("/submit", response_model=BehavioralAnalysisResult, summary="Submit Behavioral Telemetry (Alias)")
async def submit_behavioral(
    request: BehavioralAnalysisRequest,
    engine: BehavioralEngine = Depends(get_behavioral_engine)
) -> BehavioralAnalysisResult:
    return await engine.analyze(request)
