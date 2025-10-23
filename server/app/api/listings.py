from fastapi import APIRouter, Depends
from app.db.database import engine, get_async_session
from typing import Annotated
from app.models.listing import Listing
from sqlalchemy.ext.asyncio import (
    async_sessionmaker,
    create_async_engine,
    AsyncSession
)
from sqlalchemy import select

router = APIRouter()

def convert_listings(result):
    listing_list = []
    for listing in result:
        listing_list.append({
            "id": listing.id,
            "seller_id": listing.seller_id,
            "title": listing.title,
            "description": listing.description,
            "price_cents": listing.price_cents,
            "status": listing.status,
            "created_at": listing.created_at,
            "updated_at": listing.updated_at
        })
    return listing_list
        

@router.get("/listings", tags=["listings"])
async def get_listings(
    async_session: AsyncSession = Depends(get_async_session),
) -> list[dict]:
    async with async_session as session:
        statement = select(Listing)
        result = await session.scalars(statement)
        listing_list = convert_listings(result)
        return listing_list