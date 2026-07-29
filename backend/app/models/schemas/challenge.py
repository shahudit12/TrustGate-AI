from pydantic import BaseModel, Field
from typing import Optional, Dict, Any


class ChallengeRequest(BaseModel):
    session_id: str = Field(default="sess_demo")
    challenge_type: str = Field(default="LIVENESS_PROMPT")


class ChallengeEvaluationRequest(BaseModel):
    session_id: str = Field(default="sess_demo")
    challenge_id: str = Field(default="chal_1001")
    response_data: Dict[str, Any] = Field(default_factory=dict)


class ChallengeResponse(BaseModel):
    challenge_id: str = Field(default="chal_1001")
    challenge: Dict[str, Any] = Field(default_factory=lambda: {"action": "BLINK", "prompt": "Please blink slowly twice"})
    result: str = Field(default="PASSED")
    confidence: float = Field(default=0.98)
    explanation: str = Field(default="User completed adaptive blink challenge within expected time window.")
    prompt: str = Field(default="Please blink slowly twice")
    expected_action: str = Field(default="BLINK")
    status: str = Field(default="COMPLETED")
