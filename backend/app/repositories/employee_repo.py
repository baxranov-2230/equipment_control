import uuid

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.models.employee import Employee


class EmployeeRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, employee_id: uuid.UUID) -> Employee | None:
        result = await self.session.execute(
            select(Employee)
            .options(joinedload(Employee.user))
            .where(Employee.id == employee_id)
        )
        return result.scalar_one_or_none()

    async def get_by_user_id(self, user_id: uuid.UUID) -> Employee | None:
        result = await self.session.execute(
            select(Employee).where(Employee.user_id == user_id)
        )
        return result.scalar_one_or_none()

    async def list_all(
        self, offset: int = 0, limit: int = 20
    ) -> tuple[list[Employee], int]:
        # Count
        count_q = select(func.count()).select_from(Employee)
        total = (await self.session.execute(count_q)).scalar() or 0

        # Data
        q = (
            select(Employee)
            .options(joinedload(Employee.user))
            .offset(offset)
            .limit(limit)
            .order_by(Employee.created_at.desc())
        )
        result = await self.session.execute(q)
        return list(result.scalars().unique().all()), total

    async def create(self, employee: Employee) -> Employee:
        self.session.add(employee)
        await self.session.flush()
        return employee

    async def update(self, employee: Employee, data: dict) -> Employee:
        for key, value in data.items():
            if value is not None:
                setattr(employee, key, value)
        await self.session.flush()
        return employee

    async def delete(self, employee: Employee) -> None:
        await self.session.delete(employee)
        await self.session.flush()
