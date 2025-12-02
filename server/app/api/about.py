from fastapi import APIRouter
from app.core.config import settings

router = APIRouter()

IMAGE_BASE_URL = f"{settings.base_url}/static/images/about"

@router.get("/about", tags=["about"])
async def get_about_images():
    """
    Serves images for the About Us page.
    """
    return {
        "Anders": f"{IMAGE_BASE_URL}/anders.jpg",
        "Alex": f"{IMAGE_BASE_URL}/alex.jpg",
        "Evelyn": f"{IMAGE_BASE_URL}/evelyn.jpg",
        "Kali": f"{IMAGE_BASE_URL}/kali.jpg"
    }