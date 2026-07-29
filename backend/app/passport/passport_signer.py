import json
import base64
import hmac
import hashlib
from typing import Dict, Any
from app.core.config import settings


class PassportSigner:
    def __init__(self, secret_key: str = settings.SECRET_KEY):
        self.secret_key = secret_key.encode("utf-8")

    def sign(self, payload: Dict[str, Any]) -> str:
        serialized = json.dumps(payload, sort_keys=True).encode("utf-8")
        signature = hmac.new(self.secret_key, serialized, hashlib.sha256).hexdigest()
        encoded_payload = base64.b64encode(serialized).decode("utf-8")
        return f"{encoded_payload}.{signature}"
