from typing import Annotated, Generator
from fastapi import Depends
from sqlmodel import Session

from app.core.database import engine
from app.core.rabitmq import rabbitmq_service, RabbitMQConsumer


def get_session() -> Generator[Session, None, None]:
    """Create a database session. Must be used within a context manager."""
    session = Session(engine)
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


def get_rabbitmq_service() -> RabbitMQConsumer:
    return rabbitmq_service


SessionDep = Annotated[Session, Depends(get_session)]
RabbitMQDep = Annotated[RabbitMQConsumer, Depends(get_rabbitmq_service)]
