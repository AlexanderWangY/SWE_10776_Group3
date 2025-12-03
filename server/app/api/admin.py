from fastapi import APIRouter, Depends, Query, HTTPException
from app.db.database import get_async_session
from typing import Annotated, Optional
from app.models.listing import Listing, ListingStatus
from app.schemas.user import UserResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, asc, desc, func, update
from app.models.user import User
from app.auth.backend import fastapi_users
from app.schemas.pagination import Pagination, SortEnum, pagination_params
from app.schemas.listing import ListingResponse
import uuid
from app.api.listings import get_listings

router = APIRouter()

@router.post("/admin/users/{user_id}/deactivate_listings", tags=["admin"], response_model=list[ListingResponse])
async def deactivate_user_listings(
    user_id: uuid.UUID,
    async_session: AsyncSession = Depends(get_async_session),
    current_user = Depends(fastapi_users.current_user())
):
    """
    This function deactivates all listings for the selected user, used after banning a user.
    """
    check_admin(current_user)
    async with async_session as session:
        statement = (
            update(Listing)
            .where(Listing.seller_id == user_id)
            .values(status=ListingStatus.INACTIVE.value)
        )
        await session.execute(statement)
        await session.commit()
        new_statement = select(Listing).where(Listing.seller_id == user_id)
        result = await session.scalars(new_statement)
        listings = result.all()
        return listings


@router.post("/admin/users/{user_id}/activate_listings", tags=["admin"], response_model=list[ListingResponse])
async def activate_user_listings(
    user_id: uuid.UUID,
    async_session: AsyncSession = Depends(get_async_session),
    current_user = Depends(fastapi_users.current_user())
):
    """
    This function activates all listings for the selected user, used after unbanning a user.
    """
    check_admin(current_user)
    async with async_session as session:
        statement = (
            update(Listing)
            .where(Listing.seller_id == user_id)
            .values(status=ListingStatus.ACTIVE.value)
        )
        await session.execute(statement)
        await session.commit()
        new_statement = select(Listing).where(Listing.seller_id == user_id)
        result = await session.scalars(new_statement)
        listings = result.all()
        return listings
    

def check_admin(user):
    """
    This function checks if the current user is an admin and raises a 403 Forbidden error if not
    Used for admin-only actions
    """
    if not user.is_superuser:
        raise HTTPException(status_code=403, detail="Must be administrator to access this page.")
    
@router.get("/admin/listings", tags=["admin"], response_model=list[ListingResponse])
async def get_listings_admin(
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
    keyword: Optional[str] = Query(None, description="Keyword to search in title or description"),
    current_user = Depends(fastapi_users.current_user())
):
    """
    This route retrieves listings for the administrator Listings Management page.
    """
    check_admin(current_user)
    return await get_listings(
        pagination=pagination,
        async_session=async_session,
        sort_by=sort_by,
        order=order,
        status=status,
        category=category,
        condition=condition,
        min_price=min_price,
        max_price=max_price,
        keyword=keyword
    )

@router.get("/admin/users/total", tags=["admin"])
async def get_total_users(
    async_session: AsyncSession = Depends(get_async_session),
    current_user = Depends(fastapi_users.current_user())
):
    """
    This route retrieves the total number of users in the database.
    It can be used for paginating users on the admin User Management page.
    """
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
    """
    This route retrieves a user by their ID for admin use only.
    """
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
    """
    This route retrieves all the listings for a given user ID for admin use only.
    """
    check_admin(current_user)
    async with async_session as session:
        statement = select(Listing).where(Listing.seller_id == user_id)
        result = await session.scalars(statement)
        listings = result.all()
        return listings

def check_ban_request(
    user: User,
    current_user = Depends(fastapi_users.current_user())
):
    """
    This function determines if the ban request is valid.
    The ban request is not valid if the admin is trying to ban themselves or another admin.
    Raises a 400 Bad Request error if the ban request is invalid.
    """
    if current_user.id == user.id:
        raise HTTPException(status_code=400, detail="Administrators cannot ban themselves.")
    if user.is_superuser:
        raise HTTPException(status_code=400, detail="Administrators cannot ban other administrators.")
    
@router.post("/admin/users/{user_id}/ban", tags=["admin"], response_model=UserResponse)
async def ban_user_by_id(
    user_id: uuid.UUID,
    async_session: AsyncSession = Depends(get_async_session),
    current_user = Depends(fastapi_users.current_user()),
):
    """
    This function bans a user using their id, for admin only.
    """
    check_admin(current_user)
    result = await async_session.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found.")
    check_ban_request(user, current_user)
    if not user.is_banned:
        user.is_banned = True
        await async_session.commit()
        await async_session.refresh(user)
    return user

@router.post("/admin/users/{user_id}/unban", tags=["admin"], response_model=UserResponse)
async def unban_user_by_id(
    user_id: uuid.UUID,
    async_session: AsyncSession = Depends(get_async_session),
    current_user = Depends(fastapi_users.current_user()),
):
    """
    This function reinstates a user's account using their id, for admin only.
    """
    check_admin(current_user)
    result = await async_session.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found.")
    if user.is_banned:
        user.is_banned = False
        await async_session.commit()
        await async_session.refresh(user)
    return user
    
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
    """
    This route retrieves all of the users in the database for the admin User Management page.
    """
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
    
    # Accessing the database and retrieving the users.
    async with async_session as session:
        statement = select(User)

        # Filtering users by active status
        if is_active:
            if is_active.lower() == "yes":
                active_bool = True
            elif is_active.lower() == "no":
                active_bool = False
            else:
                raise HTTPException(status_code=400, detail=f"Invalid is_active value '{is_active}'.")
            statement = statement.where(User.is_active == active_bool)

        # Filtering users by admin status
        if is_admin:
            if is_admin.lower() == "yes":
                admin_bool = True
            elif is_admin.lower() == "no":
                admin_bool = False
            else:
                raise HTTPException(status_code=400, detail=f"Invalid is_admin value '{is_admin}'.")
            statement = statement.where(User.is_superuser == admin_bool)
        
        # Filtering users by verification status
        if is_verified:
            if is_verified.lower() == "yes":
                verified_bool = True
            elif is_verified.lower() == "no":
                verified_bool = False
            else:
                raise HTTPException(status_code=400, detail=f"Invalid is_verified value '{is_verified}'.")
            statement = statement.where(User.is_verified == verified_bool)

        # Filtering users by keyword in first name or last name
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