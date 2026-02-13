import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import aio_pika

from app.models.webhooks import WebhookBaseRequest, Webhook_Callbacks
from app.dependencies import get_rabbitmq_service, RabbitMQConsumer, SessionDep
from app.core.database import create_db_and_tables
from app.services.consume import handle_message_service
from app.core.config import settings
from sqlmodel import select

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    rabbitmq_service:RabbitMQConsumer = get_rabbitmq_service()
    await rabbitmq_service.connect()
    await rabbitmq_service.start_consuming(handle_message)
    yield
    await rabbitmq_service.disconnect()


app = FastAPI(lifespan=lifespan, port=8001)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def handle_message(message: aio_pika.IncomingMessage):
    await handle_message_service(message)



@app.post("/subscribe", status_code=status.HTTP_201_CREATED)
async def subscribe(webhook: WebhookBaseRequest, db: SessionDep):
    try:
        # Check if webhook already exists
        existing = db.exec(
            select(Webhook_Callbacks).where(Webhook_Callbacks.app_id == webhook.app_id)
        ).first()
        
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Webhook with app_id '{webhook.app_id}' already exists"
            )
        
        # Create new webhook callback
        webhook_callback = Webhook_Callbacks(**webhook.model_dump())
        db.add(webhook_callback)
        db.commit()
        db.refresh(webhook_callback)
        
        logger.info(f"Webhook subscribed successfully for app_id: {webhook.app_id}")
        
        return {
            "status": "subscribed",
            "message": f"Webhook registered for app_id: {webhook.app_id}",
            "id": webhook_callback.id
        }
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Error subscribing webhook: {exc}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to subscribe webhook: {str(exc)}"
        )



@app.get("/health")
async def health_check():
    return {"status": "healthy"}
