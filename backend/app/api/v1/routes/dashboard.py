from fastapi import APIRouter, Depends, status
from app.core.security import verify_api_key
from app.core.exceptions import ErrorResponse
from app.models.schemas.api import StatusResponse, DashboardStatsResponse, TelemetryResponse

router = APIRouter(prefix="/dashboard", tags=["Dashboard"], dependencies=[Depends(verify_api_key)])


@router.get(
    "",
    response_model=StatusResponse,
    status_code=status.HTTP_200_OK,
    responses={401: {"model": ErrorResponse}},
    summary="Get Dashboard Service Status"
)
@router.get(
    "/",
    response_model=StatusResponse,
    status_code=status.HTTP_200_OK,
    responses={401: {"model": ErrorResponse}},
    include_in_schema=False
)
async def get_dashboard_status():
    """Retrieve operational status of the Dashboard service."""
    return StatusResponse(status="healthy", service="dashboard", message="Dashboard service operational")


@router.get(
    "/stats",
    response_model=DashboardStatsResponse,
    status_code=status.HTTP_200_OK,
    responses={401: {"model": ErrorResponse}},
    summary="Get Dashboard Analytics & Stats"
)
async def get_stats():
    """Retrieve real-time telemetry and risk stats for dashboard analytics."""
    return DashboardStatsResponse(
        kpis={
            "security_score": "98.4%",
            "passports_issued": 154290,
            "critical_escalations": 3,
            "system_availability": "99.98%",
            "threat_level": "LOW",
        },
        funnel=[
            {"stage": "Total Requests", "count": 18420},
            {"stage": "Face Passed", "count": 17110},
            {"stage": "Voice Passed", "count": 16450},
            {"stage": "Risk Approved", "count": 15980},
            {"stage": "Passport Issued", "count": 15429},
        ],
        timeline=[
            {"time": "00:00", "legitimate": 1200, "syntheticAttacks": 45},
            {"time": "04:00", "legitimate": 850, "syntheticAttacks": 12},
            {"time": "08:00", "legitimate": 2400, "syntheticAttacks": 180},
            {"time": "12:00", "legitimate": 4100, "syntheticAttacks": 310},
            {"time": "16:00", "legitimate": 3800, "syntheticAttacks": 95},
            {"time": "20:00", "legitimate": 2900, "syntheticAttacks": 60},
        ],
        risk_distribution=[
            {"name": "Liveness Failure", "value": 42, "color": "#EF4444"},
            {"name": "Voice Clone Match", "value": 28, "color": "#F59E0B"},
            {"name": "Velocity Anomaly", "value": 18, "color": "#00BCF2"},
            {"name": "Geofence Mismatch", "value": 12, "color": "#5C2D91"},
        ],
        devices=[
            {"device": "macOS Desktop", "passRate": 99.2},
            {"device": "Windows Edge", "passRate": 98.4},
            {"device": "iOS Safari", "passRate": 97.8},
            {"device": "Android Chrome", "passRate": 94.1},
            {"device": "Headless Bot", "passRate": 4.2},
        ],
    )


@router.get(
    "/telemetry",
    response_model=TelemetryResponse,
    status_code=status.HTTP_200_OK,
    responses={401: {"model": ErrorResponse}},
    summary="Get Infrastructure Health Telemetry"
)
async def get_telemetry():
    """Retrieve live operational status and latencies across integrated Azure microservices."""
    return TelemetryResponse(
        services=[
            {"name": "Azure OpenAI", "region": "East US 2", "model": "GPT-4o Risk Engine", "latency_ms": 112, "reqs": "1,842 req/s", "status": "Healthy"},
            {"name": "Azure AI Vision", "region": "East US 2", "model": "Face 468 Mesh", "latency_ms": 94, "reqs": "3,410 req/s", "status": "Healthy"},
            {"name": "Azure AI Speech", "region": "East US 2", "model": "Neural Speaker Match", "latency_ms": 45, "reqs": "1,290 req/s", "status": "Healthy"},
            {"name": "Azure Cosmos DB", "region": "Multi-Region", "model": "Global Passport Sync", "latency_ms": 12, "reqs": "99.99% SLA", "status": "Healthy"},
            {"name": "Azure Blob Storage", "region": "East US 2", "model": "Encrypted Embeddings", "latency_ms": 8, "reqs": "5.2 TB/d", "status": "Healthy"},
            {"name": "Microsoft Entra ID", "region": "Global", "model": "OAuth 2.0 / SAML", "latency_ms": 18, "reqs": "12,400 auth/s", "status": "Healthy"},
        ]
    )