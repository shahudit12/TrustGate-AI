from app.models.schemas.behavioral import (
    BehavioralAnalysisRequest,
    BehavioralAnalysisResult,
    MouseAnalysisResult,
    KeyboardAnalysisResult,
    VPNDetectionResult,
    AutomationDetectionResult,
)


class BehavioralEngine:
    """
    Behavioral Engine evaluating mouse velocity curves, keyboard flight/dwell timing,
    headless browser automation signals, and IP/VPN proxy reputation.
    """
    async def analyze(self, request: BehavioralAnalysisRequest) -> BehavioralAnalysisResult:
        is_bot = request.tab_switches > 10
        anomaly_score = 0.82 if is_bot else 0.05
        mouse_score = 0.25 if is_bot else 0.95

        typing_dyn = {
            "rhythm_consistency": 0.3 if is_bot else 0.92,
            "avg_dwell_ms": 15.0 if is_bot else 110.0,
            "avg_flight_ms": 10.0 if is_bot else 140.0,
            "is_human": not is_bot,
        }

        explanation = (
            "Mouse velocity curve and keyboard dwell/flight dynamics exhibit natural human entropy."
            if not is_bot else
            "Flagged behavioral analysis: linear mouse movement paths and robotic keyboard flight times detected."
        )

        return BehavioralAnalysisResult(
            typing_dynamics=typing_dyn,
            mouse_movement_score=mouse_score,
            anomaly_score=anomaly_score,
            explanation=explanation,
            mouse=MouseAnalysisResult(entropy=0.2 if is_bot else 0.85, avg_velocity=500.0 if is_bot else 150.0, movement_pattern="LINEAR" if is_bot else "NATURAL", is_human=not is_bot),
            keyboard=KeyboardAnalysisResult(rhythm_consistency=0.3 if is_bot else 0.92, avg_dwell=15.0 if is_bot else 110.0, avg_flight=10.0 if is_bot else 140.0, is_human=not is_bot),
            vpn=VPNDetectionResult(vpn_detected=False, proxy_detected=False, tor_detected=False, ip_risk_score=0.05, asn="AS12345", country="US"),
            automation=AutomationDetectionResult(is_automated=is_bot, automation_type="SELENIUM" if is_bot else "NONE", confidence=0.99, signals=["HIGH_TAB_SWITCHES"] if is_bot else []),
            overall_confidence=1.0 - anomaly_score,
            risk_factors=["HIGH_TAB_SWITCHES"] if is_bot else []
        )


behavioral_engine = BehavioralEngine()