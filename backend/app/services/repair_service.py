import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundException
from app.models.repair_request import RepairRequest
from app.repositories.audit_log_repo import AuditLogRepository
from app.repositories.inventory_repo import InventoryRepository
from app.repositories.repair_request_repo import RepairRequestRepository
from app.schemas.repair_request import RepairRequestCreate, RepairRequestRead


class RepairService:
    def __init__(self, session: AsyncSession):
        self.repo = RepairRequestRepository(session)
        self.inventory_repo = InventoryRepository(session)
        self.audit = AuditLogRepository(session)

    async def list_requests(
        self, offset: int = 0, limit: int = 20
    ) -> tuple[list[RepairRequestRead], int]:
        items, total = await self.repo.list_all(offset, limit)
        return [RepairRequestRead.model_validate(r) for r in items], total

    async def list_my_requests(
        self, employee_id: uuid.UUID, offset: int = 0, limit: int = 20
    ) -> tuple[list[RepairRequestRead], int]:
        items, total = await self.repo.list_by_employee(employee_id, offset, limit)
        return [RepairRequestRead.model_validate(r) for r in items], total

    async def create_request(
        self,
        data: RepairRequestCreate,
        employee_id: uuid.UUID,
        performed_by: uuid.UUID | None = None,
    ) -> RepairRequestRead:
        # Check inventory exists
        item = await self.inventory_repo.get_by_id(data.inventory_id)
        if not item:
            raise NotFoundException("Inventory item not found")

        rr = RepairRequest(
            inventory_id=data.inventory_id,
            employee_id=employee_id,
            title=data.title,
            description=data.description,
            priority=data.priority.value,
            image_url=data.image_url,
        )
        rr = await self.repo.create(rr)

        # Business rule: set inventory status to DAMAGED
        await self.inventory_repo.update(item, {"status": "DAMAGED"})

        await self.audit.create(
            entity_type="repair_request",
            entity_id=rr.id,
            action="CREATE",
            performed_by=performed_by,
            new_value=data.model_dump(mode="json"),
        )
        return RepairRequestRead.model_validate(rr)

    async def update_status(
        self,
        rr_id: uuid.UUID,
        status: str,
        performed_by: uuid.UUID | None = None,
    ) -> RepairRequestRead:
        rr = await self.repo.get_by_id(rr_id)
        if not rr:
            raise NotFoundException("Repair request not found")

        old_status = rr.status
        rr = await self.repo.update_status(rr, status)

        # If fixed, restore inventory status to ACTIVE
        if status == "FIXED":
            item = await self.inventory_repo.get_by_id(rr.inventory_id)
            if item:
                await self.inventory_repo.update(item, {"status": "ACTIVE"})

        await self.audit.create(
            entity_type="repair_request",
            entity_id=rr.id,
            action="STATUS_CHANGE",
            performed_by=performed_by,
            old_value={"status": old_status},
            new_value={"status": status},
        )
        return RepairRequestRead.model_validate(rr)
