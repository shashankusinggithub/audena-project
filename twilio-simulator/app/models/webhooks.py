from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel


class WebhookBaseRequest(SQLModel):
    app_id: str = Field(default=None, unique=True)
    callback_url: str

class Webhook_Callbacks(WebhookBaseRequest, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.now)

