import uuid
from datetime import date, datetime
from enum import Enum

from pydantic import BaseModel, Field


class InventoryStatus(str, Enum):
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"
    DAMAGED = "DAMAGED"
    OBSOLETE = "OBSOLETE"


class InventoryCondition(str, Enum):
    NEW = "NEW"
    GOOD = "GOOD"
    USED = "USED"
    OLD = "OLD"
    BROKEN = "BROKEN"


class CategoryCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    description: str | None = None


class CategoryRead(BaseModel):
    id: uuid.UUID
    name: str
    description: str | None = None

    model_config = {"from_attributes": True}


class InventoryCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    category_id: uuid.UUID | None = None
    model: str | None = None
    serial_number: str = Field(min_length=1, max_length=255)
    supplier_id: uuid.UUID | None = None
    purchase_date: date | None = None
    status: InventoryStatus = InventoryStatus.ACTIVE
    condition: InventoryCondition = InventoryCondition.NEW


class InventoryUpdate(BaseModel):
    name: str | None = None
    category_id: uuid.UUID | None = None
    model: str | None = None
    serial_number: str | None = None
    supplier_id: uuid.UUID | None = None
    purchase_date: date | None = None
    status: InventoryStatus | None = None
    condition: InventoryCondition | None = None


class InventoryRead(BaseModel):
    id: uuid.UUID
    name: str
    category_id: uuid.UUID | None = None
    model: str | None = None
    serial_number: str
    supplier_id: uuid.UUID | None = None
    purchase_date: date | None = None
    status: str
    condition: str
    created_by: uuid.UUID | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


class InventoryReadFull(InventoryRead):
    category: CategoryRead | None = None
    supplier: "SupplierBrief | None" = None


class SupplierBrief(BaseModel):
    id: uuid.UUID
    name: str

    model_config = {"from_attributes": True}


InventoryReadFull.model_rebuild()
