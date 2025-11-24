from fastapi import APIRouter, Depends, Query, HTTPException
from app.db.database import get_async_session
from typing import Annotated, Optional
from app.models.listing import Listing, ListingCategory, ListingCondition, ListingStatus
from app.schemas.user import UserResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, asc, desc, func
from sqlalchemy.orm import selectinload
from app.models.user import User
from app.auth.backend import fastapi_users
from app.schemas.pagination import Pagination, SortEnum, pagination_params
from app.schemas.listing import ListingResponse
import uuid

router = APIRouter()

def check_admin(user):
    if not user.is_superuser:
        raise HTTPException(status_code=401, detail="Must be administrator to access this page.")

@router.get("/admin/users/total", tags=["admin"])
async def get_total_users(
    async_session: AsyncSession = Depends(get_async_session),
    current_user = Depends(fastapi_users.current_user())
):
    check_admin(current_user)
    async with async_session as session:
        total = await session.scalar(select(func.count(User.id)))
        return {"total": total}
    
@router.get("/admin/users/{user_id}", tags=["admin"], response_model=UserResponse)
async def get_user_by_id(
    user_id: uuid.UUID,
    async_session: AsyncSession = Depends(get_async_session),
    current_user = Depends(fastapi_users.current_user())
):
    check_admin(current_user)
    async with async_session as session:
        statement = (
            select(User)
            .where(User.id == user_id)
        )
        result = await session.scalars(statement)
        user = result.one()
        return user
    
@router.get("/admin/users/{user_id}/listings", tags=["admin"], response_model=list[ListingResponse])
async def get_user_listings_by_id(
    user_id: uuid.UUID,
    async_session: AsyncSession = Depends(get_async_session),
    current_user = Depends(fastapi_users.current_user())
):
    check_admin(current_user)
    async with async_session as session:
        statement = select(Listing).where(Listing.seller_id == user_id)
        result = await session.scalars(statement)
        listings = result.all()
        return listings
    
@router.get("/admin/users", tags=["admin"], response_model=list[UserResponse])
async def get_users(
    # in query parameters, specify page_num to indicate the page number and card_num to indicate the number of cards for pagination
    pagination: Annotated[Pagination, Depends(pagination_params)],
    current_user = Depends(fastapi_users.current_user()),
    async_session: AsyncSession = Depends(get_async_session),
    sort_by: Optional[str] = Query(None, description="Sort field: first name, last name, phone number, email"),
    order: Optional[str] = Query(SortEnum.ASC.value, description="Sort order: asc or desc"),

    # Filters
    is_active: Optional[str] = Query(None, description="If the user is active, matches with yes or no"),
    is_admin: Optional[str] = Query(None, description="If the user is admin or user, matches with yes or no"),
    is_verified: Optional[str] = Query(None, description="If the user is verified, matches with yes or no"),
    keyword: Optional[str] = Query(None, description="Keyword to search for user first name or last name")

):
    check_admin(current_user)
    sort_fields = {
        "first_name": User.first_name,
        "last_name": User.last_name,
        "phone_number": User.phone_number,
        "email": User.email,
    }

    sort_column = sort_fields.get(sort_by, User.first_name)
    sort_order = order.lower()

    if sort_by and sort_by not in sort_fields:
        raise HTTPException(status_code=400, detail=f"Invalid sort_by value '{sort_by}'. Must be 'first_name', 'last_name', 'phone_number', or 'email'.")

    if sort_order not in SortEnum:
        raise HTTPException(status_code=400, detail="Invalid order value. Must be 'asc' or 'desc'.")
    
    async with async_session as session:
        statement = select(User)

        if is_active:
            if is_active.lower() == "yes":
                active_bool = True
            elif is_active.lower() == "no":
                active_bool = False
            else:
                raise HTTPException(status_code=400, detail=f"Invalid is_active value '{is_active}'.")
            statement = statement.where(User.is_active == active_bool)

        if is_admin:
            if is_admin.lower() == "yes":
                admin_bool = True
            elif is_admin.lower() == "no":
                admin_bool = False
            else:
                raise HTTPException(status_code=400, detail=f"Invalid is_admin value '{is_admin}'.")
            statement = statement.where(User.is_superuser == admin_bool)

        if is_verified:
            if is_verified.lower() == "yes":
                verified_bool = True
            elif is_verified.lower() == "no":
                verified_bool = False
            else:
                raise HTTPException(status_code=400, detail=f"Invalid is_verified value '{is_verified}'.")
            statement = statement.where(User.is_verified == verified_bool)

        if keyword:
            search_filter = f"%{keyword}%"
            # Source: https://stackoverflow.com/questions/20363836/postgresql-ilike-query-with-sqlalchemy
            # Source: https://stackoverflow.com/questions/7942547/using-or-in-sqlalchemy
            statement = statement.filter(User.first_name.ilike(search_filter) | User.last_name.ilike(search_filter))

        statement = (
            statement.limit(pagination.card_num)
            .offset(
                pagination.page_num - 1
                if pagination.page_num == 1
                else (pagination.page_num - 1) * pagination.card_num
            )
            .order_by(desc(sort_column) if sort_order == SortEnum.DESC.value else asc(sort_column))
        )

        result = await session.scalars(statement)
        users = result.all()
        return users