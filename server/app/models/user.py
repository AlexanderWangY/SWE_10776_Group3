import uuid
import resend

from typing import List
from fastapi import Depends
from fastapi_users import BaseUserManager, UUIDIDMixin
from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTableUUID, SQLAlchemyUserDatabase
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String
from app.db.database import get_async_session
from .base import Base
from app.core.config import settings
from pydantic import BaseModel, ConfigDict
from app.schemas.user import UserResponse

class User(SQLAlchemyBaseUserTableUUID, Base):
    __tablename__ = "user"
    first_name: Mapped[str] = mapped_column(String, nullable=True)
    last_name: Mapped[str] = mapped_column(String, nullable=True)
    phone_number: Mapped[str] = mapped_column(String, nullable=True)
    listings: Mapped[List["Listing"]] = relationship(back_populates="seller", cascade="all, delete-orphan")

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
        await self.request_verify(user, request)


    async def on_after_request_verify(self, user, token, _ = None):
        print(f"Verification requested for user {user.id} with token {token}")
        verification_url = f"{settings.base_url}/auth/verify-email?token={token}"
        print(f"Verification URL: {verification_url}")
        params: resend.Emails.SendParams = {
            "from": "noreply@gatormarket.com",
            "to": [user.email],
            "subject": "Verify your email - GatorMarket",
            "html": f"<p>Please verify your email using the following link: <a href={verification_url}>Click to verify your email</a></p>"
        }
        email = resend.Emails.send(params)
        print(email)

    async def on_after_verify(self, user, request = None):
        print(f"User {user.id} has been verified.")


async def get_user_manager(user_db: SQLAlchemyUserDatabase = Depends(get_user_db)):
    yield UserManager(user_db)
