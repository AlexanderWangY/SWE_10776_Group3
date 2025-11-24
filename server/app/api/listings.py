from fastapi import APIRouter, Depends, Query, HTTPException
from app.db.database import get_async_session
from typing import Annotated, Optional
from app.models.listing import Listing, ListingCategory, ListingCondition, ListingStatus
from app.schemas.listing import ListingResponse, UserListingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, asc, desc, func
from sqlalchemy.orm import selectinload
from app.models.user import User
from app.auth.backend import fastapi_users
from app.schemas.pagination import Pagination, SortEnum, pagination_params

router = APIRouter()

@router.get("/listings/total", tags=["listings"])
async def get_total_listings(
    async_session: AsyncSession = Depends(get_async_session)
):
    async with async_session as session:
        total = await session.scalar(select(func.count(Listing.id)))
        return {"total": total}

@router.get("/listings/{listing_id}", tags=["listings"], response_model=UserListingResponse)
async def get_listing_by_id(
    listing_id: int,
    async_session: AsyncSession = Depends(get_async_session)
):
    async with async_session as session:
        statement = (
            select(Listing)
            .options(selectinload(Listing.seller))
            .where(Listing.id == listing_id)
        )
        result = await session.scalars(statement)
        listing = result.one()
        return listing

# Pagination tutorial: https://www.youtube.com/watch?v=Em6OzzcO9Xo
# https://stackoverflow.com/questions/74941021/using-sqlalchemy-what-is-a-good-way-to-load-related-object-that-are-were-not-ea
@router.get("/listings", tags=["listings"], response_model=list[UserListingResponse])
async def get_listings(
    # in query parameters, specify page_num to indicate the page number and card_num to indicate the number of cards for pagination
    pagination: Annotated[Pagination, Depends(pagination_params)],
    async_session: AsyncSession = Depends(get_async_session),
    sort_by: Optional[str] = Query("updated_at", description="Sort field: price, created_at, updated_at"),
    order: Optional[str] = Query(SortEnum.DESC.value, description="Sort order: asc or desc"),

    # Filters
    status: Optional[str] = Query(None, description="Status value (matching ListingStatus enum)"),
    category: Optional[str] = Query(None, description="Category value (matching ListingCategory enum)"),
    condition: Optional[str] = Query(None, description="Condition value (matching ListingCondition enum)"),
    min_price: Optional[int] = Query(None, ge=0),
    max_price: Optional[int] = Query(None, ge=0),

):
    sort_fields = {
        "id": Listing.title,
        "price": Listing.price_cents,
        "created_at": Listing.created_at,
        "updated_at": Listing.updated_at,
    }

    sort_column = sort_fields.get(sort_by, Listing.updated_at)
    sort_order = order.lower()

    if sort_by and sort_by not in sort_fields:
        raise HTTPException(status_code=400, detail=f"Invalid sort_by value '{sort_by}'. Must be 'price', 'created_at', or 'updated_at'.")

    if sort_order not in SortEnum:
        raise HTTPException(status_code=400, detail="Invalid order value. Must be 'asc' or 'desc'.")
    
    async with async_session as session:
        statement = select(Listing).options(selectinload(Listing.seller))

        if status:
            try:
                status_enum = ListingStatus[status.upper()]
            except KeyError:
                raise HTTPException(status_code=400, detail=f"Invalid status value '{status}'.")
            statement = statement.where(Listing.status == status_enum)

        if category:
            try:
                category_enum = ListingCategory[category.upper()]
            except KeyError:
                raise HTTPException(status_code=400, detail=f"Invalid category value '{category}'.")
            statement = statement.where(Listing.category == category_enum)

        if condition:
            try:
                condition_enum = ListingCondition[condition.upper()]
            except KeyError:
                raise HTTPException(status_code=400, detail=f"Invalid condition value '{condition}'.")
            statement = statement.where(Listing.condition == condition_enum)

        if min_price is not None:
            statement = statement.where(Listing.price_cents >= min_price)

        if max_price is not None:
            statement = statement.where(Listing.price_cents <= max_price)

        statement = (
            statement.limit(pagination.card_num)
            .offset(
                pagination.page_num - 1
                if pagination.page_num == 1
                else (pagination.page_num - 1) * pagination.card_num
            )
            .order_by(asc(sort_column) if sort_order == SortEnum.ASC.value else desc(sort_column))
        )

        result = await session.scalars(statement)
        listings = result.all()
        return listings