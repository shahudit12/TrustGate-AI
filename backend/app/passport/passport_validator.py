import json
import base64
import hmac
import hashlib
from typing import Dict, Any, Tuple
from app.core.config import settings


class PassportValidator:
    def __init__(self, secret_key: str = settings.SECRET_KEY):
        self.secret_key = secret_key.encode("utf-8")

    def verify(self, signed_token: str) -> Tuple[bool, Dict[str, Any]]:
        try:
            if not signed_token or not isinstance(signed_token, str):
                return False, {}
            
            clean_token = signed_token.strip()
            if clean_token.startswith("Bearer "):
                clean_token = clean_token[7:].strip()

            parts = clean_token.split(".")
            if len(parts) != 2 or not parts[0] or not parts[1]:
                return False, {}

            encoded_payload, signature = parts[0], parts[1]
            serialized = base64.b64decode(encoded_payload.encode("utf-8"))
            expected_signature = hmac.new(self.secret_key, serialized, hashlib.sha256).hexdigest()

            if hmac.compare_digest(signature, expected_signature):
                payload = json.loads(serialized.decode("utf-8"))
                if isinstance(payload, dict):
                    return True, payload
            return False, {}
        except Exception:
            return False, {}
