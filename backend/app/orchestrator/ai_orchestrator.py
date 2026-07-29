import time
import asyncio
from typing import Dict, Any, Optional
from datetime import datetime, timezone

from app.engines.face.face_engine import face_engine, FaceEngine
from app.engines.voice.voice_engine import voice_engine, VoiceEngine
from app.engines.behavioral.behavioral_engine import behavioral_engine, BehavioralEngine
from app.engines.challenge.challenge_engine import challenge_engine, ChallengeEngine
from app.engines.decision.decision_engine import decision_engine, DecisionEngine
from app.risk.risk_engine import risk_engine, RiskEngine
from app.passport.passport_service import passport_service, PassportService
from app.services.report_service import report_service, ReportService
from app.repositories.session_repository import session_repository, SessionRepository
from app.repositories.audit_repository import audit_repository, AuditRepository
from app.orchestrator.adaptive_router import AdaptiveRouter
from app.models.schemas.face import FaceAnalysisRequest, FaceAnalysisResult
from app.models.schemas.voice import VoiceAnalysisRequest, VoiceAnalysisResult
from app.models.schemas.behavioral import BehavioralAnalysisRequest, BehavioralAnalysisResult
from app.models.schemas.challenge import ChallengeRequest, ChallengeResponse
from app.models.schemas.trust import VerificationSessionStatus, TrustScoreResult


async def retry_with_backoff(coro_func, max_retries: int = 2, delay_ms: float = 100):
    """
    Retry wrapper with exponential backoff for transient engine calls.
    """
    for attempt in range(max_retries + 1):
        try:
            return await coro_func()
        except Exception as e:
            if attempt == max_retries:
                raise e
            await asyncio.sleep((delay_ms * (2 ** attempt)) / 1000.0)


