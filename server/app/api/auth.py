from fastapi import APIRouter, Depends, HTTPException, status
from app.auth.backend import fastapi_users, auth_backend
from app.schemas.user import UserRead, UserCreate
from app.models.user import get_user_manager, User
from fastapi_users.manager import BaseUserManager
from fastapi_users import exceptions, models

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
        return {"message": "Email verified successfully"}
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
    
@router.get("/protected-route", tags=["auth"])
async def protected_route(
      user: User = Depends(fastapi_users.current_user())
):
    print(user.hashed_password)
    return {"message": f"Hello, {user.email}. You have accessed a protected route!"}
      
      