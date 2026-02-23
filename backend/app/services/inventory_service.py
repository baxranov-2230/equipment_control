import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import BadRequestException, ConflictException, NotFoundException
from app.models.inventory import Inventory
from app.repositories.assignment_repo import AssignmentRepository
from app.repositories.audit_log_repo import AuditLogRepository
from app.repositories.inventory_repo import InventoryRepository
from app.schemas.inventory import InventoryCreate, InventoryRead, InventoryUpdate


class InventoryService:
    def __init__(self, session: AsyncSession):
        self.repo = InventoryRepository(session)
        self.assignment_repo = AssignmentRepository(session)
        self.audit = AuditLogRepository(session)

    async def list_inventories(
        self,
        offset: int = 0,
        limit: int = 20,
        status: str | None = None,
        employee_id: uuid.UUID | None = None,
        search: str | None = None,
    ) -> tuple[list[InventoryRead], int]:
        items, total = await self.repo.list_all(
            offset=offset, limit=limit, status=status,
            employee_id=employee_id, search=search,
        )
        return [InventoryRead.model_validate(i) for i in items], total

    async def get_inventory(self, inventory_id: uuid.UUID) -> InventoryRead:
        item = await self.repo.get_by_id(inventory_id)
        if not item:
            raise NotFoundException("Inventory item not found")
        return InventoryRead.model_validate(item)

    async def create_inventory(
        self, data: InventoryCreate, created_by: uuid.UUID | None = None
    ) -> InventoryRead:
        # Check serial number uniqueness
        existing = await self.repo.get_by_serial(data.serial_number)
        if existing:
            raise ConflictException("Serial number already exists")

        item = Inventory(
            name=data.name,
            category_id=data.category_id,
            model=data.model,
            serial_number=data.serial_number,
            supplier_id=data.supplier_id,
            purchase_date=data.purchase_date,
            status=data.status.value,
            condition=data.condition.value,
            created_by=created_by,
        )
        item = await self.repo.create(item)

        await self.audit.create(
            entity_type="inventory",
            entity_id=item.id,
            action="CREATE",
            performed_by=created_by,
            new_value=data.model_dump(mode="json"),
        )
        return InventoryRead.model_validate(item)

    async def update_inventory(
        self,
        inventory_id: uuid.UUID,
        data: InventoryUpdate,
        performed_by: uuid.UUID | None = None,
    ) -> InventoryRead:
        item = await self.repo.get_by_id(inventory_id)
        if not item:
            raise NotFoundException("Inventory item not found")

        # Check serial number if updating
        if data.serial_number and data.serial_number != item.serial_number:
            existing = await self.repo.get_by_serial(data.serial_number)
            if existing:
                raise ConflictException("Serial number already exists")

        old_data = InventoryRead.model_validate(item).model_dump(mode="json")
        update_data = data.model_dump(exclude_unset=True)

        # Convert enums to strings
        if "status" in update_data and update_data["status"]:
            update_data["status"] = update_data["status"].value if hasattr(update_data["status"], "value") else update_data["status"]
        if "condition" in update_data and update_data["condition"]:
            update_data["condition"] = update_data["condition"].value if hasattr(update_data["condition"], "value") else update_data["condition"]

        item = await self.repo.update(item, update_data)

        await self.audit.create(
            entity_type="inventory",
            entity_id=item.id,
            action="UPDATE",
            performed_by=performed_by,
            old_value=old_data,
            new_value=update_data,
        )
        return InventoryRead.model_validate(item)

    async def delete_inventory(
        self, inventory_id: uuid.UUID, performed_by: uuid.UUID | None = None
    ) -> None:
        item = await self.repo.get_by_id(inventory_id)
        if not item:
            raise NotFoundException("Inventory item not found")

        # Business rule: cannot delete if active assignment exists
        active = await self.assignment_repo.get_active_by_inventory(inventory_id)
        if active:
            raise BadRequestException(
                "Cannot delete inventory with active assignment. Return the item first."
            )

        await self.audit.create(
            entity_type="inventory",
            entity_id=item.id,
            action="DELETE",
            performed_by=performed_by,
            old_value=InventoryRead.model_validate(item).model_dump(mode="json"),
        )
        await self.repo.delete(item)
