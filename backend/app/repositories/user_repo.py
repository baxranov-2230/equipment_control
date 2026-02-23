import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.models.role import Role


class UserRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, user_id: uuid.UUID) -> User | None:
        result = await self.session.execute(
            select(User).where(User.id == user_id)
        )
        return result.scalar_one_or_none()

    async def get_by_username(self, username: str) -> User | None:
        result = await self.session.execute(
            select(User).where(User.username == username)
        )
        return result.scalar_one_or_none()

    async def create(self, user: User) -> User:
        self.session.add(user)
        await self.session.flush()
        return user

    async def get_role_by_name(self, name: str) -> Role | None:
        result = await self.session.execute(
            select(Role).where(Role.name == name)
        )
        return result.scalar_one_or_none()

    async def get_role_by_id(self, role_id: uuid.UUID) -> Role | None:
        result = await self.session.execute(
            select(Role).where(Role.id == role_id)
        )
        return result.scalar_one_or_none()

    async def list_roles(self) -> list[Role]:
        result = await self.session.execute(select(Role))
        return list(result.scalars().all())

    async def create_role(self, role: Role) -> Role:
        self.session.add(role)
        await self.session.flush()
        return role
