import uuid
from typing import Callable

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.exceptions import ForbiddenException
from app.dependencies.auth import get_current_user_id
from app.repositories.user_repo import UserRepository


def require_role(*allowed_roles: str) -> Callable:
    async def role_checker(
        user_id: uuid.UUID = Depends(get_current_user_id),
        session: AsyncSession = Depends(get_session),
    ) -> uuid.UUID:
        repo = UserRepository(session)
        user = await repo.get_by_id(user_id)
        if not user:
            raise ForbiddenException("User not found")

        role = await repo.get_role_by_id(user.role_id)
        if not role or role.name not in allowed_roles:
            raise ForbiddenException("Insufficient permissions")

        return user_id

    return role_checker
