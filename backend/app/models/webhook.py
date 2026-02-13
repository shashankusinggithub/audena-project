from sqlmodel import Field, SQLModel
from app.core.config import settings


class WebhookBaseRequest(SQLModel):
    app_id: str = Field(default=settings.UNIQUE_WORKER_ID)
    callback_url: str