import uuid

from fastapi_users.authentication import (
    CookieTransport, 
    AuthenticationBackend
)
from .models import get_database_strategy
from app.users.models import User, get_user_manager
from fastapi_users import FastAPIUsers

cookie_transport = CookieTransport(cookie_max_age=3600)

auth_backend = AuthenticationBackend(
    name="snickerdoodle",
    transport=cookie_transport,
    get_strategy=get_database_strategy()
)

fastapi_users = FastAPIUsers[User, uuid.UUID](
    get_user_manager,
    [auth_backend]
)
