import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.dependencies.auth import get_current_user_id
from app.dependencies.pagination import PaginationParams
from app.dependencies.roles import require_role
from app.repositories.employee_repo import EmployeeRepository
from app.core.exceptions import NotFoundException
from app.schemas.repair_request import (
    RepairRequestCreate,
    RepairRequestRead,
    RepairRequestUpdateStatus,
)
from app.services.repair_service import RepairService

router = APIRouter(prefix="/repair-requests", tags=["Repair Requests"])


@router.get("", response_model=dict)
async def list_requests(
    pagination: PaginationParams = Depends(),
    session: AsyncSession = Depends(get_session),
    _: uuid.UUID = Depends(get_current_user_id),
):
    service = RepairService(session)
    items, total = await service.list_requests(pagination.offset, pagination.limit)
    return {
        "items": items,
        "total": total,
        "page": pagination.page,
        "limit": pagination.limit,
    }


@router.post("", response_model=RepairRequestRead, status_code=201)
async def create_request(
    data: RepairRequestCreate,
    session: AsyncSession = Depends(get_session),
    user_id: uuid.UUID = Depends(get_current_user_id),
):
    # Find employee by user_id
    emp_repo = EmployeeRepository(session)
    employee = await emp_repo.get_by_user_id(user_id)
    if not employee:
        raise NotFoundException("Employee profile not found for current user")

    service = RepairService(session)
    return await service.create_request(
        data, employee_id=employee.id, performed_by=user_id
    )


@router.patch("/{request_id}/status", response_model=RepairRequestRead)
async def update_request_status(
    request_id: uuid.UUID,
    data: RepairRequestUpdateStatus,
    session: AsyncSession = Depends(get_session),
    user_id: uuid.UUID = Depends(require_role("ADMIN", "SUPPLY")),
):
    service = RepairService(session)
    return await service.update_status(request_id, data.status.value, performed_by=user_id)


@router.get("/my", response_model=dict)
async def list_my_requests(
    pagination: PaginationParams = Depends(),
    session: AsyncSession = Depends(get_session),
    user_id: uuid.UUID = Depends(get_current_user_id),
):
    emp_repo = EmployeeRepository(session)
    employee = await emp_repo.get_by_user_id(user_id)
    if not employee:
        raise NotFoundException("Employee profile not found for current user")

    service = RepairService(session)
    items, total = await service.list_my_requests(
        employee.id, pagination.offset, pagination.limit
    )
    return {
        "items": items,
        "total": total,
        "page": pagination.page,
        "limit": pagination.limit,
    }
