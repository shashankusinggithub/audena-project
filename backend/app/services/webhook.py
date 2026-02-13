import logging
from app.core.config import settings
from app.models.webhook import WebhookBaseRequest
import httpx

logger = logging.getLogger(__name__)

async def subscribe_webhook():
    webhook = WebhookBaseRequest(app_id=settings.UNIQUE_WORKER_ID, callback_url=settings.CALLBACK_URL)
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(f"{settings.TWILIO_SIMULATOR_URL}/subscribe", json=webhook.model_dump())
            response.raise_for_status()
        logger.info("Webhook subscribed successfully.")
        return True
    except httpx.RequestError as exc:
        logger.error(f"An error occurred while requesting {exc.request.url!r}: {exc}")
        return False
    except httpx.HTTPStatusError as exc:
        logger.error(f"Error response {exc.response.status_code} while requesting {exc.request.url!r}: {exc}")
        return False
    except Exception as exc:
        logger.error(f"An unexpected error occurred: {exc}")
        return False
