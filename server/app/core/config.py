from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import (
    PostgresDsn
)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(case_sensitive=False)

    database_url: PostgresDsn = (
        'postgresql://postgres:postgres@db:5432/postgres'
    )


settings = Settings()
