import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.dependencies.auth import get_current_user_id
from app.dependencies.pagination import PaginationParams
from app.dependencies.roles import require_role
from app.schemas.supplier import SupplierCreate, SupplierRead, SupplierUpdate
from app.services.supplier_service import SupplierService

router = APIRouter(prefix="/suppliers", tags=["Suppliers"])


@router.get("", response_model=dict)
async def list_suppliers(
    pagination: PaginationParams = Depends(),
    session: AsyncSession = Depends(get_session),
    _: uuid.UUID = Depends(get_current_user_id),
):
    service = SupplierService(session)
    items, total = await service.list_suppliers(pagination.offset, pagination.limit)
    return {
        "items": items,
        "total": total,
        "page": pagination.page,
        "limit": pagination.limit,
    }


@router.post("", response_model=SupplierRead, status_code=201)
async def create_supplier(
    data: SupplierCreate,
    session: AsyncSession = Depends(get_session),
    user_id: uuid.UUID = Depends(require_role("ADMIN", "SUPPLY")),
):
    service = SupplierService(session)
    return await service.create_supplier(data, performed_by=user_id)


@router.patch("/{supplier_id}", response_model=SupplierRead)
async def update_supplier(
    supplier_id: uuid.UUID,
    data: SupplierUpdate,
    session: AsyncSession = Depends(get_session),
    user_id: uuid.UUID = Depends(require_role("ADMIN", "SUPPLY")),
):
    service = SupplierService(session)
    return await service.update_supplier(supplier_id, data, performed_by=user_id)


@router.delete("/{supplier_id}", status_code=204)
async def delete_supplier(
    supplier_id: uuid.UUID,
    session: AsyncSession = Depends(get_session),
    user_id: uuid.UUID = Depends(require_role("ADMIN")),
):
    service = SupplierService(session)
    await service.delete_supplier(supplier_id, performed_by=user_id)
