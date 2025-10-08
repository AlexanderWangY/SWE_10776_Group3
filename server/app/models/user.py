import uuid

from fastapi import Depends
from fastapi_users import BaseUserManager, UUIDIDMixin
from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTableUUID, SQLAlchemyUserDatabase
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String
from app.db.database import get_async_session
from .base import Base
from app.core.config import settings



class User(SQLAlchemyBaseUserTableUUID, Base):
    first_name: Mapped[str] = mapped_column(String, nullable=True)
    last_name: Mapped[str] = mapped_column(String, nullable=True)
    phone_number: Mapped[str] = mapped_column(String, nullable=True)


async def get_user_db(
    session: AsyncSession = Depends(get_async_session)
):
    """
    Gets a session's user object from the DB
    """
    yield SQLAlchemyUserDatabase(session, User)


class UserManager(UUIDIDMixin, BaseUserManager[User, uuid.UUID]):
    reset_password_token_secret = settings.auth_secret
    verification_token_secret = settings.auth_secret

    async def on_after_register(self, user, request = None):
        print(f"User {user.id} has registered.")
        # Send verification email here
        await self.request_verify(user, request)


    async def on_after_request_verify(self, user, token, _ = None):
        print(f"Verification requested for user {user.id} with token {token}")
        verification_url = f"{settings.base_url}/auth/verify-email?token={token}"

        print(f"Verification URL: {verification_url}")

    async def on_after_verify(self, user, request = None):
        print(f"User {user.id} has been verified.")


async def get_user_manager(user_db: SQLAlchemyUserDatabase = Depends(get_user_db)):
    yield UserManager(user_db)