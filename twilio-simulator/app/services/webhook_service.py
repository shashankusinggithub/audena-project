from app.dependencies import SessionDep
import httpx
from app.models.webhooks import Webhook_Callbacks
from sqlmodel import select
import logging
import asyncio

logger = logging.getLogger(__name__)

MAX_RETRIES = 3
RETRY_DELAY = 2  # seconds


async def send_webhook_callback(callback_url: str, result: dict, retry_count: int = 0):
    """
    Send webhook callback with retry mechanism.
    
    Args:
        callback_url: The URL to send the webhook to
        result: The data to send in the webhook
        retry_count: Current retry attempt (used internally for recursion)
    
    Returns:
        True if successful, False if all retries failed
    """
    try:
        async with httpx.AsyncClient(timeout=httpx.Timeout(30.0)) as client:
            response = await client.post(callback_url, json=result)
            response.raise_for_status()
            logger.info(f"Webhook sent successfully to {callback_url}")
            return True
    except httpx.TimeoutException as exc:
        logger.warning(f"Webhook timeout for {callback_url}: {exc}")
        if retry_count < MAX_RETRIES:
            logger.info(f"Retrying webhook (attempt {retry_count + 1}/{MAX_RETRIES})...")
            await asyncio.sleep(RETRY_DELAY)
            return await send_webhook_callback(callback_url, result, retry_count + 1)
        logger.error(f"Webhook failed after {MAX_RETRIES} retries: {callback_url}")
        return False
    except httpx.HTTPStatusError as exc:
        logger.error(f"Webhook HTTP error {exc.response.status_code} for {callback_url}: {exc.response.text}")
        if retry_count < MAX_RETRIES and 500 <= exc.response.status_code < 600:
            logger.info(f"Retrying webhook (attempt {retry_count + 1}/{MAX_RETRIES})...")
            await asyncio.sleep(RETRY_DELAY)
            return await send_webhook_callback(callback_url, result, retry_count + 1)
        return False
    except httpx.RequestError as exc:
        logger.error(f"Webhook request error for {callback_url}: {exc}")
        if retry_count < MAX_RETRIES:
            logger.info(f"Retrying webhook (attempt {retry_count + 1}/{MAX_RETRIES})...")
            await asyncio.sleep(RETRY_DELAY)
            return await send_webhook_callback(callback_url, result, retry_count + 1)
        logger.error(f"Webhook failed after {MAX_RETRIES} retries: {callback_url}")
        return False
    except Exception as exc:
        logger.error(f"Unexpected error sending webhook to {callback_url}: {exc}")
        return False