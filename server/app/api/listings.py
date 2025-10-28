from fastapi import APIRouter, Depends
from app.db.database import get_async_session
from typing import Annotated
from app.models.listing import Listing
from app.schemas.listing import ListingResponse
from sqlalchemy.ext.asyncio import AsyncSession
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