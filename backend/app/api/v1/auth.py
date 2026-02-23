import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.dependencies.auth import get_current_user_id
from app.schemas.auth import (
    LoginRequest,
    RefreshRequest,
    TokenResponse,
    UserCreate,
    UserRead,
)
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login", response_model=TokenResponse)
async def login(
    data: LoginRequest,
    session: AsyncSession = Depends(get_session),
):
    service = AuthService(session)
    return await service.login(data)


@router.post("/refresh", response_model=TokenResponse)
async def refresh(
    data: RefreshRequest,
    session: AsyncSession = Depends(get_session),
):
    service = AuthService(session)
    return await service.refresh(data.refresh_token)


@router.get("/me", response_model=UserRead)
async def get_me(
    user_id: uuid.UUID = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_session),
):
    service = AuthService(session)
    return await service.get_me(user_id)


@router.post("/register", response_model=UserRead, status_code=201)
async def register(
    data: UserCreate,
    session: AsyncSession = Depends(get_session),
):
    service = AuthService(session)
    return await service.register(data)
