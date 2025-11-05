from pydantic import BaseModel
from enum import Enum
from fastapi import Query

# Pagination tutorial: https://www.youtube.com/watch?v=Em6OzzcO9Xo

class SortEnum(Enum):
    ASC = "asc"
    DESC = "desc"

class Pagination(BaseModel):
    perPage: int
    page: int
    order: SortEnum

def pagination_params (
        page: int = Query(ge=1, required=False, default=1, le=500000),
        perPage: int = Query(ge=1, le=100, required=False, default=10),
        order: SortEnum = SortEnum.DESC
):
    return Pagination(perPage=perPage, page=page, order=order.value)