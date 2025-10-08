from fastapi import Depends
from fastapi_users_db_sqlalchemy.access_token import (
    SQLAlchemyBaseAccessTokenTableUUID,
    SQLAlchemyAccessTokenDatabase
)
from fastapi_users.authentication.strategy.db import AccessTokenDatabase, DatabaseStrategy
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_async_session
from .base import Base

class AccessToken(SQLAlchemyBaseAccessTokenTableUUID, Base):
    pass


async def get_access_token_db(
    session: AsyncSession = Depends(get_async_session)
):
    """
    Gets a session's access token from the DB
    """
    yield SQLAlchemyAccessTokenDatabase(session, AccessToken)


def get_database_strategy(
    access_token_db: AccessTokenDatabase[AccessToken] = Depends(get_access_token_db)
) -> DatabaseStrategy:
    return DatabaseStrategy(access_token_db, lifetime_seconds=3600)