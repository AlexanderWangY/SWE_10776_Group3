from fastapi import FastAPI
from app.api.auth import router as auth_router
from app.api.listings import router as listings_router
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

origins = [
    settings.base_url,
    settings.frontend_url
]

app = FastAPI()

app.include_router(auth_router)
app.include_router(listings_router)
app.add_middleware(
  CORSMiddleware,
  allow_origins = origins,
  allow_credentials = True,
  allow_methods = ["*"],
  allow_headers = ["*"]
)

@app.get("/")
async def read_root():
    return {"message": "Welcome to the FastAPI application!"}
