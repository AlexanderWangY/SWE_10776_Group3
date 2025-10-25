import uuid
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, DateTime, ForeignKey
from app.db.database import get_async_session
from .base import Base
from app.core.config import settings
from datetime import datetime, timezone
from app.models.user import User
from pydantic import BaseModel, ConfigDict

import enum
class ListingStatus(enum.Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    SOLD = "sold"
    INACTIVE = "inactive"
    ARCHIVED = "archived"

class Listing(Base):
    __tablename__ = "listing_table"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    seller_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    seller: Mapped["User"] = relationship(back_populates="listings")
    title: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(String, nullable=True)
    price_cents: Mapped[int] = mapped_column(Integer, nullable=False)
    status: Mapped[ListingStatus] = mapped_column(nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

class ListingResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    seller_id: uuid.UUID
    title: str
    description: str
    price_cents: int
    status: ListingStatus
    created_at: datetime
    updated_at: datetime