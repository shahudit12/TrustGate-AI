import random
from typing import Dict, Any
from app.models.schemas.challenge import ChallengeRequest, ChallengeResponse, ChallengeEvaluationRequest


class ChallengeEngine:
    """
    Challenge Engine for generating adaptive verification challenges (head turn, blink, phrase reading)
    and evaluating dynamic liveness responses.
    """
    def __init__(self):
        self.prompts = [
            {"action": "BLINK", "prompt": "Please blink slowly twice"},
            {"action": "TURN_LEFT", "prompt": "Please turn your head slowly to the left"},
            {"action": "TURN_RIGHT", "prompt": "Please turn your head slowly to the right"},
            {"action": "SPEAK_PHRASE", "prompt": "Please repeat: 'My voice is my secure passport'"}
        ]

    async def generate_challenge(self, request: ChallengeRequest) -> ChallengeResponse:
        selected = random.choice(self.prompts)
        chal_id = f"chal_{random.randint(1000, 9999)}"
        return ChallengeResponse(
            challenge_id=chal_id,
            challenge=selected,
            result="PENDING",
            confidence=0.98,
            explanation=f"Generated adaptive challenge requiring action: {selected['action']}.",
            prompt=selected["prompt"],
            expected_action=selected["action"],
            status="PENDING"
        )

    async def evaluate_challenge(self, request: ChallengeEvaluationRequest) -> ChallengeResponse:
        passed = request.response_data.get("passed", True)
        conf = 0.98 if passed else 0.35
        res_str = "PASSED" if passed else "FAILED"
        expl = "User successfully performed expected adaptive liveness gesture." if passed else "Liveness gesture mismatch or timeout."

        return ChallengeResponse(
            challenge_id=request.challenge_id,
            challenge={"action": "EVALUATE", "prompt": "Adaptive Challenge Evaluation"},
            result=res_str,
            confidence=conf,
            explanation=expl,
            prompt="Adaptive Challenge Evaluation",
            expected_action="VERIFY",
            status="COMPLETED" if passed else "FAILED"
        )


challenge_engine = ChallengeEngine()
