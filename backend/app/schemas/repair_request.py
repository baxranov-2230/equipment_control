import uuid
from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field


class RepairPriority(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    URGENT = "URGENT"


class RepairStatus(str, Enum):
    NEW = "NEW"
    IN_PROGRESS = "IN_PROGRESS"
    FIXED = "FIXED"
    REJECTED = "REJECTED"


class RepairRequestCreate(BaseModel):
    inventory_id: uuid.UUID
    title: str = Field(min_length=1, max_length=255)
    description: str | None = None
    priority: RepairPriority = RepairPriority.MEDIUM
    image_url: str | None = None


class RepairRequestUpdateStatus(BaseModel):
    status: RepairStatus


class RepairRequestRead(BaseModel):
    id: uuid.UUID
    inventory_id: uuid.UUID
    employee_id: uuid.UUID
    title: str
    description: str | None = None
    priority: str
    status: str
    image_url: str | None = None
    created_at: datetime

    model_config = {"from_attributes": True}
