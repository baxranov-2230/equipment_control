import uuid

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.supplier import Supplier


class SupplierRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, supplier_id: uuid.UUID) -> Supplier | None:
        result = await self.session.execute(
            select(Supplier).where(Supplier.id == supplier_id)
        )
        return result.scalar_one_or_none()

    async def list_all(
        self, offset: int = 0, limit: int = 20
    ) -> tuple[list[Supplier], int]:
        count_q = select(func.count()).select_from(Supplier)
        total = (await self.session.execute(count_q)).scalar() or 0

        q = (
            select(Supplier)
            .offset(offset)
            .limit(limit)
            .order_by(Supplier.created_at.desc())
        )
        result = await self.session.execute(q)
        return list(result.scalars().all()), total

    async def create(self, supplier: Supplier) -> Supplier:
        self.session.add(supplier)
        await self.session.flush()
        return supplier

    async def update(self, supplier: Supplier, data: dict) -> Supplier:
        for key, value in data.items():
            if value is not None:
                setattr(supplier, key, value)
        await self.session.flush()
        return supplier

    async def delete(self, supplier: Supplier) -> None:
        await self.session.delete(supplier)
        await self.session.flush()
