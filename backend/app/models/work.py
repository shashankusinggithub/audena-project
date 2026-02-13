from datetime import datetime
from enum import Enum
from typing import Optional
from sqlmodel import Field, SQLModel

class WorkStatus(str, Enum):
    PENDING = "pending"
    QUEUED = "queued"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"

class WorkflowType(str, Enum):
    SUPPORT = "support"
    SALES = "sales"
    REMINDER = "reminder"

class WorkBase(SQLModel):
    customer_name: str
    phone_number: str
    workflow: WorkflowType

class Work(WorkBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(
        default_factory=datetime.now,
        sa_column_kwargs={"onupdate": datetime.now}
    )
    external_call_id: Optional[str] = None
    error_message: Optional[str] = None
    status: WorkStatus = WorkStatus.PENDING
    app_id: Optional[str] = None


class WebhookCallStatus(SQLModel):
    app_id: str
    work_id: int
    status: WorkStatus
    error_message: Optional[str] = None