class AIOrchestrator:
    """
    Central End-to-End AI Orchestrator powering TrustGate AI.
    Pipeline Flow:
      Verification Request -> Session Creation -> Face Analysis -> Voice Analysis ->
      Behavioral Analysis -> Challenge Engine -> Risk Engine -> Decision Engine ->
      Trust Passport Generation -> Audit Logging -> Report Generation.

    Built-in resilience:
    - Retries (exponential backoff)
    - Cancellation handling
    - Partial failure tolerance
    - Stage timeouts
    """
    def __init__(
        self,
        session_repo: Optional[SessionRepository] = None,
        audit_repo: Optional[AuditRepository] = None,
        face_eng: Optional[FaceEngine] = None,
        voice_eng: Optional[VoiceEngine] = None,
        beh_eng: Optional[BehavioralEngine] = None,
        chal_eng: Optional[ChallengeEngine] = None,
        dec_eng: Optional[DecisionEngine] = None,
        risk_eng: Optional[RiskEngine] = None,
        pass_service: Optional[PassportService] = None,
        rep_service: Optional[ReportService] = None
    ):
        self.session_repository = session_repo or session_repository
        self.audit_repository = audit_repo or audit_repository
        self.face_engine = face_eng or face_engine
        self.voice_engine = voice_eng or voice_engine
        self.behavioral_engine = beh_eng or behavioral_engine
        self.challenge_engine = chal_eng or challenge_engine
        self.decision_engine = dec_eng or decision_engine
        self.risk_engine = risk_eng or risk_engine
        self.passport_service = pass_service or passport_service
        self.report_service = rep_service or report_service
        self.adaptive_router = AdaptiveRouter()

    async def run_verification(self, request_data: Dict[str, Any], timeout_seconds: float = 10.0) -> Dict[str, Any]:
        session_id = request_data.get("session_id", f"sess_{int(time.time())}")
        user_context = request_data.get("user_id", "demo_user")

        try:
            return await asyncio.wait_for(
                self._execute_pipeline(session_id, user_context, request_data),
                timeout=timeout_seconds
            )
        except asyncio.TimeoutError:
            self.session_repository.update_status(session_id, VerificationSessionStatus.FAILED)
            self.audit_repository.record_event(
                session_id=session_id,
                component="ORCHESTRATOR",
                action="PIPELINE_TIMEOUT",
                duration_ms=timeout_seconds * 1000,
                status="TIMEOUT",
                metadata={"timeout_seconds": timeout_seconds},
                severity="ERROR"
            )
            raise TimeoutError(f"Verification pipeline timed out after {timeout_seconds}s")
        except asyncio.CancelledError:
            self.session_repository.cancel(session_id)
            self.audit_repository.record_event(
                session_id=session_id,
                component="ORCHESTRATOR",
                action="PIPELINE_CANCELLED",
                duration_ms=0.0,
                status="CANCELLED",
                metadata={},
                severity="WARNING"
            )
            raise

    async def _execute_pipeline(self, session_id: str, user_context: str, request_data: Dict[str, Any]) -> Dict[str, Any]:
        pipeline_start = time.time()

        # 1. Verification Request & Session Creation
        session = self.session_repository.create(session_id, user_context)
        self.audit_repository.record_event(
            session_id=session_id,
            component="SESSION_ENGINE",
            action="SESSION_CREATE",
            duration_ms=0.5,
            status="SUCCESS",
            metadata={"user_id": user_context, "status": "INITIALIZED"}
        )

        # 2. Face Analysis
        t0 = time.time()
        self.session_repository.update_status(session_id, VerificationSessionStatus.FACE_ANALYZING)
        face_req = FaceAnalysisRequest(
            image_base64=request_data.get("image_base64", "demo_image"),
            session_id=session_id,
            timestamp=time.time()
        )
        try:
            face_result: FaceAnalysisResult = await retry_with_backoff(lambda: self.face_engine.analyze(face_req))
            self.session_repository.update_result(session_id, "face", face_result.model_dump())
            self.audit_repository.record_event(
                session_id=session_id,
                component="FACE_ENGINE",
                action="FACE_ANALYZE",
                duration_ms=round((time.time() - t0) * 1000, 2),
                status="SUCCESS",
                metadata={"confidence": face_result.confidence, "spoof_score": face_result.spoof_score}
            )
        except Exception as e:
            # Partial failure fallback for face engine
            self.audit_repository.record_event(
                session_id=session_id,
                component="FACE_ENGINE",
                action="FACE_ANALYZE",
                duration_ms=round((time.time() - t0) * 1000, 2),
                status="PARTIAL_FAILURE",
                metadata={"error": str(e)},
                severity="WARNING"
            )
            face_result = FaceAnalysisResult(
                confidence=0.4,
                overall_confidence=0.4,
                spoof_score=0.9,
                explanation=f"Face analysis partial failure: {str(e)}"
            )

        # Check for early cancellation request
        if session.is_cancelled:
            raise asyncio.CancelledError("Session cancelled by client request")

        # 3. Voice Analysis (if provided or required)
        voice_result: Optional[VoiceAnalysisResult] = None
        if "audio_base64" in request_data or self.adaptive_router.should_require_voice(
            getattr(face_result, "risk_level", "LOW"), face_result.confidence
        ):
            t0 = time.time()
            self.session_repository.update_status(session_id, VerificationSessionStatus.VOICE_ANALYZING)
            voice_req = VoiceAnalysisRequest(
                audio_base64=request_data.get("audio_base64", "demo_audio"),
                session_id=session_id
            )
            try:
                voice_result = await retry_with_backoff(lambda: self.voice_engine.analyze(voice_req))
                self.session_repository.update_result(session_id, "voice", voice_result.model_dump())
                self.audit_repository.record_event(
                    session_id=session_id,
                    component="VOICE_ENGINE",
                    action="VOICE_ANALYZE",
                    duration_ms=round((time.time() - t0) * 1000, 2),
                    status="SUCCESS",
                    metadata={"speaker_confidence": voice_result.speaker_confidence, "spoof_probability": voice_result.spoof_probability}
                )
            except Exception as e:
                self.audit_repository.record_event(
                    session_id=session_id,
                    component="VOICE_ENGINE",
                    action="VOICE_ANALYZE",
                    duration_ms=round((time.time() - t0) * 1000, 2),
                    status="PARTIAL_FAILURE",
                    metadata={"error": str(e)},
                    severity="WARNING"
                )

        # 4. Behavioral Analysis
        behavioral_result: Optional[BehavioralAnalysisResult] = None
        if "behavioral" in request_data or self.adaptive_router.should_require_behavioral("MEDIUM"):
            t0 = time.time()
            self.session_repository.update_status(session_id, VerificationSessionStatus.BEHAVIORAL_ANALYZING)
            beh_data = request_data.get("behavioral", {})
            behavioral_req = BehavioralAnalysisRequest(
                session_id=session_id,
                mouse_events=beh_data.get("mouse_events", []),
                keyboard_events=beh_data.get("keyboard_events", []),
                tab_switches=beh_data.get("tab_switches", 0)
            )
            try:
                behavioral_result = await retry_with_backoff(lambda: self.behavioral_engine.analyze(behavioral_req))
                self.session_repository.update_result(session_id, "behavioral", behavioral_result.model_dump())
                self.audit_repository.record_event(
                    session_id=session_id,
                    component="BEHAVIORAL_ENGINE",
                    action="BEHAVIORAL_ANALYZE",
                    duration_ms=round((time.time() - t0) * 1000, 2),
                    status="SUCCESS",
                    metadata={"mouse_movement_score": behavioral_result.mouse_movement_score, "anomaly_score": behavioral_result.anomaly_score}
                )
            except Exception as e:
                self.audit_repository.record_event(
                    session_id=session_id,
                    component="BEHAVIORAL_ENGINE",
                    action="BEHAVIORAL_ANALYZE",
                    duration_ms=round((time.time() - t0) * 1000, 2),
                    status="PARTIAL_FAILURE",
                    metadata={"error": str(e)},
                    severity="WARNING"
                )

        # 5. Challenge Engine
        t0 = time.time()
        self.session_repository.update_status(session_id, VerificationSessionStatus.CHALLENGE_RUNNING)
        challenge_resp: ChallengeResponse = await self.challenge_engine.generate_challenge(
            ChallengeRequest(session_id=session_id)
        )
        self.session_repository.update_result(session_id, "challenge", challenge_resp.model_dump())
        self.audit_repository.record_event(
            session_id=session_id,
            component="CHALLENGE_ENGINE",
            action="CHALLENGE_GENERATE",
            duration_ms=round((time.time() - t0) * 1000, 2),
            status="SUCCESS",
            metadata={"challenge_id": challenge_resp.challenge_id, "action": challenge_resp.expected_action}
        )

        # 6. Risk Engine
        t0 = time.time()
        self.session_repository.update_status(session_id, VerificationSessionStatus.RISK_COMPUTING)
        trust_result: TrustScoreResult = self.risk_engine.compute(
            session_id=session_id,
            face_result=face_result,
            voice_result=voice_result,
            behavioral_result=behavioral_result,
            challenge_result=challenge_resp.model_dump()
        )
        self.audit_repository.record_event(
            session_id=session_id,
            component="RISK_ENGINE",
            action="RISK_COMPUTE",
            duration_ms=round((time.time() - t0) * 1000, 2),
            status="SUCCESS",
            metadata={"overall_score": trust_result.overall_score, "risk_level": str(trust_result.risk_level)}
        )

        # 7. Decision Engine
        t0 = time.time()
        decision_res = self.decision_engine.evaluate(
            trust_score=trust_result.overall_score,
            risk_level=str(trust_result.risk_level),
            face_liveness_passed=face_result.liveness.is_live if hasattr(face_result, "liveness") else True,
            voice_verified=voice_result.speaker_verification.is_match if (voice_result and hasattr(voice_result, "speaker_verification") and voice_result.speaker_verification) else True,
            behavioral_anomaly_score=behavioral_result.anomaly_score if behavioral_result else 0.05,
            spoof_detected=(face_result.spoof_score > 0.5 if hasattr(face_result, "spoof_score") else False)
        )
        self.audit_repository.record_event(
            session_id=session_id,
            component="DECISION_ENGINE",
            action="DECISION_EVALUATE",
            duration_ms=round((time.time() - t0) * 1000, 2),
            status="SUCCESS",
            metadata={"decision": decision_res.decision.value, "explanation": decision_res.explanation}
        )

        # 8. Trust Passport Generation
        t0 = time.time()
        passport = self.passport_service.generate_passport(session_id, trust_result)
        passport["decision"] = decision_res.decision.value
        self.session_repository.update_status(session_id, VerificationSessionStatus.COMPLETED)
        self.audit_repository.record_event(
            session_id=session_id,
            component="PASSPORT_SERVICE",
            action="PASSPORT_ISSUE",
            duration_ms=round((time.time() - t0) * 1000, 2),
            status="SUCCESS",
            metadata={"passport_id": passport["passport_id"], "signature": passport["cryptographic_signature"]}
        )

        # 9. Audit Logging Completed
        total_duration_ms = round((time.time() - pipeline_start) * 1000, 2)
        self.audit_repository.record_event(
            session_id=session_id,
            component="ORCHESTRATOR",
            action="PIPELINE_COMPLETE",
            duration_ms=total_duration_ms,
            status="SUCCESS",
            metadata={"total_duration_ms": total_duration_ms, "decision": decision_res.decision.value}
        )

        # 10. Report Generation Directly From Orchestration Result
        orchestration_output = {
            "status": "success",
            "session_id": session_id,
            "trust_result": trust_result.model_dump(),
            "decision": decision_res.model_dump(),
            "passport": passport,
            "pipeline_duration_ms": total_duration_ms
        }

        report_model = self.report_service.generate_report_from_orchestration(session_id, orchestration_output)
        orchestration_output["report"] = report_model.model_dump()

        return orchestration_output


ai_orchestrator = AIOrchestrator()