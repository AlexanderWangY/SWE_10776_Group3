import uuid
from pydantic import BaseModel, ConfigDict, computed_field, field_serializer
from app.models.listing import ListingStatus, ListingCategory, ListingCondition
from datetime import datetime
from app.core.config import settings
from fastapi import UploadFile, File

# Source: https://medium.com/@ajaygohil2563/unlocking-the-power-of-nested-pydantic-schemas-in-fastapi-d7c872423aa4

class SellerResponse(BaseModel):
    """Pydantic model used to retrieve the listing seller's details."""
    first_name: str
    last_name: str
    phone_number: str
    email: str

class UserListingResponse(BaseModel):
    """Pydantic model used to retrieve a listing along with its seller's details."""
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    seller: SellerResponse
    description: str
    price_cents: int
    status: ListingStatus
    created_at: datetime
    updated_at: datetime
    category: ListingCategory | None
    condition: ListingCondition | None
    image: str | None

    @field_serializer('status', 'category', 'condition', mode='plain')
    def remove_underscores(self, value) -> str:
        """Removes underscores from enum values and makes them lowercase to pass to frontend."""
        if value is None:
            return None
        return value.value.replace("_", " ").lower()
    
    @computed_field
    @property
    def image_url(self) -> str | None:
        """Generates the URL for serving listing images."""
        if self.image is None:
            return None

        return f"{settings.base_url}/static/{self.image}" # Source: https://github.com/fastapi/fastapi/discussions/9430
    
class ListingResponse(BaseModel):
    """
    Pydantic model used to retrieve a listing's details without the seller's info.
    Used for the user profile listings, for example.
    """
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    description: str
    price_cents: int
    status: ListingStatus
    created_at: datetime
    updated_at: datetime
    category: ListingCategory | None
    condition: ListingCondition | None
    image: str | None

    @field_serializer('status', 'category', 'condition', mode='plain')
    def remove_underscores(self, value) -> str:
        """
        Removes underscores from enum values to pass to the frontend.
        """
        if value is None:
            return None
        return value.value.replace("_", " ").lower()
    
    @computed_field
    @property
    def image_url(self) -> str | None:
        """Generates the URL for serving listing images."""
        if self.image is None:
            return None

        return f"{settings.base_url}/static/{self.image}" # Source: https://github.com/fastapi/fastapi/discussions/9430