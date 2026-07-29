import logging
from app.models.schemas.face import FaceAnalysisRequest, FaceAnalysisResult
from app.services.azure_vision_service import azure_vision_service, AzureVisionService

logger = logging.getLogger("trustgate.face_engine")


class FaceEngine:
    """
    Face Engine powered by Azure AI Vision.
    Maps 468-point 3D facial landmark mesh, passive liveness, and spoof score with failover.
    """
    def __init__(self, vision_service: AzureVisionService = azure_vision_service):
        self.vision_service = vision_service

    async def analyze(self, request: FaceAnalysisRequest) -> FaceAnalysisResult:
        logger.info(f"Delegating Face Analysis for session '{request.session_id}' to Azure AI Vision Service.")
        return await self.vision_service.analyze_face(request.image_base64, request.session_id)


face_engine = FaceEngine()