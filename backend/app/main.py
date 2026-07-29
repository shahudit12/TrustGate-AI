"""
TrustGate AI API Main Application Entry Point.
Production-ready FastAPI application setup with CORS, routing, lifecycle events, and global exception handlers.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.logging import setup_logging, logger
from app.core.exceptions import (
    TrustGateException,
    trustgate_exception_handler,
    generic_exception_handler,
)
from app.api.v1.router import api_router
from app.services.azure_openai_service import azure_openai_service

# Setup centralized logging
setup_logging()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager handling startup and shutdown events.
    """
    logger.info(f"Starting {settings.PROJECT_NAME} v{settings.VERSION}...")
    logger.info(
        "Azure OpenAI Status | Enabled=%s | Deployment=%s",
        azure_openai_service.enabled,
        azure_openai_service.deployment,
    )
    yield
    logger.info(f"Shutting down {settings.PROJECT_NAME}...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Exception Handlers
app.add_exception_handler(TrustGateException, trustgate_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API v1 router with /api/v1 prefix
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get(
    "/health",
    tags=["Health"],
    summary="Application Health Check"
)
async def health():
    """
    Health check endpoint returning application status.
    """
    return {
        "status": "healthy",
        "service": "TrustGate AI"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
