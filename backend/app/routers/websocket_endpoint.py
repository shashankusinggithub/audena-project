from fastapi import APIRouter, WebSocket, WebSocketDisconnect, status
from app.services.websocket import ws_manager
import logging

logger = logging.getLogger(__name__)

router = APIRouter(tags=["websocket"])


@router.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    try:
        await ws_manager.connect(websocket, client_id)
        logger.info(f"WebSocket client '{client_id}' connected")
        try:
            while True:
                data = await websocket.receive_text()
                logger.debug(f"Received message from client '{client_id}': {data}")
        except WebSocketDisconnect:
            logger.info(f"WebSocket client '{client_id}' disconnected normally")
            ws_manager.disconnect(client_id)
    except Exception as exc:
        logger.error(f"WebSocket error for client '{client_id}': {exc}")
        try:
            await websocket.close(code=status.WS_1011_INTERNAL_ERROR, reason="Server error")
        except Exception:
            pass
        ws_manager.disconnect(client_id)
