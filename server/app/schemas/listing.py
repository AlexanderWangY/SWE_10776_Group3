from pydantic import BaseModel, ConfigDict, computed_field, field_serializer
from app.models.listing import ListingStatus, ListingCategory, ListingCondition
from datetime import datetime

# Source: https://medium.com/@ajaygohil2563/unlocking-the-power-of-nested-pydantic-schemas-in-fastapi-d7c872423aa4

class SellerResponse(BaseModel):
    first_name: str
    last_name: str
    phone_number: str

class UserListingResponse(BaseModel):
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

    @field_serializer('status', 'category', 'condition', mode='plain')
    def remove_underscores(self, value) -> str:
        return value.value.replace("_", " ").lower()
    
class ListingResponse(BaseModel):
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

    @field_serializer('status', 'category', 'condition', mode='plain')
    def remove_underscores(self, value) -> str:
        if value is None:
            return None
        return value.value.replace("_", " ")