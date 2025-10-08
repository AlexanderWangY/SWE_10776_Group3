from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    async_sessionmaker,
    create_async_engine,
    AsyncSession
)
from app.core.config import settings
from sqlalchemy.orm import DeclarativeBase

ASYNC_DATABASE_URL = str(settings.database_url).replace(
    "postgresql://", "postgresql+asyncpg://"
)

class Base(DeclarativeBase):
    pass


engine = create_async_engine(ASYNC_DATABASE_URL)

AsyncSessionLocal = async_sessionmaker(
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
    bind=engine
)

async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session
