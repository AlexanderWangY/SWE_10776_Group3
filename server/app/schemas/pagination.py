from pydantic import BaseModel
from enum import Enum
from fastapi import Query

# Pagination tutorial: https://www.youtube.com/watch?v=Em6OzzcO9Xo

class SortEnum(Enum):
    """Enum for sorting order in pagination."""
    ASC = "asc"
    DESC = "desc"

class Pagination(BaseModel):
    """Pydantic model for pagination query parameters."""
    page_num: int
    card_num: int

def pagination_params (
        page_num: int = Query(ge=1, required=False, default=1, le=500000),
        card_num: int = Query(ge=1, le=100, required=False, default=10),
):
    return Pagination(page_num=page_num, card_num=card_num)