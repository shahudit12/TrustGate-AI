from fastapi import Request, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any


class ErrorResponse(BaseModel):
    error_code: str = Field(..., description="Unique error code identifier")
    message: str = Field(..., description="Human readable error description")
    details: Optional[Dict[str, Any]] = Field(default=None, description="Additional context or validation errors")


class TrustGateException(Exception):
    def __init__(
        self,
        message: str,
        error_code: str = "INTERNAL_ERROR",
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        details: Optional[Dict[str, Any]] = None
    ):
        self.message = message
        self.error_code = error_code
        self.status_code = status_code
        self.details = details
        super().__init__(self.message)


class SessionNotFoundException(TrustGateException):
    def __init__(self, session_id: str):
        super().__init__(
            message=f"Verification session '{session_id}' not found",
            error_code="SESSION_NOT_FOUND",
            status_code=status.HTTP_404_NOT_FOUND
        )


class UnauthorizedException(TrustGateException):
    def __init__(self, detail: str = "Invalid or missing credentials"):
        super().__init__(
            message=detail,
            error_code="UNAUTHORIZED",
            status_code=status.HTTP_401_UNAUTHORIZED
        )


class VerificationFailedException(TrustGateException):
    def __init__(self, reason: str):
        super().__init__(
            message=f"Verification failed: {reason}",
            error_code="VERIFICATION_FAILED",
            status_code=status.HTTP_400_BAD_REQUEST
        )


async def trustgate_exception_handler(request: Request, exc: TrustGateException) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(
            error_code=exc.error_code,
            message=exc.message,
            details=exc.details
        ).model_dump()
    )


async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=ErrorResponse(
            error_code="INTERNAL_SERVER_ERROR",
            message="An unexpected error occurred. Please try again later.",
            details={"type": type(exc).__name__}
        ).model_dump()
    )
