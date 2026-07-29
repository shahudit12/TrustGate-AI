from fastapi import APIRouter, WebSocket
router = APIRouter(tags=["WebSocket"])
@router.websocket("/ws/face/{session_id}")
async def face_ws(websocket: WebSocket, session_id: str):
    await websocket.accept()
    await websocket.send_json({"status": "connected"})\n