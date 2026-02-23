import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class SupplierCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    phone: str | None = None
    address: str | None = None
    contact_person: str | None = None


class SupplierUpdate(BaseModel):
    name: str | None = None
    phone: str | None = None
    address: str | None = None
    contact_person: str | None = None


class SupplierRead(BaseModel):
    id: uuid.UUID
    name: str
    phone: str | None = None
    address: str | None = None
    contact_person: str | None = None
    created_at: datetime

    model_config = {"from_attributes": True}
