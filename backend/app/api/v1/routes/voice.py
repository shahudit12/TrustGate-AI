from fastapi import APIRouter, Depends, HTTPException, status
from app.models.schemas.voice import VoiceAnalysisRequest, VoiceAnalysisResult
from app.engines.voice.voice_engine import voice_engine, VoiceEngine

router = APIRouter()


def get_voice_engine() -> VoiceEngine:
    return voice_engine


@router.post("/analyze", response_model=VoiceAnalysisResult, summary="Perform Voice Acoustic Spectrogram Analysis")
async def analyze_voice(
    request: VoiceAnalysisRequest,
    engine: VoiceEngine = Depends(get_voice_engine)
) -> VoiceAnalysisResult:
    """
    Analyzes vocal acoustic spectrogram, speaker confidence, synthetic clone probability, and audio quality.
    """
    try:
        return await engine.analyze(request)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Voice analysis failed: {str(e)}"
        )
