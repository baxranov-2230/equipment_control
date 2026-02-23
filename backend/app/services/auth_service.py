import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import BadRequestException, NotFoundException, UnauthorizedException
from app.core.security import create_access_token, create_refresh_token, decode_token, hash_password, verify_password
from app.models.user import User
from app.repositories.user_repo import UserRepository
from app.schemas.auth import LoginRequest, TokenResponse, UserCreate, UserRead


class AuthService:
    def __init__(self, session: AsyncSession):
        self.repo = UserRepository(session)

    async def login(self, data: LoginRequest) -> TokenResponse:
        user = await self.repo.get_by_username(data.username)
        if not user or not verify_password(data.password, user.password_hash):
            raise UnauthorizedException("Invalid username or password")
        if not user.is_active:
            raise UnauthorizedException("Account is deactivated")

        payload = {"sub": str(user.id), "role_id": str(user.role_id)}
        return TokenResponse(
            access_token=create_access_token(payload),
            refresh_token=create_refresh_token(payload),
        )

    async def refresh(self, refresh_token: str) -> TokenResponse:
        payload = decode_token(refresh_token)
        if not payload or payload.get("type") != "refresh":
            raise UnauthorizedException("Invalid refresh token")

        user = await self.repo.get_by_id(uuid.UUID(payload["sub"]))
        if not user or not user.is_active:
            raise UnauthorizedException("User not found or inactive")

        new_payload = {"sub": str(user.id), "role_id": str(user.role_id)}
        return TokenResponse(
            access_token=create_access_token(new_payload),
            refresh_token=create_refresh_token(new_payload),
        )

    async def register(self, data: UserCreate) -> UserRead:
        existing = await self.repo.get_by_username(data.username)
        if existing:
            raise BadRequestException("Username already exists")

        if data.role_id:
            role = await self.repo.get_role_by_id(data.role_id)
            if not role:
                raise NotFoundException("Role not found")
            role_id = role.id
        else:
            role = await self.repo.get_role_by_name("EMPLOYEE")
            if not role:
                raise NotFoundException("Default role EMPLOYEE not found")
            role_id = role.id

        user = User(
            full_name=data.full_name,
            username=data.username,
            password_hash=hash_password(data.password),
            role_id=role_id,
        )
        user = await self.repo.create(user)
        return UserRead.model_validate(user)

    async def get_me(self, user_id: uuid.UUID) -> UserRead:
        user = await self.repo.get_by_id(user_id)
        if not user:
            raise NotFoundException("User not found")
        return UserRead.model_validate(user)
