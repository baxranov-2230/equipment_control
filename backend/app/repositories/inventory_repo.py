import uuid

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.models.inventory import Inventory
from app.models.inventory_category import InventoryCategory


class InventoryRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, inventory_id: uuid.UUID) -> Inventory | None:
        result = await self.session.execute(
            select(Inventory)
            .options(
                joinedload(Inventory.category),
                joinedload(Inventory.supplier),
            )
            .where(Inventory.id == inventory_id)
        )
        return result.scalar_one_or_none()

    async def get_by_serial(self, serial_number: str) -> Inventory | None:
        result = await self.session.execute(
            select(Inventory).where(Inventory.serial_number == serial_number)
        )
        return result.scalar_one_or_none()

    async def list_all(
        self,
        offset: int = 0,
        limit: int = 20,
        status: str | None = None,
        employee_id: uuid.UUID | None = None,
        search: str | None = None,
    ) -> tuple[list[Inventory], int]:
        base = select(Inventory)
        count_base = select(func.count()).select_from(Inventory)

        # Filters
        if status:
            base = base.where(Inventory.status == status)
            count_base = count_base.where(Inventory.status == status)
        if search:
            pattern = f"%{search}%"
            search_filter = or_(
                Inventory.name.ilike(pattern),
                Inventory.serial_number.ilike(pattern),
                Inventory.model.ilike(pattern),
            )
            base = base.where(search_filter)
            count_base = count_base.where(search_filter)

        total = (await self.session.execute(count_base)).scalar() or 0

        q = (
            base.options(
                joinedload(Inventory.category),
                joinedload(Inventory.supplier),
            )
            .offset(offset)
            .limit(limit)
            .order_by(Inventory.created_at.desc())
        )
        result = await self.session.execute(q)
        return list(result.scalars().unique().all()), total

    async def create(self, inventory: Inventory) -> Inventory:
        self.session.add(inventory)
        await self.session.flush()
        return inventory

    async def update(self, inventory: Inventory, data: dict) -> Inventory:
        for key, value in data.items():
            if value is not None:
                setattr(inventory, key, value)
        await self.session.flush()
        return inventory

    async def delete(self, inventory: Inventory) -> None:
        await self.session.delete(inventory)
        await self.session.flush()

    # ── Categories ──

    async def get_category_by_id(self, cat_id: uuid.UUID) -> InventoryCategory | None:
        result = await self.session.execute(
            select(InventoryCategory).where(InventoryCategory.id == cat_id)
        )
        return result.scalar_one_or_none()

    async def list_categories(self) -> list[InventoryCategory]:
        result = await self.session.execute(select(InventoryCategory))
        return list(result.scalars().all())

    async def create_category(self, cat: InventoryCategory) -> InventoryCategory:
        self.session.add(cat)
        await self.session.flush()
        return cat

    # ── Stats ──

    async def count_by_status(self, status: str) -> int:
        result = await self.session.execute(
            select(func.count()).select_from(Inventory).where(Inventory.status == status)
        )
        return result.scalar() or 0

    async def count_total(self) -> int:
        result = await self.session.execute(
            select(func.count()).select_from(Inventory)
        )
        return result.scalar() or 0
