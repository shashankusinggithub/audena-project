from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./audena.db"
    TWILIO_SIMULATOR_URL: str = "http://twilio-simulator:9000"
    CORS_ORIGINS: str = "*"
    
    RABBITMQ_URL: str = "amqp://guest:guest@localhost:5672/"
    RABBITMQ_EXCHANGE_NAME: str = "work_topic_exchange"
    QUEUE_CALL_REQUESTS: str = "work_call_requests"
    UNIQUE_WORKER_ID: str = "publisher"
    CALLBACK_URL: str = "http://backend:8000/api/webhooks"


    model_config = SettingsConfigDict(env_file=".env")
    
    @property
    def cors_origins_list(self):
        return [o.strip() for o in self.CORS_ORIGINS.split(",")]

settings = Settings()
