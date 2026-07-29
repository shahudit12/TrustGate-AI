from fastapi import APIRouter, Depends, HTTPException, status
from app.models.schemas.challenge import ChallengeRequest, ChallengeResponse, ChallengeEvaluationRequest
from app.engines.challenge.challenge_engine import challenge_engine, ChallengeEngine

router = APIRouter()


def get_challenge_engine() -> ChallengeEngine:
    return challenge_engine


@router.post("/generate", response_model=ChallengeResponse, summary="Generate Adaptive Verification Challenge")
async def generate_challenge(
    request: ChallengeRequest,
    engine: ChallengeEngine = Depends(get_challenge_engine)
) -> ChallengeResponse:
    """
    Generates dynamic adaptive liveness challenges (blink, head turn, passphrase reading).
    """
    try:
        return await engine.generate_challenge(request)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Challenge generation failed: {str(e)}"
        )


@router.post("/evaluate", response_model=ChallengeResponse, summary="Evaluate Adaptive Challenge Response")
async def evaluate_challenge(
    request: ChallengeEvaluationRequest,
    engine: ChallengeEngine = Depends(get_challenge_engine)
) -> ChallengeResponse:
    """
    Evaluates completed adaptive verification challenge response.
    """
    try:
        return await engine.evaluate_challenge(request)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Challenge evaluation failed: {str(e)}"
        )
