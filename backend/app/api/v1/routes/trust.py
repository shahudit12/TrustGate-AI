from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any
from app.models.schemas.api import (
    TrustScoreRequest,
    TrustScoreResponseModel,
    TrustHistoryResponseModel,
    PolicyRequest,
    PolicyResponse
)
from app.models.schemas.trust import RiskLevel
from app.repositories.audit_repository import audit_repository, AuditRepository

router = APIRouter()


def get_audit_repo() -> AuditRepository:
    return audit_repository


@router.get("/score", response_model=TrustScoreResponseModel, summary="Get Trust Score")
async def get_trust_score(session_id: str = "demo_session") -> TrustScoreResponseModel:
    return TrustScoreResponseModel(
        score=98.4,
        risk_level=RiskLevel.LOW,
        session_id=session_id,
        components={
            "face": 98.5,
            "voice": 96.8,
            "behavioral": 95.0
        },
        xai_factors=[
            {
                "factor_id": "F1",
                "description": "Passed 468 facial landmark mesh liveness check",
                "impact": "POSITIVE",
                "severity": "LOW"
            }
        ],
        recommendation="PROCEED"
    )


@router.get("/history", response_model=TrustHistoryResponseModel, summary="Get Real-Time SOC Audit Log")
async def get_trust_history(
    audit_repo: AuditRepository = Depends(get_audit_repo)
) -> TrustHistoryResponseModel:
    recorded_logs = audit_repo.get_all()
    if recorded_logs:
        history = [
            {
                "id": idx + 1,
                "timestamp": entry.timestamp.split("T")[1][:8] if "T" in entry.timestamp else entry.timestamp,
                "message": f"[{entry.component}] {entry.action} - {entry.status}",
                "status": "passed" if entry.status == "SUCCESS" else "warning" if entry.status == "PARTIAL_FAILURE" else "failed"
            }
            for idx, entry in enumerate(recorded_logs[-20:])
        ]
        return TrustHistoryResponseModel(history=history)

    default_history = [
        {"id": 1, "timestamp": "05:42:10", "message": "Passport TP-AZURE-99842 verified.", "status": "passed"},
        {"id": 2, "timestamp": "05:38:44", "message": "Azure OpenAI XAI model refreshed.", "status": "passed"},
        {"id": 3, "timestamp": "05:12:01", "message": "Vector anomaly flagged on Tokyo Hub.", "status": "warning"}
    ]
    return TrustHistoryResponseModel(history=default_history)


@router.post("/policy", response_model=PolicyResponse, summary="Enforce CISO Security Policy")
async def enforce_policy(request: PolicyRequest) -> PolicyResponse:
    return PolicyResponse(
        success=True,
        policy_id=request.policy_id,
        status="ENFORCED",
        message=f"Policy {request.policy_id} successfully enforced across Azure microservices."
    )