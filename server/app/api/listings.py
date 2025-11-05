from fastapi import APIRouter, Depends, Query, HTTPException
from app.db.database import get_async_session
from typing import Annotated, Optional
from app.models.listing import Listing
from app.schemas.listing import ListingResponse, UserListingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, asc, desc
from sqlalchemy.orm import selectinload
from app.models.user import User
from app.auth.backend import fastapi_users

router = APIRouter()

# https://stackoverflow.com/questions/74941021/using-sqlalchemy-what-is-a-good-way-to-load-related-object-that-are-were-not-ea
@router.get("/listings", tags=["listings"], response_model=list[UserListingResponse])
async def get_listings(
    async_session: AsyncSession = Depends(get_async_session),
    sort_by: Optional[str] = Query(None, description="Sort field: price, created_at, updated_at"),
    order: Optional[str] = Query(None, description="Sort order: asc or desc"),
):
    sort_fields = {
        "price": Listing.price_cents,
        "created_at": Listing.created_at,
        "updated_at": Listing.updated_at,
    }

    sort_column = sort_fields.get(sort_by, Listing.created_at)
    sort_order = (order or "desc").lower()

    if sort_by and sort_by not in sort_fields:
        raise HTTPException(status_code=400, detail=f"Invalid sort_by value '{sort_by}'. Must be 'price', 'created_at', or 'updated_at'.")

    if sort_order not in ["asc", "desc"]:
        raise HTTPException(status_code=400, detail="Invalid order value. Must be 'asc' or 'desc'.")

    async with async_session as session:
        statement = (
            select(Listing).options(selectinload(Listing.seller))
            .order_by(asc(sort_column) if sort_order == "asc" else desc(sort_column))
        )
        result = await session.scalars(statement)
        listings = result.all()
        return listings
    
@router.get("/listings/me", tags=["listings"], response_model=list[ListingResponse])
async def get_my_listings(
    async_session: AsyncSession = Depends(get_async_session),
    user: User = Depends(fastapi_users.current_user()),
):
    async with async_session as session:
        statement = select(Listing).where(Listing.seller_id == user.id)
        result = await session.scalars(statement)
        listings = result.all()
        return listings