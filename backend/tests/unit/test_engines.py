import pytest
from app.engines.face.face_engine import FaceEngine
from app.engines.voice.voice_engine import VoiceEngine
from app.engines.behavioral.behavioral_engine import BehavioralEngine
from app.engines.challenge.challenge_engine import ChallengeEngine
from app.engines.decision.decision_engine import DecisionEngine, DecisionOutcome
from app.models.schemas.face import FaceAnalysisRequest
from app.models.schemas.voice import VoiceAnalysisRequest
from app.models.schemas.behavioral import BehavioralAnalysisRequest
from app.models.schemas.challenge import ChallengeRequest, ChallengeEvaluationRequest


@pytest.mark.asyncio
async def test_face_engine_returns_typed_fields():
    engine = FaceEngine()
    req = FaceAnalysisRequest(image_base64="test_img", session_id="sess_1")
    res = await engine.analyze(req)

    assert res.confidence >= 0.0
    assert res.liveness.is_live is True
    assert res.spoof_score >= 0.0
    assert len(res.landmarks.points) > 0
    assert res.landmarks.mesh_count == 468
    assert res.processing_time > 0.0
    assert "468-mesh" in res.explanation


@pytest.mark.asyncio
async def test_voice_engine_returns_typed_fields():
    engine = VoiceEngine()
    req = VoiceAnalysisRequest(audio_base64="test_aud", session_id="sess_1")
    res = await engine.analyze(req)

    assert res.speaker_confidence >= 0.0
    assert res.spoof_probability >= 0.0
    assert res.speech_quality >= 0.0
    assert len(res.transcript) > 0
    assert "spectrogram" in res.explanation.lower()


@pytest.mark.asyncio
async def test_behavioral_engine_returns_typed_fields():
    engine = BehavioralEngine()
    req = BehavioralAnalysisRequest(session_id="sess_1", tab_switches=1)
    res = await engine.analyze(req)

    assert "rhythm_consistency" in res.typing_dynamics
    assert res.mouse_movement_score > 0.0
    assert res.anomaly_score >= 0.0
    assert "human" in res.explanation.lower()


@pytest.mark.asyncio
async def test_challenge_engine_generate_and_evaluate():
    engine = ChallengeEngine()
    gen_req = ChallengeRequest(session_id="sess_1")
    gen_res = await engine.generate_challenge(gen_req)

    assert gen_res.challenge_id.startswith("chal_")
    assert "prompt" in gen_res.challenge
    assert gen_res.confidence > 0.0

    eval_req = ChallengeEvaluationRequest(session_id="sess_1", challenge_id=gen_res.challenge_id, response_data={"passed": True})
    eval_res = await engine.evaluate_challenge(eval_req)
    assert eval_res.result == "PASSED"
    assert eval_res.confidence == 0.98


def test_decision_engine_outcomes():
    engine = DecisionEngine()

    # Approved
    res_app = engine.evaluate(trust_score=95.0, risk_level="LOW")
    assert res_app.decision == DecisionOutcome.APPROVED

    # Review Required
    res_rev = engine.evaluate(trust_score=75.0, risk_level="MEDIUM")
    assert res_rev.decision == DecisionOutcome.REVIEW_REQUIRED
    assert res_rev.requires_escalation is True

    # Rejected
    res_rej = engine.evaluate(trust_score=35.0, risk_level="CRITICAL", spoof_detected=True)
    assert res_rej.decision == DecisionOutcome.REJECTED
    assert res_rej.requires_escalation is True
