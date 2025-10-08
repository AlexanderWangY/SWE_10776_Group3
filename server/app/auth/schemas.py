import uuid

from fastapi_users import schemas
from pydantic import field_validator

class UserCreate(schemas.BaseUserCreate):
    first_name: str
    last_name: str

    # verify that the email is a valid @ufl.edu address
    @field_validator("email")
    @classmethod
    def ufl_email_validator(cls, v):
        if not v.endswith("@ufl.edu"):
            raise ValueError("Email must be a valid @ufl.edu address")
        return v

class UserRead(schemas.BaseUser[uuid.UUID]):
    pass

class UserUpdate(schemas.BaseUserUpdate):
    first_name: str | None
    last_name: str | None
    phone_number: str | None