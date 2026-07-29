import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List


class Settings(BaseSettings):
    PROJECT_NAME: str = "TrustGate AI API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    DEMO_MODE: bool = True

    # Security & Auth
    SECRET_KEY: str = "super-secret-trustgate-key-change-in-production"
    API_KEY: str = "demo-api-key"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    # CORS Origins
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "localhost:5173",
    ]

    # Azure AI Vision
    AZURE_VISION_ENDPOINT: str = ""
    AZURE_VISION_KEY: str = ""

    # Azure AI Speech
    AZURE_SPEECH_ENDPOINT: str = ""
    AZURE_SPEECH_KEY: str = ""
    AZURE_SPEECH_REGION: str = "eastus2"

    # Azure OpenAI
    AZURE_OPENAI_ENDPOINT: str = "https://demo.openai.azure.com/"
    AZURE_OPENAI_KEY: str = ""
    AZURE_OPENAI_DEPLOYMENT: str = "gpt-4o"
    AZURE_OPENAI_API_VERSION: str = "2024-02-01"

    # Azure Cosmos DB
    AZURE_COSMOS_CONNECTION_STRING: str = ""
    AZURE_COSMOS_DATABASE_NAME: str = "TrustGateDB"

    # Azure Blob Storage
    AZURE_STORAGE_CONNECTION_STRING: str = ""
    AZURE_STORAGE_CONTAINER_NAME: str = "trustgate-artifacts"

    # Microsoft Entra ID (Azure AD)
    AZURE_ENTRA_TENANT_ID: str = "demo-tenant-id"
    AZURE_ENTRA_CLIENT_ID: str = "demo-client-id"
    AZURE_ENTRA_CLIENT_SECRET: str = ""
    AZURE_ENTRA_ISSUER: str = "https://login.microsoftonline.com/demo-tenant-id/v2.0"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=True
    )


settings = Settings()

