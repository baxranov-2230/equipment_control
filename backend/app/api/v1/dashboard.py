import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.dependencies.auth import get_current_user_id
from app.schemas.dashboard import DashboardStats
from app.services.dashboard_service import DashboardService

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats", response_model=DashboardStats)
async def get_stats(
    session: AsyncSession = Depends(get_session),
    _: uuid.UUID = Depends(get_current_user_id),
):
    service = DashboardService(session)
    return await service.get_stats()
