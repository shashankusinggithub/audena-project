from fastapi import APIRouter
from app.routers import works, webhook, websocket_endpoint

api_router = APIRouter(prefix="")
api_router.include_router(works.router)
api_router.include_router(webhook.router)
api_router.include_router(websocket_endpoint.router)
