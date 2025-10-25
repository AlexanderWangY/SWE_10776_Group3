from fastapi import APIRouter, Depends
from app.db.database import engine, get_async_session
from typing import Annotated
from app.models.listing import Listing, ListingResponse
from sqlalchemy.ext.asyncio import (
    async_sessionmaker,
    create_async_engine,
    AsyncSession
)
from sqlalchemy import select

router = APIRouter()
        

@router.get("/listings", tags=["listings"], response_model=list[ListingResponse])
async def get_listings(
    async_session: AsyncSession = Depends(get_async_session),
):
    async with async_session as session:
        statement = select(Listing)
        result = await session.scalars(statement)
        return result