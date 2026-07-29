import logging
from app.models.schemas.voice import VoiceAnalysisRequest, VoiceAnalysisResult
from app.services.azure_speech_service import azure_speech_service, AzureSpeechService

logger = logging.getLogger("trustgate.voice_engine")


class VoiceEngine:
    """
    Voice Engine powered by Azure AI Speech.
    Analyzes neural acoustic speaker embeddings, spectrogram similarity, and synthetic clone artifacts with failover.
    """
    def __init__(self, speech_service: AzureSpeechService = azure_speech_service):
        self.speech_service = speech_service

    async def analyze(self, request: VoiceAnalysisRequest) -> VoiceAnalysisResult:
        logger.info(f"Delegating Voice Analysis for session '{request.session_id}' to Azure AI Speech Service.")
        return await self.speech_service.analyze_voice(request.audio_base64, request.session_id, request.expected_phrase)


voice_engine = VoiceEngine()