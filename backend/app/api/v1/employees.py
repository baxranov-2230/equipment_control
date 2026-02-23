import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.dependencies.auth import get_current_user_id
from app.dependencies.pagination import PaginationParams
from app.dependencies.roles import require_role
from app.schemas.employee import EmployeeCreate, EmployeeRead, EmployeeUpdate
from app.services.employee_service import EmployeeService

router = APIRouter(prefix="/employees", tags=["Employees"])


@router.get("", response_model=dict)
async def list_employees(
    pagination: PaginationParams = Depends(),
    session: AsyncSession = Depends(get_session),
    _: uuid.UUID = Depends(get_current_user_id),
):
    service = EmployeeService(session)
    items, total = await service.list_employees(pagination.offset, pagination.limit)
    return {
        "items": items,
        "total": total,
        "page": pagination.page,
        "limit": pagination.limit,
    }


@router.post("", response_model=EmployeeRead, status_code=201)
async def create_employee(
    data: EmployeeCreate,
    session: AsyncSession = Depends(get_session),
    user_id: uuid.UUID = Depends(require_role("ADMIN")),
):
    service = EmployeeService(session)
    return await service.create_employee(data, performed_by=user_id)


@router.get("/{employee_id}", response_model=EmployeeRead)
async def get_employee(
    employee_id: uuid.UUID,
    session: AsyncSession = Depends(get_session),
    _: uuid.UUID = Depends(get_current_user_id),
):
    service = EmployeeService(session)
    return await service.get_employee(employee_id)


@router.patch("/{employee_id}", response_model=EmployeeRead)
async def update_employee(
    employee_id: uuid.UUID,
    data: EmployeeUpdate,
    session: AsyncSession = Depends(get_session),
    user_id: uuid.UUID = Depends(require_role("ADMIN")),
):
    service = EmployeeService(session)
    return await service.update_employee(employee_id, data, performed_by=user_id)


@router.delete("/{employee_id}", status_code=204)
async def delete_employee(
    employee_id: uuid.UUID,
    session: AsyncSession = Depends(get_session),
    user_id: uuid.UUID = Depends(require_role("ADMIN")),
):
    service = EmployeeService(session)
    await service.delete_employee(employee_id, performed_by=user_id)
