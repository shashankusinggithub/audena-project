from typing import Annotated, Generator
from fastapi import Depends
from sqlmodel import Session

from app.core.database import engine
from app.core.rabitmq import rabbitmq_service, RabbitMQService



def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session

def get_rabbitmq_service() -> RabbitMQService:
    return rabbitmq_service

SessionDep = Annotated[Session, Depends(get_session)]
RabbitMQDep = Annotated[RabbitMQService, Depends(get_rabbitmq_service)]
