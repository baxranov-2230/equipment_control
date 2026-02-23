import uuid

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.dependencies.auth import get_current_user_id
from app.dependencies.pagination import PaginationParams
from app.dependencies.roles import require_role
from app.schemas.inventory import (
    CategoryCreate,
    CategoryRead,
    InventoryCreate,
    InventoryRead,
    InventoryUpdate,
)
from app.services.inventory_service import InventoryService
from app.repositories.inventory_repo import InventoryRepository
from app.models.inventory_category import InventoryCategory

router = APIRouter(prefix="/inventories", tags=["Inventory"])


@router.get("", response_model=dict)
async def list_inventories(
    pagination: PaginationParams = Depends(),
    status: str | None = Query(None),
    employee_id: uuid.UUID | None = Query(None),
    search: str | None = Query(None),
    session: AsyncSession = Depends(get_session),
    _: uuid.UUID = Depends(get_current_user_id),
):
    service = InventoryService(session)
    items, total = await service.list_inventories(
        offset=pagination.offset,
        limit=pagination.limit,
        status=status,
        employee_id=employee_id,
        search=search,
    )
    return {
        "items": items,
        "total": total,
        "page": pagination.page,
        "limit": pagination.limit,
    }


@router.post("", response_model=InventoryRead, status_code=201)
async def create_inventory(
    data: InventoryCreate,
    session: AsyncSession = Depends(get_session),
    user_id: uuid.UUID = Depends(require_role("ADMIN", "SUPPLY")),
):
    service = InventoryService(session)
    return await service.create_inventory(data, created_by=user_id)


@router.get("/categories", response_model=list[CategoryRead])
async def list_categories(
    session: AsyncSession = Depends(get_session),
    _: uuid.UUID = Depends(get_current_user_id),
):
    repo = InventoryRepository(session)
    cats = await repo.list_categories()
    return [CategoryRead.model_validate(c) for c in cats]


@router.post("/categories", response_model=CategoryRead, status_code=201)
async def create_category(
    data: CategoryCreate,
    session: AsyncSession = Depends(get_session),
    _: uuid.UUID = Depends(require_role("ADMIN")),
):
    repo = InventoryRepository(session)
    cat = InventoryCategory(name=data.name, description=data.description)
    cat = await repo.create_category(cat)
    return CategoryRead.model_validate(cat)


@router.get("/{inventory_id}", response_model=InventoryRead)
async def get_inventory(
    inventory_id: uuid.UUID,
    session: AsyncSession = Depends(get_session),
    _: uuid.UUID = Depends(get_current_user_id),
):
    service = InventoryService(session)
    return await service.get_inventory(inventory_id)


@router.patch("/{inventory_id}", response_model=InventoryRead)
async def update_inventory(
    inventory_id: uuid.UUID,
    data: InventoryUpdate,
    session: AsyncSession = Depends(get_session),
    user_id: uuid.UUID = Depends(require_role("ADMIN", "SUPPLY")),
):
    service = InventoryService(session)
    return await service.update_inventory(inventory_id, data, performed_by=user_id)


@router.delete("/{inventory_id}", status_code=204)
async def delete_inventory(
    inventory_id: uuid.UUID,
    session: AsyncSession = Depends(get_session),
    user_id: uuid.UUID = Depends(require_role("ADMIN")),
):
    service = InventoryService(session)
    await service.delete_inventory(inventory_id, performed_by=user_id)
