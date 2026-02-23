import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import BadRequestException, NotFoundException
from app.models.assignment import Assignment
from app.repositories.assignment_repo import AssignmentRepository
from app.repositories.audit_log_repo import AuditLogRepository
from app.repositories.inventory_repo import InventoryRepository
from app.schemas.assignment import AssignmentRead


class AssignmentService:
    def __init__(self, session: AsyncSession):
        self.repo = AssignmentRepository(session)
        self.inventory_repo = InventoryRepository(session)
        self.audit = AuditLogRepository(session)

    async def assign(
        self,
        inventory_id: uuid.UUID,
        employee_id: uuid.UUID,
        assigned_by: uuid.UUID | None = None,
    ) -> AssignmentRead:
        # Check inventory exists
        item = await self.inventory_repo.get_by_id(inventory_id)
        if not item:
            raise NotFoundException("Inventory item not found")

        # Deactivate existing active assignment
        active = await self.repo.get_active_by_inventory(inventory_id)
        if active:
            await self.repo.deactivate(active)
            await self.audit.create(
                entity_type="assignment",
                entity_id=active.id,
                action="RETURN",
                performed_by=assigned_by,
            )

        # Create new assignment
        assignment = Assignment(
            inventory_id=inventory_id,
            employee_id=employee_id,
            assigned_by=assigned_by,
        )
        assignment = await self.repo.create(assignment)

        await self.audit.create(
            entity_type="assignment",
            entity_id=assignment.id,
            action="ASSIGN",
            performed_by=assigned_by,
            new_value={
                "inventory_id": str(inventory_id),
                "employee_id": str(employee_id),
            },
        )
        return AssignmentRead.model_validate(assignment)

    async def return_item(
        self,
        inventory_id: uuid.UUID,
        performed_by: uuid.UUID | None = None,
    ) -> AssignmentRead:
        active = await self.repo.get_active_by_inventory(inventory_id)
        if not active:
            raise BadRequestException("No active assignment for this inventory")

        active = await self.repo.deactivate(active)

        await self.audit.create(
            entity_type="assignment",
            entity_id=active.id,
            action="RETURN",
            performed_by=performed_by,
        )
        return AssignmentRead.model_validate(active)

    async def get_history(self, inventory_id: uuid.UUID) -> list[AssignmentRead]:
        assignments = await self.repo.get_history_by_inventory(inventory_id)
        return [AssignmentRead.model_validate(a) for a in assignments]
