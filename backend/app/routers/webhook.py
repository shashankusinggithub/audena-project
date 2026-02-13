from fastapi import APIRouter, BackgroundTasks, HTTPException, status
from app.dependencies import SessionDep
from app.models.work import Work, WebhookCallStatus
from app.services.websocket import ws_manager
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="", tags=["webhooks"])


async def broadcast_update(work: Work):
    try:
        await ws_manager.broadcast({
            "type": "work_update",
            "data": {
                "id": work.id,
                "customer_name": work.customer_name,
                "phone_number": work.phone_number,
                "workflow": work.workflow,
                "status": work.status,
                "created_at": work.created_at.isoformat(),
                "updated_at": work.updated_at.isoformat(),
                "error_message": work.error_message
            }
        })
    except Exception as exc:
        logger.error(f"Error broadcasting work update for work {work.id}: {exc}")


@router.post("/webhooks", status_code=status.HTTP_200_OK)
async def receive_call_status(
    webhook_data: Work,
    background_tasks: BackgroundTasks,
    db: SessionDep
):
    try:
        work = db.get(Work, webhook_data.id)
        if not work:
            logger.warning(f"Work with id {webhook_data.id} not found for webhook update")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Work with id {webhook_data.id} not found"
            )
        
        work.status = webhook_data.status
        if webhook_data.error_message:
            work.error_message = webhook_data.error_message
        
        db.commit()
        
        background_tasks.add_task(broadcast_update, webhook_data)
        
        return {"status": "ok", "message": "Webhook processed successfully"}
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Error processing webhook: {exc}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process webhook: {str(exc)}"
        )
