import uuid

from fastapi_users import schemas
from pydantic import field_validator


class UserRead(schemas.BaseUser[uuid.UUID]):
    pass


class UserCreate(schemas.BaseUserCreate):
    first_name: str | None = None
    last_name: str | None = None
    phone_number: str | None = None

    @field_validator("email")
    def valid_ufl_edmail(cls, v: str) -> str:
        if not v.endswith("@ufl.edu"):
            raise ValueError("Email must be a valid ufl.edu email address")
        return v

    pass


class UserUpdate(schemas.BaseUserUpdate):
    pass