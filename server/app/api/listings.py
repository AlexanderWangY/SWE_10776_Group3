from fastapi import APIRouter, Depends
from app.db.database import engine, get_async_session
from typing import Annotated
from app.models.listing import Listing, ListingResponse
from app.models.user import User
from sqlalchemy.ext.asyncio import (
    async_sessionmaker,
    create_async_engine,
    AsyncSession
)
from sqlalchemy import select
from sqlalchemy.orm import selectinload

router = APIRouter()

# https://stackoverflow.com/questions/74941021/using-sqlalchemy-what-is-a-good-way-to-load-related-object-that-are-were-not-ea
@router.get("/listings", tags=["listings"], response_model=list[ListingResponse])
async def get_listings(
    async_session: AsyncSession = Depends(get_async_session),
):
    async with async_session as session:
        statement = select(Listing).options(selectinload(Listing.seller))
        result = await session.scalars(statement)
        listings = result.all()
        return listings