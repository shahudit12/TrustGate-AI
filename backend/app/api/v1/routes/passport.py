from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import Optional, Dict, Any, List
from app.models.schemas.api import PassportListResponse, PassportResponseModel
from app.passport.passport_service import passport_service, PassportService
from app.repositories.passport_repository import passport_repository, PassportRepository

router = APIRouter()


def get_passport_service() -> PassportService:
    return passport_service


def get_passport_repo() -> PassportRepository:
    return passport_repository


@router.get("/list", response_model=PassportListResponse, summary="List Digital Identity Passports")
async def list_passports(
    query: Optional[str] = Query(None, description="Search query"),
    risk: Optional[str] = Query(None, description="Risk filter (ALL, LOW, MEDIUM, HIGH)"),
    repo: PassportRepository = Depends(get_passport_repo)
) -> PassportListResponse:
    """
    Returns list of digital identity passports filtered by search query or risk level.
    """
    all_passports = [
        {
            "id": "TP-AZURE-99842",
            "name": "Dr. Sarah Jenkins",
            "role": "Executive CISO",
            "score": 98.4,
            "risk": "LOW",
            "date": "2m ago",
            "device": "macOS / Safari",
            "location": "New York, USA",
            "timeline": [
                {"time": "10:14:22", "text": "Session ID created & TLS handshaked"},
                {"time": "10:14:26", "text": "Face 468 mesh landmarks verified (Passive liveness OK)"},
                {"time": "10:14:31", "text": "Voice spectrogram matched (96.8% similarity)"},
                {"time": "10:14:36", "text": "Behavioral dynamics velocity checked"},
                {"time": "10:14:38", "text": "Azure OpenAI XAI Risk Model executed"},
                {"time": "10:14:39", "text": "Trust Passport signed & issued"}
            ]
        },
        {
            "id": "TP-AZURE-99839",
            "name": "Marcus Vance",
            "role": "Treasury Officer",
            "score": 97.2,
            "risk": "LOW",
            "date": "8m ago",
            "device": "Windows / Edge",
            "location": "London, UK",
            "timeline": [
                {"time": "10:06:12", "text": "Session initialized"},
                {"time": "10:06:18", "text": "Face liveness passed"},
                {"time": "10:06:22", "text": "Trust Passport issued"}
            ]
        },
        {
            "id": "TP-AZURE-99831",
            "name": "Elena Rostova",
            "role": "Lead Architect",
            "score": 74.0,
            "risk": "MEDIUM",
            "date": "18m ago",
            "device": "iOS / Chrome Mobile",
            "location": "Berlin, DE",
            "timeline": [
                {"time": "09:56:01", "text": "Session initialized"},
                {"time": "09:56:10", "text": "Voice similarity low (74%)"},
                {"time": "09:56:15", "text": "Escalated for manual review"}
            ]
        },
        {
            "id": "TP-AZURE-99824",
            "name": "Unknown Vector",
            "role": "Automated Bot",
            "score": 24.1,
            "risk": "HIGH",
            "date": "32m ago",
            "device": "Headless Linux Python",
            "location": "Tokyo, JP",
            "timeline": [
                {"time": "09:42:00", "text": "Session initialized"},
                {"time": "09:42:04", "text": "Linear mouse path detected"},
                {"time": "09:42:05", "text": "Session REJECTED"}
            ]
        }
    ]

    stored_passports = repo.list_all(risk_filter=risk)
    if stored_passports:
        # Merge custom generated passports into list
        for sp in stored_passports:
            all_passports.insert(0, {
                "id": sp.get("passport_id", "TP-AZURE-NEW"),
                "name": "Verified Identity Subject",
                "role": "Authorized User",
                "score": sp.get("trust_score", 98.4),
                "risk": sp.get("risk", "LOW"),
                "date": "Just now",
                "device": "Web Browser Session",
                "location": "Verified Azure Region",
                "timeline": [
                    {"time": "Just now", "text": "Pipeline completed & Passport signed"}
                ]
            })

    filtered = all_passports
    if query:
        q = query.lower()
        filtered = [p for p in filtered if q in p["name"].lower() or q in p["id"].lower() or q in p["role"].lower()]

    if risk and risk.upper() != "ALL":
        r = risk.upper()
        filtered = [p for p in filtered if p["risk"] == r]

    return PassportListResponse(passports=filtered, total=len(filtered))


@router.get("/{passport_id}", response_model=PassportResponseModel, summary="Get Passport Detail")
async def get_passport(
    passport_id: str,
    repo: PassportRepository = Depends(get_passport_repo)
) -> PassportResponseModel:
    stored = repo.get(passport_id)
    if stored:
        return PassportResponseModel(passport_id=passport_id, passport=stored)

    return PassportResponseModel(
        passport_id=passport_id,
        passport={
            "passport_id": passport_id,
            "session_id": "demo-session-99",
            "trust_score": 98.4,
            "risk_level": "LOW",
            "valid_from": "2026-07-29T00:00:00Z",
            "expires_at": "2026-07-30T00:00:00Z",
            "signature": "0x9948a7b9e0f1d2c3b4a5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5"
        }
    )