from pydantic import BaseModel, ConfigDict
from app.models.listing import ListingStatus
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

class ListingResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    description: str
    price_cents: int
    status: ListingStatus
    created_at: datetime
    updated_at: datetime