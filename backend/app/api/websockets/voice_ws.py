from fastapi import APIRouter, WebSocket
router = APIRouter(tags=["WebSocket"])
@router.websocket("/ws/voice/{session_id}")
async def voice_ws(websocket: WebSocket, session_id: str):
    await websocket.accept()
    await websocket.send_json({"status": "connected"})\n