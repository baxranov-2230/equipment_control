import uuid

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.repair_request import RepairRequest


class RepairRequestRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, rr_id: uuid.UUID) -> RepairRequest | None:
        result = await self.session.execute(
            select(RepairRequest).where(RepairRequest.id == rr_id)
        )
        return result.scalar_one_or_none()

    async def list_all(
        self, offset: int = 0, limit: int = 20
    ) -> tuple[list[RepairRequest], int]:
        count_q = select(func.count()).select_from(RepairRequest)
        total = (await self.session.execute(count_q)).scalar() or 0

        q = (
            select(RepairRequest)
            .offset(offset)
            .limit(limit)
            .order_by(RepairRequest.created_at.desc())
        )
        result = await self.session.execute(q)
        return list(result.scalars().all()), total

    async def list_by_employee(
        self, employee_id: uuid.UUID, offset: int = 0, limit: int = 20
    ) -> tuple[list[RepairRequest], int]:
        count_q = (
            select(func.count())
            .select_from(RepairRequest)
            .where(RepairRequest.employee_id == employee_id)
        )
        total = (await self.session.execute(count_q)).scalar() or 0

        q = (
            select(RepairRequest)
            .where(RepairRequest.employee_id == employee_id)
            .offset(offset)
            .limit(limit)
            .order_by(RepairRequest.created_at.desc())
        )
        result = await self.session.execute(q)
        return list(result.scalars().all()), total

    async def create(self, rr: RepairRequest) -> RepairRequest:
        self.session.add(rr)
        await self.session.flush()
        return rr

    async def update_status(self, rr: RepairRequest, status: str) -> RepairRequest:
        rr.status = status
        await self.session.flush()
        return rr

    async def count_open(self) -> int:
        result = await self.session.execute(
            select(func.count())
            .select_from(RepairRequest)
            .where(RepairRequest.status.in_(["NEW", "IN_PROGRESS"]))
        )
        return result.scalar() or 0
