import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.dependencies.auth import get_current_user_id
from app.dependencies.roles import require_role
from app.schemas.assignment import AssignmentRead, AssignRequest, ReturnRequest
from app.services.assignment_service import AssignmentService

router = APIRouter(prefix="/assignments", tags=["Assignments"])


@router.post("/assign", response_model=AssignmentRead, status_code=201)
async def assign_inventory(
    data: AssignRequest,
    session: AsyncSession = Depends(get_session),
    user_id: uuid.UUID = Depends(require_role("ADMIN", "SUPPLY")),
):
    service = AssignmentService(session)
    return await service.assign(
        inventory_id=data.inventory_id,
        employee_id=data.employee_id,
        assigned_by=user_id,
    )


@router.post("/return", response_model=AssignmentRead)
async def return_inventory(
    data: ReturnRequest,
    session: AsyncSession = Depends(get_session),
    user_id: uuid.UUID = Depends(require_role("ADMIN", "SUPPLY")),
):
    service = AssignmentService(session)
    return await service.return_item(
        inventory_id=data.inventory_id,
        performed_by=user_id,
    )


@router.get("/history/{inventory_id}", response_model=list[AssignmentRead])
async def get_assignment_history(
    inventory_id: uuid.UUID,
    session: AsyncSession = Depends(get_session),
    _: uuid.UUID = Depends(get_current_user_id),
):
    service = AssignmentService(session)
    return await service.get_history(inventory_id)
