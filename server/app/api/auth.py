from fastapi import APIRouter, Depends, status, HTTPException
from app.auth.backend import fastapi_users, auth_backend
from app.schemas.user import UserRead, UserCreate
from app.models.user import get_user_manager
from fastapi_users.manager import BaseUserManager
from fastapi_users import exceptions, models
from fastapi.responses import RedirectResponse
from app.core.config import settings
from urllib.parse import quote
from pydantic import BaseModel

# Set up auth routers

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

class VerifyEmailBody(BaseModel):
      """
      Pydantic Model for the email verification request body (token)
      """
      token: str

@router.get("/auth/verify-email",tags=["auth"])
async def verify_email_get(
    token: str,
):
    """
    Redirect to frontend verification page carrying token.
    Does not perform verification.
    """
    url = f"{settings.frontend_url}/verify-email?token={quote(token, safe='')}"
    return RedirectResponse(url=url)
    
@router.post("/auth/verify-email",tags=["auth"])
async def verify_email_post(
    body: VerifyEmailBody,
    user_manager: BaseUserManager[models.UP, models.ID] = Depends(get_user_manager),
):
    """
    Endpoint to verify a user's email using the provided token.
    """
    try:
        await user_manager.verify(body.token)
        return {RedirectResponse(url=f"{settings.frontend_url}/login?verified=True")}
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


