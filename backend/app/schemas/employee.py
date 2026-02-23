import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class EmployeeCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=255)
    username: str = Field(min_length=3, max_length=100)
    password: str = Field(min_length=6)
    department: str = Field(min_length=1, max_length=255)
    position: str = Field(min_length=1, max_length=255)
    phone: str | None = None
    status: str = "ACTIVE"


class EmployeeUpdate(BaseModel):
    department: str | None = None
    position: str | None = None
    phone: str | None = None
    status: str | None = None


class EmployeeRead(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    department: str
    position: str
    phone: str | None = None
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class EmployeeReadWithUser(EmployeeRead):
    user: "UserBrief | None" = None


class UserBrief(BaseModel):
    id: uuid.UUID
    full_name: str
    username: str

    model_config = {"from_attributes": True}


EmployeeReadWithUser.model_rebuild()
