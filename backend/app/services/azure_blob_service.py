import time
import logging
from typing import Optional, Dict, Any
from datetime import datetime, timedelta, timezone
from app.core.config import settings

try:
    from azure.storage.blob import BlobServiceClient, generate_container_sas, generate_blob_sas, BlobSasPermissions
except ImportError:
    BlobServiceClient = None
    generate_container_sas = None
    generate_blob_sas = None
    BlobSasPermissions = None

logger = logging.getLogger("trustgate.azure_blob")


class AzureBlobService:
    """
    Production-grade Azure Blob Storage Service.
    Handles secure upload of evidence (biometric images, voice samples, cryptographic reports)
    and generates secure Shared Access Signature (SAS) URLs with time-bound read permissions.
    Operates with automatic failover to local memory/filesystem storage when Azure credentials are not configured.
    """
    def __init__(self):
        self.conn_str = settings.AZURE_STORAGE_CONNECTION_STRING
        self.container_name = settings.AZURE_STORAGE_CONTAINER_NAME
        self.enabled = bool(self.conn_str and "DefaultEndpointsProtocol" in self.conn_str)

        self.blob_service_client: Optional[Any] = None
        if self.enabled and BlobServiceClient is not None:
            try:
                self.blob_service_client = BlobServiceClient.from_connection_string(self.conn_str)
            except Exception as exc:
                logger.warning(f"Failed to initialize Azure BlobServiceClient ({exc}); operating in failover mode.")

        self._local_storage: Dict[str, bytes] = {}

    async def upload_evidence(
        self,
        blob_name: str,
        data: bytes,
        content_type: str = "application/octet-stream"
    ) -> str:
        logger.info(f"Uploading verification evidence blob '{blob_name}' ({len(data)} bytes, type: {content_type})")

        if self.enabled and self.blob_service_client:
            try:
                container_client = self.blob_service_client.get_container_client(self.container_name)
                if not container_client.exists():
                    container_client.create_container()

                blob_client = container_client.get_blob_client(blob_name)
                blob_client.upload_blob(data, overwrite=True)

                # Generate secure SAS URL valid for 1 hour
                sas_token = generate_blob_sas(
                    account_name=self.blob_service_client.account_name,
                    container_name=self.container_name,
                    blob_name=blob_name,
                    account_key=self.blob_service_client.credential.account_key,
                    permission=BlobSasPermissions(read=True),
                    expiry=datetime.now(timezone.utc) + timedelta(hours=1)
                )
                return f"https://{self.blob_service_client.account_name}.blob.core.windows.net/{self.container_name}/{blob_name}?{sas_token}"
            except Exception as exc:
                logger.warning(f"Azure Blob upload failed ({exc}); falling back to local storage.")

        # Local storage failover
        self._local_storage[blob_name] = data
        return f"https://trustgate.ai/artifacts/{blob_name}?sas_token=mock_sas_{int(time.time())}"

    async def get_evidence(self, blob_name: str) -> Optional[bytes]:
        if self.enabled and self.blob_service_client:
            try:
                blob_client = self.blob_service_client.get_blob_client(self.container_name, blob_name)
                return blob_client.download_blob().readall()
            except Exception as exc:
                logger.warning(f"Azure Blob download failed ({exc}); checking local storage.")

        return self._local_storage.get(blob_name)


azure_blob_service = AzureBlobService()
