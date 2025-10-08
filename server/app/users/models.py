import uuid

from fastapi import Depends
from fastapi_users.db import (
    SQLAlchemyUserDatabase,
    SQLAlchemyBaseUserTableUUID
)
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String
from app.db.database import get_async_session
from app.db.database import Base
from fastapi_users import BaseUserManager, UUIDIDMixin


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
    reset_password_token_secret = "Placeholder"
    verification_token_secret = "Placeholder"

    async def on_after_register(self, user, request = None):
        print(f"User {user.id} has registered.")
        # Send welcome email here

    async def on_after_forgot_password(self, user, token, request = None):
        print(f"User {user.id} has forgot their password. Reset token: {token}")
        # Send password reset email here

    async def on_after_request_verify(self, user, token, request = None):
        print(f"Verification requested for user {user.id}. Verification token: {token}")
        # Check if verification token is valid here

async def get_user_manager(
        user_db=Depends(get_user_db)
):
    yield UserManager(user_db)