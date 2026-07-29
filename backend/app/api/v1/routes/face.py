from fastapi import APIRouter, Depends, HTTPException, status
from app.models.schemas.face import FaceAnalysisRequest, FaceAnalysisResult
from app.engines.face.face_engine import face_engine, FaceEngine

router = APIRouter()


def get_face_engine() -> FaceEngine:
    return face_engine


@router.post("/analyze", response_model=FaceAnalysisResult, summary="Perform Face Liveness & 468-Mesh Analysis")
async def analyze_face(
    request: FaceAnalysisRequest,
    engine: FaceEngine = Depends(get_face_engine)
) -> FaceAnalysisResult:
    """
    Analyzes facial geometry, 468-point 3D landmark mesh, passive liveness, and spoof probability.
    """
    try:
        return await engine.analyze(request)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Face analysis failed: {str(e)}"
        )
