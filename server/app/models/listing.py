import uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, DateTime, ForeignKey
from .base import Base
from datetime import datetime, timezone
import enum

class ListingStatus(enum.Enum):
    DRAFT = "DRAFT"
    ACTIVE = "ACTIVE"
    SOLD = "SOLD"
    INACTIVE = "INACTIVE"
    ARCHIVED = "ARCHIVED"

# copilot autocomplete was used to help generate this enum
class ListingCategory(enum.Enum):
    ELECTRONICS = "ELECTRONICS"
    SCHOOL_SUPPLIES = "SCHOOL_SUPPLIES"
    FURNITURE = "FURNITURE"
    APPLIANCES = "APPLIANCES"
    CLOTHING = "CLOTHING"
    TEXTBOOKS = "TEXTBOOKS"
    MISCELLANEOUS = "MISCELLANEOUS"

# copilot autocomplete was used to help generate this enum
class ListingCondition(enum.Enum):
    NEW = "NEW"
    LIKE_NEW = "LIKE_NEW"
    VERY_GOOD = "VERY_GOOD"
    GOOD = "GOOD"
    USED = "USED"

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
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    category: Mapped[ListingCategory] = mapped_column(nullable=True)
    condition: Mapped[ListingCondition] = mapped_column(nullable=True)
    image: Mapped[str] = mapped_column(String, default="images/listings/placeholder.jpg", server_default="images/listings/placeholder.jpg", nullable=True)