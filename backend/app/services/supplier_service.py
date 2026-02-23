import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundException
from app.models.supplier import Supplier
from app.repositories.audit_log_repo import AuditLogRepository
from app.repositories.supplier_repo import SupplierRepository
from app.schemas.supplier import SupplierCreate, SupplierRead, SupplierUpdate


class SupplierService:
    def __init__(self, session: AsyncSession):
        self.repo = SupplierRepository(session)
        self.audit = AuditLogRepository(session)

    async def list_suppliers(
        self, offset: int = 0, limit: int = 20
    ) -> tuple[list[SupplierRead], int]:
        suppliers, total = await self.repo.list_all(offset, limit)
        return [SupplierRead.model_validate(s) for s in suppliers], total

    async def get_supplier(self, supplier_id: uuid.UUID) -> SupplierRead:
        sup = await self.repo.get_by_id(supplier_id)
        if not sup:
            raise NotFoundException("Supplier not found")
        return SupplierRead.model_validate(sup)

    async def create_supplier(
        self, data: SupplierCreate, performed_by: uuid.UUID | None = None
    ) -> SupplierRead:
        sup = Supplier(
            name=data.name,
            phone=data.phone,
            address=data.address,
            contact_person=data.contact_person,
        )
        sup = await self.repo.create(sup)
        await self.audit.create(
            entity_type="supplier",
            entity_id=sup.id,
            action="CREATE",
            performed_by=performed_by,
            new_value=data.model_dump(mode="json"),
        )
        return SupplierRead.model_validate(sup)

    async def update_supplier(
        self,
        supplier_id: uuid.UUID,
        data: SupplierUpdate,
        performed_by: uuid.UUID | None = None,
    ) -> SupplierRead:
        sup = await self.repo.get_by_id(supplier_id)
        if not sup:
            raise NotFoundException("Supplier not found")

        old_data = SupplierRead.model_validate(sup).model_dump(mode="json")
        update_data = data.model_dump(exclude_unset=True)
        sup = await self.repo.update(sup, update_data)

        await self.audit.create(
            entity_type="supplier",
            entity_id=sup.id,
            action="UPDATE",
            performed_by=performed_by,
            old_value=old_data,
            new_value=update_data,
        )
        return SupplierRead.model_validate(sup)

    async def delete_supplier(
        self, supplier_id: uuid.UUID, performed_by: uuid.UUID | None = None
    ) -> None:
        sup = await self.repo.get_by_id(supplier_id)
        if not sup:
            raise NotFoundException("Supplier not found")

        await self.audit.create(
            entity_type="supplier",
            entity_id=sup.id,
            action="DELETE",
            performed_by=performed_by,
            old_value=SupplierRead.model_validate(sup).model_dump(mode="json"),
        )
        await self.repo.delete(sup)
