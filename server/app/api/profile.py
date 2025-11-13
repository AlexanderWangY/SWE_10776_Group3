from fastapi import APIRouter, Depends, status, HTTPException
from app.auth.backend import fastapi_users, auth_backend
from app.db.database import get_async_session, AsyncSession
from app.schemas.user import UserRead, UserCreate, CustomUserUpdate, UserResponse
from app.models.listing import Listing
from app.schemas.listing import ListingResponse, UserListingResponse
from app.models.user import get_user_manager, User
from fastapi_users.manager import BaseUserManager
from fastapi_users import exceptions, models
from fastapi.responses import RedirectResponse
from app.core.config import settings
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_async_session
from sqlalchemy import select

router = APIRouter()

@router.get("/profile/listings", tags=["profile"], response_model=list[ListingResponse])
async def get_my_listings(
    async_session: AsyncSession = Depends(get_async_session),
    user: User = Depends(fastapi_users.current_user()),
):
    async with async_session as session:
        statement = select(Listing).where(Listing.seller_id == user.id)
        result = await session.scalars(statement)
        listings = result.all()
        return listings


@router.get("/profile", tags=["profile"], response_model=UserResponse)
async def get_me(
      user: User = Depends(fastapi_users.current_user()),
):
      return {
            "id": user.id,
            "email": user.email,
            "is_verified": user.is_verified,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "is_superuser": user.is_superuser,
            "phone_number": user.phone_number,
            "profile_picture": user.profile_picture,
      }


@router.put("/profile", tags=["profile"], response_model=UserResponse)
async def update_me(
    user_update: CustomUserUpdate,
    user: User = Depends(fastapi_users.current_user()),
    session: AsyncSession = Depends(get_async_session)
):
    user: User | None = await session.get(User, user.id)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    for k, v in user_update.dict(exclude_unset=True).items():
        setattr(user, k, v)

    await session.commit()
    await session.refresh(user)

    return {
        "id": user.id,
        "email": user.email,
        "is_verified": user.is_verified,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "is_superuser": user.is_superuser,
        "phone_number": user.phone_number,
        "profile_picture": user.profile_picture,
    }