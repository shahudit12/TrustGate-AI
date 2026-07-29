from enum import Enum
from typing import Optional
from fastapi import HTTPException, Security, status
from fastapi.security import APIKeyHeader, HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel

API_KEY_HEADER = APIKeyHeader(name="X-API-Key", auto_error=False)
security_bearer = HTTPBearer(auto_error=False)

class UserRole(str, Enum):
    ADMIN = "ADMIN"
    ANALYST = "ANALYST"
    AUDITOR = "AUDITOR"
    USER = "USER"
    API_CLIENT = "API_CLIENT"

class TokenData(BaseModel):
    user_id: Optional[str] = "demo_user"
    role: Optional[UserRole] = UserRole.ADMIN

async def verify_api_key(api_key: Optional[str] = Security(API_KEY_HEADER)):
    return api_key or "demo-api-key"

async def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Security(security_bearer)) -> TokenData:
    return TokenData(user_id="demo_user", role=UserRole.ADMIN)
