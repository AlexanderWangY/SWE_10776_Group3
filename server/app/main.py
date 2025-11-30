from fastapi import FastAPI, HTTPException, Request
from app.api.auth import router as auth_router
from app.api.listings import router as listings_router
from app.api.profile import router as profile_router
from app.api.admin import router as admin_router
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse, JSONResponse

origins = [settings.base_url, settings.frontend_url]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins.extend(
        ["https://www.gatormarket.com", "https://gatormarket.com"]
    ),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(listings_router)
app.include_router(profile_router)
app.include_router(admin_router)


@app.get("/")
async def read_root():
    return {"message": "Welcome to the FastAPI application!"}


app.mount("/static", StaticFiles(directory="app/static"), name="static")
# @app.exception_handler(HTTPException)
# async def auth_http_handler(request: Request, exc: HTTPException):
#     if exc.status_code == 400:
#         if exc.detail == "User is already verified.":
#             return RedirectResponse(url=f"{settings.frontend_url}/login?verified=True")
#         elif exc.detail == "Invalid token or user does not exist.":
#             return RedirectResponse(url=f"{settings.frontend_url}/register")
#     elif exc.status_code == 401:
#         return RedirectResponse(url=f"{settings.frontend_url}/login")
#     return JSONResponse(
#         status_code=exc.status_code,
#         content={"message": exc.detail},
#     )
