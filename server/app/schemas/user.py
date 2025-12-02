import uuid

from fastapi_users import schemas
from pydantic import field_validator, ConfigDict, BaseModel, computed_field
from app.core.config import settings


# Required for auth.py
class UserRead(schemas.BaseUser[uuid.UUID]):
    pass


class UserCreate(schemas.BaseUserCreate):
    """Pydantic model for creating a new user account, validates ufl.edu email."""
    first_name: str | None = None
    last_name: str | None = None
    phone_number: str | None = None

    @field_validator("email")
    def valid_ufl_edmail(cls, v: str) -> str:
        if not v.endswith("@ufl.edu"):
            raise ValueError("Email must be a valid ufl.edu email address")
        return v

    pass

class CustomUserUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    phone_number: str | None = None

    
class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    first_name: str | None
    last_name: str | None
    phone_number: str | None
    email: str
    is_superuser: bool
    is_verified: bool
    profile_picture: str | None
    is_banned: bool

    @computed_field
    @property
    def profile_picture_url(self) -> str | None:
        if self.profile_picture is None:
            return None

        return f"{settings.base_url}/static/{self.profile_picture}" # Source: https://github.com/fastapi/fastapi/discussions/9430/