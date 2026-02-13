import json 
import aio_pika
from app.dependencies import get_session, SessionDep
from app.services.webhook_service import send_webhook_callback
import asyncio 
from app.models.work import WorkStatus
import random
from app.models.webhooks import Webhook_Callbacks
from sqlmodel import select
import logging

logger = logging.getLogger(__name__)


async def handle_message_service(message: aio_pika.IncomingMessage):
    """Handle incoming RabbitMQ message and process work."""
    try:
        async with message.process():  # manual ACK
            data = json.loads(message.body)
            logger.info(f"Processing message: {data}")

            # Use context manager for session
            with next(get_session()) as db:
                result = {
                    **data,
                    "status": WorkStatus.IN_PROGRESS.value,
                    "app_id": message.app_id,
                }

                webhook = db.exec(
                    select(Webhook_Callbacks).where(Webhook_Callbacks.app_id == result["app_id"])
                ).first()
                
                if not webhook:
                    logger.error(f"Webhook not found for app_id: {result['app_id']}")
                    await message.reject(requeue=False)
                    return

                callback_url = webhook.callback_url
                
                await send_webhook_callback(callback_url, result)

                await asyncio.sleep(random.randint(5, 10))
                logger.debug("Processing complete, simulating final result")

                await asyncio.sleep(random.randint(5, 15))

                if random.random() < 0.3:
                    result["status"] = WorkStatus.FAILED.value
                    result["error_message"] = "Did not pick up the call"
                    logger.warning(f"Work failed for {data.get('id', 'unknown')}: Did not pick up the call")
                else:   
                    result["status"] = WorkStatus.COMPLETED.value
                    logger.info(f"Work completed successfully for {data.get('id', 'unknown')}")

                # Send final status webhook
                success = await send_webhook_callback(callback_url, result)
                if not success:
                    logger.error(f"Failed to send final webhook callback for work {data.get('id', 'unknown')}")
                    
    except json.JSONDecodeError as exc:
        logger.error(f"Invalid JSON in message: {exc}")
        await message.reject(requeue=False)
    except Exception as exc:
        logger.error(f"Error processing message: {exc}")
        await message.reject(requeue=True)

