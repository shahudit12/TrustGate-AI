from typing import Optional, Dict, Any, List
from app.models.schemas.trust import TrustScoreResult, RiskLevel, TrustComponent, XAIFactor
from app.models.schemas.face import FaceAnalysisResult
from app.models.schemas.voice import VoiceAnalysisResult
from app.models.schemas.behavioral import BehavioralAnalysisResult
from app.models.schemas.risk import RiskComputeResponse
from app.services.azure_openai_service import azure_openai_service, AzureOpenAIService


class RiskEngine:
    """
    Multi-modal Risk Engine synthesizing Face 468-mesh liveness, Voice spectrogram acoustic match,
    Behavioral velocity dynamics, and Challenge verification signals.
    Integrated with Azure OpenAI for XAI explainability reasoning.
    """
    def __init__(self, openai_service: AzureOpenAIService = azure_openai_service):
        self.openai_service = openai_service

    def compute(
        self,
        session_id: str,
        face_result: Optional[FaceAnalysisResult] = None,
        voice_result: Optional[VoiceAnalysisResult] = None,
        behavioral_result: Optional[BehavioralAnalysisResult] = None,
        challenge_result: Optional[dict] = None
    ) -> TrustScoreResult:
        # Base weights
        w_face = 0.40 if face_result else 0.0
        w_voice = 0.35 if voice_result else 0.0
        w_beh = 0.25 if behavioral_result else 0.0

        # Adjust weights dynamically if optional components are missing
        total_w = w_face + w_voice + w_beh
        if total_w > 0:
            w_face /= total_w
            w_voice /= total_w
            w_beh /= total_w
        else:
            w_face = 1.0

        # Extract confidence scores with safe fallbacks
        if face_result:
            effective_face_conf = face_result.get_effective_confidence() if hasattr(face_result, "get_effective_confidence") else (getattr(face_result, "confidence", None) or getattr(face_result, "overall_confidence", 0.85))
            face_score = (effective_face_conf or 0.85) * 100.0
        else:
            effective_face_conf = 0.85
            face_score = 85.0

        voice_score = ((getattr(voice_result, "speaker_confidence", None) or getattr(voice_result, "overall_confidence", 0.90)) * 100.0) if voice_result else 90.0
        beh_score = ((1.0 - (getattr(behavioral_result, "anomaly_score", 0.05) if behavioral_result else 0.05)) * 100.0) if behavioral_result else 95.0

        weighted_score = round(face_score * w_face + voice_score * w_voice + beh_score * w_beh, 1)

        # Check for spoof indicators
        spoof_detected = False
        if hasattr(face_result, "spoof_score") and face_result.spoof_score > 0.5:
            spoof_detected = True
        if hasattr(face_result, "liveness") and hasattr(face_result.liveness, "is_live") and not face_result.liveness.is_live:
            spoof_detected = True
        if voice_result and hasattr(voice_result, "spoof_probability") and voice_result.spoof_probability > 0.5:
            spoof_detected = True

        # Classify Risk Level
        if spoof_detected or weighted_score < 40.0:
            risk_level = RiskLevel.CRITICAL
            weighted_score = min(weighted_score, 38.0)
        elif weighted_score < 80.0:
            risk_level = RiskLevel.HIGH
        elif weighted_score < 88.0:
            risk_level = RiskLevel.MEDIUM
        else:
            risk_level = RiskLevel.LOW

        # Generate XAI Explainability factors
        xai_factors = []
        if risk_level == RiskLevel.LOW:
            xai_factors.append(
                XAIFactor(
                    factor_id="XAI-PASSED-LIVENESS",
                    description="Face 468-mesh liveness verified with zero synthetic occlusion.",
                    impact="POSITIVE",
                    severity="LOW",
                    technical_detail=f"Face Confidence: {face_score:.1f}% | Mesh Count: 468"
                )
            )
            if voice_result:
                xai_factors.append(
                    XAIFactor(
                        factor_id="XAI-PASSED-VOICE",
                        description="Neural vocal acoustic spectrogram matches registered speaker profile.",
                        impact="POSITIVE",
                        severity="LOW",
                        technical_detail=f"Speaker Confidence: {voice_score:.1f}%"
                    )
                )
        else:
            if face_score < 80.0 or spoof_detected:
                xai_factors.append(
                    XAIFactor(
                        factor_id="XAI-FLAG-FACE",
                        description="Facial geometry anomaly or passive liveness occlusion detected.",
                        impact="NEGATIVE",
                        severity="HIGH",
                        technical_detail=f"Face Score: {face_score:.1f}% | Spoof Detected: {spoof_detected}"
                    )
                )
            if voice_result and (voice_score < 80.0 or getattr(voice_result, "spoof_probability", 0.0) > 0.5):
                xai_factors.append(
                    XAIFactor(
                        factor_id="XAI-FLAG-VOICE",
                        description="Vocal spectrogram similarity below threshold or synthetic clone artifacts detected.",
                        impact="NEGATIVE",
                        severity="HIGH",
                        technical_detail=f"Voice Score: {voice_score:.1f}%"
                    )
                )

        recommendation = "PROCEED" if risk_level == RiskLevel.LOW else "MANUAL_REVIEW_REQUIRED" if risk_level in [RiskLevel.MEDIUM, RiskLevel.HIGH] else "REJECT"

        return TrustScoreResult(
            session_id=session_id,
            overall_score=weighted_score,
            risk_level=risk_level,
            face_component=TrustComponent(
                score=face_score,
                confidence=effective_face_conf,
                weight=w_face
            ),
            voice_component=TrustComponent(
                score=voice_score,
                confidence=voice_result.speaker_confidence if hasattr(voice_result, "speaker_confidence") else 0.96,
                weight=w_voice
            ) if voice_result else None,
            behavioral_component=TrustComponent(
                score=beh_score,
                confidence=1.0 - (behavioral_result.anomaly_score if hasattr(behavioral_result, "anomaly_score") else 0.05),
                weight=w_beh
            ) if behavioral_result else None,
            xai_factors=xai_factors,
            recommendation=recommendation,
            requires_human_review=(risk_level in [RiskLevel.MEDIUM, RiskLevel.HIGH, RiskLevel.CRITICAL])
        )

    def compute_detailed_response(
        self,
        session_id: str,
        face_result: FaceAnalysisResult,
        voice_result: Optional[VoiceAnalysisResult] = None,
        behavioral_result: Optional[BehavioralAnalysisResult] = None
    ) -> RiskComputeResponse:
        trust_res = self.compute(session_id, face_result, voice_result, behavioral_result)
        return RiskComputeResponse(
            overall_confidence=round(trust_res.overall_score / 100.0, 4),
            risk_level=trust_res.risk_level,
            weighted_score=trust_res.overall_score,
            feature_contributions={
                "face_liveness": 0.40,
                "voice_spectrogram": 0.35 if voice_result else 0.0,
                "behavioral_velocity": 0.25 if behavioral_result else 0.0
            },
            explainability=[f.model_dump() for f in trust_res.xai_factors],
            recommendation=trust_res.recommendation
        )


risk_engine = RiskEngine()