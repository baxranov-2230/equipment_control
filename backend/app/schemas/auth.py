import uuid
from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field


# ── Enums ─────────────────────────────────────────────────

class RoleName(str, Enum):
    ADMIN = "ADMIN"
    SUPPLY = "SUPPLY"
    EMPLOYEE = "EMPLOYEE"


# ── Auth Schemas ──────────────────────────────────────────

class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    refresh_token: str


class UserCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=255)
    username: str = Field(min_length=3, max_length=100)
    password: str = Field(min_length=6)
    role_id: uuid.UUID | None = None


class UserRead(BaseModel):
    id: uuid.UUID
    full_name: str
    username: str
    role_id: uuid.UUID
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class UserReadWithRole(UserRead):
    role: "RoleRead | None" = None


class RoleRead(BaseModel):
    id: uuid.UUID
    name: str
    description: str | None = None

    model_config = {"from_attributes": True}


# Rebuild forward refs
UserReadWithRole.model_rebuild()
