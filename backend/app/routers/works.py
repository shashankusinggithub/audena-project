from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse
from sqlmodel import select
from app.dependencies import SessionDep
from app.models.work import Work, WorkBase, WorkStatus
from app.dependencies import RabbitMQDep
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/works", tags=["works"])


@router.post("", response_model=Work, status_code=status.HTTP_201_CREATED)
async def create_work(work_data: WorkBase, db: SessionDep, rabbitmq_service: RabbitMQDep):
    try:
        work = Work(**work_data.model_dump(), status=WorkStatus.QUEUED)
        db.add(work)
        db.commit()
        db.refresh(work)
        
        await rabbitmq_service.publish_work_request(work.id, {
            "customer_name": work.customer_name,
            "phone_number": work.phone_number,
            "workflow": work.workflow.value
        })
        
        return work
    except Exception as exc:
        logger.error(f"Error creating work: {exc}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create work: {str(exc)}"
        )


@router.get("", response_model=list[Work])
def list_works(db: SessionDep):
    try:
        statement = select(Work).order_by(Work.created_at.desc())
        return db.exec(statement).all()
    except Exception as exc:
        logger.error(f"Error listing works: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to list works: {str(exc)}"
        )


@router.get("/{work_id}", response_model=Work)
def get_work(work_id: int, db: SessionDep):
    try:
        work = db.get(Work, work_id)
        if not work:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Work with id {work_id} not found"
            )
        return work
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Error getting work {work_id}: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get work: {str(exc)}"
        )
