import aio_pika
from aio_pika import ExchangeType
from typing import Callable, Awaitable
from app.core.config import settings


class RabbitMQConsumer:
    def __init__(
        self
    ):
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

    async def start_consuming(
        self,
        handler: Callable[[aio_pika.IncomingMessage], Awaitable[None]],
    ):
        await self.queue.consume(handler)

    async def disconnect(self):
        if self.connection:
            await self.connection.close()
            self.connection = None
            self.channel = None
            self.exchange = None
            self.queue = None


rabbitmq_service = RabbitMQConsumer()