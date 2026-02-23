import uuid
from datetime import datetime

from pydantic import BaseModel


class AssignRequest(BaseModel):
    inventory_id: uuid.UUID
    employee_id: uuid.UUID


class ReturnRequest(BaseModel):
    inventory_id: uuid.UUID


class AssignmentRead(BaseModel):
    id: uuid.UUID
    inventory_id: uuid.UUID
    employee_id: uuid.UUID
    assigned_at: datetime
    returned_at: datetime | None = None
    is_active: bool
    assigned_by: uuid.UUID | None = None

    model_config = {"from_attributes": True}
