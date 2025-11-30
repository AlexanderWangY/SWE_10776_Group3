from collections.abc import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.core.config import settings

# Use settings.database_url directly
ASYNC_DATABASE_URL = str(settings.database_url).replace(
    "postgresql://", "postgresql+asyncpg://"
)

# Remove sslmode=require from URL if present
ASYNC_DATABASE_URL = (
    ASYNC_DATABASE_URL.replace("sslmode=require", "").replace("&&", "&").rstrip("&")
)

# Decide if SSL is needed based on your environment
connect_args = {}
if "neon.tech" in ASYNC_DATABASE_URL:
    connect_args["ssl"] = True

# Create async engine
engine = create_async_engine(
    ASYNC_DATABASE_URL,
    connect_args=connect_args,
)

# Async session factory
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)


# Dependency for FastAPI routes
async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session
