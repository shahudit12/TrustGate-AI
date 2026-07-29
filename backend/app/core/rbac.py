from enum import Enum
from fastapi import Depends, HTTPException, status
from app.core.security import get_current_user, TokenData, UserRole

class Permission(str, Enum):
    READ_VERIFICATIONS = "READ_VERIFICATIONS"
    WRITE_VERIFICATIONS = "WRITE_VERIFICATIONS"
    READ_DASHBOARD = "READ_DASHBOARD"
    MANAGE_USERS = "MANAGE_USERS"

ROLE_PERMISSIONS = {
    UserRole.ADMIN: [Permission.READ_VERIFICATIONS, Permission.WRITE_VERIFICATIONS, Permission.READ_DASHBOARD, Permission.MANAGE_USERS],
    UserRole.ANALYST: [Permission.READ_VERIFICATIONS, Permission.READ_DASHBOARD],
    UserRole.AUDITOR: [Permission.READ_VERIFICATIONS],
    UserRole.USER: [],
    UserRole.API_CLIENT: [Permission.WRITE_VERIFICATIONS]
}

def require_permission(permission: Permission):
    async def permission_dependency(current_user: TokenData = Depends(get_current_user)):
        user_role = current_user.role
        if not user_role or permission not in ROLE_PERMISSIONS.get(user_role, []):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")
        return current_user
    return permission_dependency

def require_role(role: UserRole):
    async def role_dependency(current_user: TokenData = Depends(get_current_user)):
        if current_user.role != role:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Role mismatch")
        return current_user
    return role_dependency\n