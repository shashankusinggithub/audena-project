from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import create_db_and_tables
from app.routers import api_router
from app.dependencies import get_rabbitmq_service
from app.services.webhook import subscribe_webhook

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    # subscribe webhook
    await subscribe_webhook()

    rabbitmq_service = get_rabbitmq_service()
    await rabbitmq_service.connect()
    yield
    await rabbitmq_service.disconnect()

app = FastAPI(title="Audena API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/health")
def health_check():
    return {"status": "healthy"}
