from enum import Enum
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class DecisionOutcome(str, Enum):
    APPROVED = "APPROVED"
    REVIEW_REQUIRED = "REVIEW_REQUIRED"
    REJECTED = "REJECTED"


class RuleEvaluation(BaseModel):
    rule_name: str
    passed: bool
    description: str
    impact: str


class DecisionResult(BaseModel):
    decision: DecisionOutcome
    explanation: str
    confidence_score: float
    rule_evaluations: List[RuleEvaluation] = Field(default_factory=list)
    requires_escalation: bool = False


class DecisionEngine:
    """
    Decision Engine evaluating composite risk score, liveness signals, and security policy rules
    to render final governance decisions: APPROVED, REVIEW_REQUIRED, or REJECTED.
    """
    def evaluate(
        self,
        trust_score: float,
        risk_level: str,
        face_liveness_passed: bool = True,
        voice_verified: bool = True,
        behavioral_anomaly_score: float = 0.0,
        spoof_detected: bool = False
    ) -> DecisionResult:
        rule_evals = []

        # Rule 1: Zero Spoof Tolerance
        rule1_passed = not spoof_detected
        rule_evals.append(
            RuleEvaluation(
                rule_name="Zero Spoof Tolerance",
                passed=rule1_passed,
                description="Rejects session if synthetic spoof, video replay, or clone detected.",
                impact="CRITICAL"
            )
        )

        # Rule 2: Minimum Face Liveness Baseline
        rule2_passed = face_liveness_passed
        rule_evals.append(
            RuleEvaluation(
                rule_name="Face 468 Mesh Liveness Baseline",
                passed=rule2_passed,
                description="Requires valid 468-point 3D facial landmark mesh.",
                impact="HIGH"
            )
        )

        # Rule 3: Behavioral Anomaly Threshold
        rule3_passed = behavioral_anomaly_score < 0.4
        rule_evals.append(
            RuleEvaluation(
                rule_name="Behavioral Anomaly Threshold",
                passed=rule3_passed,
                description="Checks mouse velocity and keyboard rhythm consistency for automation bots.",
                impact="MEDIUM"
            )
        )

        # Rule 4: Trust Score Approval Cutoff
        rule4_passed = trust_score >= 80.0
        rule_evals.append(
            RuleEvaluation(
                rule_name="Trust Score Cutoff",
                passed=rule4_passed,
                description="Overall trust score must meet minimum 80.0% threshold for automated approval.",
                impact="HIGH"
            )
        )

        # Decision Evaluation
        if spoof_detected or trust_score < 40.0:
            return DecisionResult(
                decision=DecisionOutcome.REJECTED,
                explanation="Session REJECTED due to critical biometric spoof indicators or trust score below safety floor.",
                confidence_score=trust_score,
                rule_evaluations=rule_evals,
                requires_escalation=True
            )
        elif not face_liveness_passed or trust_score < 80.0 or risk_level in ["HIGH", "CRITICAL"] or behavioral_anomaly_score >= 0.4:
            return DecisionResult(
                decision=DecisionOutcome.REVIEW_REQUIRED,
                explanation="Session flagged for REVIEW_REQUIRED. Biometric or behavioral anomalies require CISO analyst sign-off.",
                confidence_score=trust_score,
                rule_evaluations=rule_evals,
                requires_escalation=True
            )
        else:
            return DecisionResult(
                decision=DecisionOutcome.APPROVED,
                explanation="Session APPROVED with high confidence. Multi-modal biometric baseline and passive liveness verified.",
                confidence_score=trust_score,
                rule_evaluations=rule_evals,
                requires_escalation=False
            )


decision_engine = DecisionEngine()
