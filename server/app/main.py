from fastapi import FastAPI, Depends
from app.auth.routers import router as auth_router

app = FastAPI()
app.include_router(auth_router)