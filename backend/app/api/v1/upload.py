import os
import uuid

import aiofiles
from fastapi import APIRouter, Depends, UploadFile, File

from app.core.config import get_settings
from app.core.exceptions import BadRequestException
from app.dependencies.auth import get_current_user_id

router = APIRouter(prefix="/upload", tags=["Upload"])

settings = get_settings()

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/gif", "image/webp"}


@router.post("")
async def upload_file(
    file: UploadFile = File(...),
    user_id: uuid.UUID = Depends(get_current_user_id),
):
    # Validate content type
    if file.content_type not in ALLOWED_TYPES:
        raise BadRequestException("Only image files (JPEG, PNG, GIF, WebP) are allowed")

    # Validate file size
    content = await file.read()
    if len(content) > settings.MAX_UPLOAD_SIZE:
        raise BadRequestException(f"File size exceeds {settings.MAX_UPLOAD_SIZE // (1024 * 1024)}MB limit")

    # Generate UUID filename
    ext = os.path.splitext(file.filename or "image.jpg")[1] or ".jpg"
    filename = f"{uuid.uuid4()}{ext}"
    filepath = os.path.join(settings.UPLOAD_DIR, filename)

    # Ensure upload directory exists
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

    # Save file
    async with aiofiles.open(filepath, "wb") as f:
        await f.write(content)

    return {
        "filename": filename,
        "url": f"/uploads/{filename}",
    }
