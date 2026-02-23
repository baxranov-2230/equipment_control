import uuid
from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.assignment import Assignment


class AssignmentRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_active_by_inventory(
        self, inventory_id: uuid.UUID
    ) -> Assignment | None:
        result = await self.session.execute(
            select(Assignment).where(
                Assignment.inventory_id == inventory_id,
                Assignment.is_active.is_(True),
            )
        )
        return result.scalar_one_or_none()

    async def get_history_by_inventory(
        self, inventory_id: uuid.UUID
    ) -> list[Assignment]:
        result = await self.session.execute(
            select(Assignment)
            .where(Assignment.inventory_id == inventory_id)
            .order_by(Assignment.assigned_at.desc())
        )
        return list(result.scalars().all())

    async def create(self, assignment: Assignment) -> Assignment:
        self.session.add(assignment)
        await self.session.flush()
        return assignment

    async def deactivate(self, assignment: Assignment) -> Assignment:
        assignment.is_active = False
        assignment.returned_at = datetime.now(timezone.utc)
        await self.session.flush()
        return assignment
