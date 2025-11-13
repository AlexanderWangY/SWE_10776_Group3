from fastapi import APIRouter, Depends, status, HTTPException
from app.auth.backend import fastapi_users, auth_backend
from app.db.database import get_async_session, AsyncSession
from app.schemas.user import UserRead, UserCreate, CustomUserUpdate, UserResponse
from app.models.user import get_user_manager, User
from fastapi_users.manager import BaseUserManager
from fastapi_users import exceptions, models
from fastapi.responses import RedirectResponse
from app.core.config import settings
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_async_session
from sqlalchemy import select

router = APIRouter()

router.include_router(
    fastapi_users.get_auth_router(auth_backend, requires_verification=True),
    prefix="/auth",
    tags=["auth"]
)

router.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
)

router.include_router(
    fastapi_users.get_verify_router(UserRead),
    prefix="/auth",
    tags=["auth"],
)

@router.get("/auth/verify-email",tags=["auth"])
async def verify_email(
    token: str,
    user_manager: BaseUserManager[models.UP, models.ID] = Depends(get_user_manager),
):
    """
    Endpoint to verify a user's email using the provided token.
    """
    try:
        user = await user_manager.verify(token)
        return RedirectResponse(url=f"{settings.frontend_url}/login?verified=True")
    except (exceptions.InvalidVerifyToken, exceptions.UserNotExists):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid token or user does not exist.",
            )
    except exceptions.UserAlreadyVerified:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User is already verified.",
            )


