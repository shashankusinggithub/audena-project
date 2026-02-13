import json
import aio_pika
from aio_pika import ExchangeType
from app.core.config import settings
import uuid


class RabbitMQService:
    def __init__(self):
        self.connection = None
        self.channel = None
        self.exchange = None
        self.queue = None


    async def connect(self):
        if self.connection:  
            return
        
        self.connection = await aio_pika.connect_robust(
            settings.RABBITMQ_URL
        )
        self.channel = await self.connection.channel()

        await self.channel.set_qos(prefetch_count=10) # wont allow worker to grab more messages

        self.exchange = await self.channel.declare_exchange(
            settings.RABBITMQ_EXCHANGE_NAME,
            type=ExchangeType.TOPIC,
            durable=True
        )

        self.queue = await self.channel.declare_queue(
            settings.QUEUE_CALL_REQUESTS,
            durable=True,
        )

        await self.queue.bind(
            self.exchange,
            routing_key="work.call.request",
        )

    async def publish_work_request(self, work_id: int, work_data: dict):
        if not self.channel:
            raise RuntimeError("RabbitMQ channel not initialized")

        message_body = {"id": work_id, **work_data}

        message = aio_pika.Message(
            body=json.dumps(message_body).encode(),
            delivery_mode=aio_pika.DeliveryMode.PERSISTENT,
            message_id=str(uuid.uuid4()),
            app_id=settings.UNIQUE_WORKER_ID,
            headers={
            "x-user-id": "shashank",  # can be used to identify user logged in later
        },
        )
        

        await self.exchange.publish(
            message,
            routing_key="work.call.request",
        )


    async def disconnect(self):
        if self.connection:
            await self.connection.close()
            self.connection = None
            self.channel = None
            self.exchange = None
            self.queue = None

rabbitmq_service = RabbitMQService()
