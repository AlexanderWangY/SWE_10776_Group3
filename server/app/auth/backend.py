import uuid

from fastapi_users.authentication import CookieTransport
from fastapi_users.authentication import AuthenticationBackend
from fastapi_users import FastAPIUsers
from app.core.config import settings
from app.models.access_token import get_database_strategy
from app.models.user import User, get_user_manager

cookie_transport = CookieTransport(
    cookie_name="snickerdoodle",
    cookie_domain=settings.cookie_domain,
    cookie_secure=settings.cookie_secure
)

auth_backend = AuthenticationBackend(
    name="cookie",
    transport=cookie_transport,
    get_strategy=get_database_strategy
)

fastapi_users = FastAPIUsers[User, uuid.UUID](
    get_user_manager,
    [auth_backend],
)