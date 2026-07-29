from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any


class FaceAnalysisRequest(BaseModel):
    image_base64: str = Field(default="demo_image")
    session_id: str = Field(default="sess_demo")
    timestamp: float = Field(default=0.0)


class FaceLandmarks(BaseModel):
    points: List[List[float]] = Field(default_factory=list)
    mesh_count: int = 468


class BlinkResult(BaseModel):
    left_ear: float = 0.2
    right_ear: float = 0.2
    blink_detected: bool = True
    blink_count: int = 1


class HeadPoseResult(BaseModel):
    pitch: float = 0.0
    yaw: float = 0.0
    roll: float = 0.0
    looking_forward: bool = True


class LivenessResult(BaseModel):
    is_live: bool = True
    confidence: float = 0.98
    method: str = "ensemble_468_mesh"


class SpoofResult(BaseModel):
    is_spoof: bool = False
    spoof_type: str = "NONE"
    confidence: float = 0.98


class VirtualCameraResult(BaseModel):
    detected: bool = False
    indicators: List[str] = Field(default_factory=list)


class FaceAnalysisResult(BaseModel):
    confidence: Optional[float] = None
    liveness: LivenessResult = Field(default_factory=LivenessResult)
    spoof_score: float = Field(default=0.02, json_schema_extra={"example": 0.02})
    landmarks: FaceLandmarks = Field(default_factory=FaceLandmarks)
    processing_time: float = Field(default=0.1205, json_schema_extra={"example": 0.1205})
    explanation: str = Field(default="Passed 468-mesh facial liveness analysis with high confidence.", json_schema_extra={"example": "Passed 468-mesh facial liveness analysis."})

    # Extended legacy / detailed attributes
    blink: Optional[BlinkResult] = None
    head_pose: Optional[HeadPoseResult] = None
    spoof: Optional[SpoofResult] = None
    virtual_camera: Optional[VirtualCameraResult] = None
    overall_confidence: float = 0.98
    face_count: int = 1
    processing_time_ms: float = 120.5

    def get_effective_confidence(self) -> float:
        if self.confidence is not None:
            return self.confidence
        return self.overall_confidence


class FaceWebSocketMessage(BaseModel):
    type: str
    data: dict