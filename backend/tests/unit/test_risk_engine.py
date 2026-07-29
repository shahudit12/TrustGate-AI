import pytest
from app.risk.risk_engine import RiskEngine
from app.models.schemas.face import (
    FaceAnalysisResult,
    BlinkResult,
    HeadPoseResult,
    LivenessResult,
    SpoofResult,
    VirtualCameraResult,
)
from app.models.schemas.trust import RiskLevel


def test_low_risk_score_calculation():
    engine = RiskEngine()

    face_result = FaceAnalysisResult(
        blink=BlinkResult(left_ear=0.2, right_ear=0.2, blink_detected=True, blink_count=1),
        head_pose=HeadPoseResult(pitch=0.0, yaw=0.0, roll=0.0, looking_forward=True),
        liveness=LivenessResult(is_live=True, confidence=0.9, method="ensemble"),
        spoof=SpoofResult(is_spoof=False, spoof_type="NONE", confidence=0.9),
        virtual_camera=VirtualCameraResult(detected=False, indicators=[]),
        overall_confidence=0.95,
        face_count=1,
        processing_time_ms=120.5,
    )

    result = engine.compute(session_id="123", face_result=face_result)
    assert result.overall_score >= 80.0
    assert result.risk_level == RiskLevel.LOW


def test_high_risk_score_calculation():
    engine = RiskEngine()

    face_result = FaceAnalysisResult(
        overall_confidence=0.5,
        face_count=1,
        processing_time_ms=120.5,
    )

    result = engine.compute(session_id="123", face_result=face_result)
    assert result.overall_score < 80.0
    assert len(result.xai_factors) >= 0