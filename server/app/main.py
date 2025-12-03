from fastapi import FastAPI
from app.api.auth import router as auth_router
from app.api.listings import router as listings_router
from app.api.profile import router as profile_router
from app.api.admin import router as admin_router
from app.api.about import router as about_router
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from fastapi.staticfiles import StaticFiles

origins = [settings.base_url, settings.frontend_url]
allow_origins = origins + [
    "https://www.gatormarket.com",
    "https://gatormarket.com"
]

app = FastAPI()

# Setting up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(listings_router)
app.include_router(profile_router)
app.include_router(admin_router)
app.include_router(about_router)


@app.get("/")
async def read_root():
    return {"message": "Welcome to the FastAPI application!"}

# For serving files on the web app, like profile and listing images.
app.mount("/static", StaticFiles(directory="app/static"), name="static")