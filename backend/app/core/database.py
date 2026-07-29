from typing import Dict, Any, Optional, List
import logging

logger = logging.getLogger("trustgate.repository")


class InMemoryStore:
    def __init__(self):
        self.data: Dict[str, Dict[str, Any]] = {}
        
    async def create(self, collection: str, item_id: str, document: dict) -> dict:
        if collection not in self.data:
            self.data[collection] = {}
        self.data[collection][item_id] = document
        return document
        
    async def read(self, collection: str, item_id: str) -> Optional[dict]:
        return self.data.get(collection, {}).get(item_id)
        
    async def update(self, collection: str, item_id: str, document: dict) -> dict:
        if collection not in self.data:
            self.data[collection] = {}
        self.data[collection][item_id] = document
        return document
        
    async def delete(self, collection: str, item_id: str) -> bool:
        if collection in self.data and item_id in self.data[collection]:
            del self.data[collection][item_id]
            return True
        return False

    async def list_all(self, collection: str) -> List[dict]:
        return list(self.data.get(collection, {}).values())


class CosmosDBClient:
    def __init__(self, demo_mode: bool = True):
        self.demo_mode = demo_mode
        self.store = InMemoryStore()
        
    async def connect(self):
        logger.info("CosmosDB Client connected.")
        
    async def disconnect(self):
        logger.info("CosmosDB Client disconnected.")


db_client = CosmosDBClient(demo_mode=True)


class BaseRepository:
    def __init__(self, collection_name: str, client: CosmosDBClient = db_client):
        self.collection = collection_name
        self.client = client

    async def save(self, item_id: str, data: dict) -> dict:
        return await self.client.store.create(self.collection, item_id, data)

    async def get(self, item_id: str) -> Optional[dict]:
        return await self.client.store.read(self.collection, item_id)

    async def update(self, item_id: str, data: dict) -> dict:
        return await self.client.store.update(self.collection, item_id, data)

    async def delete(self, item_id: str) -> bool:
        return await self.client.store.delete(self.collection, item_id)

    async def list_all(self) -> List[dict]:
        return await self.client.store.list_all(self.collection)


class SessionRepository(BaseRepository):
    def __init__(self, client: CosmosDBClient = db_client):
        super().__init__("sessions", client)


class PassportRepository(BaseRepository):
    def __init__(self, client: CosmosDBClient = db_client):
        super().__init__("passports", client)


class AuditRepository(BaseRepository):
    def __init__(self, client: CosmosDBClient = db_client):
        super().__init__("audit_logs", client)


async def get_session_repo() -> SessionRepository:
    return SessionRepository()


async def get_passport_repo() -> PassportRepository:
    return PassportRepository()


async def get_audit_repo() -> AuditRepository:
    return AuditRepository()