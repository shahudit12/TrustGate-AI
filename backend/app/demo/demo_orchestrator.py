import asyncio
from app.models.schemas.trust import TrustScoreResult, RiskLevel

class DemoOrchestrator:
    async def run_verification(self, request) -> dict:
        await asyncio.sleep(0.5)
        return {"status": "success", "demo": True}\n