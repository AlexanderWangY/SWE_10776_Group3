from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import (
    PostgresDsn
)
import resend

class Settings(BaseSettings):
    """
    This class is used to manage our environment variables.
    """
    model_config = SettingsConfigDict(case_sensitive=False)

    auth_secret: str = "CHANGE_ME_TO_A_RANDOM_SECRET"
    cookie_domain: str = "localhost"
    cookie_secure: bool = False
    resend_api_key: str

    base_url: str = "http://localhost:8080"
    port: int = 8080

    database_url: PostgresDsn = (
        'postgresql://postgres:postgres@db:5432/postgres'
    )

    frontend_url: str = "http://localhost:5173"


settings = Settings()
resend.api_key = settings.resend_api_key