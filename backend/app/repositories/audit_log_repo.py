import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.audit_log import AuditLog


class AuditLogRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(
        self,
        entity_type: str,
        entity_id: uuid.UUID,
        action: str,
        performed_by: uuid.UUID | None = None,
        old_value: dict | None = None,
        new_value: dict | None = None,
    ) -> AuditLog:
        log = AuditLog(
            entity_type=entity_type,
            entity_id=entity_id,
            action=action,
            performed_by=performed_by,
            old_value=old_value,
            new_value=new_value,
        )
        self.session.add(log)
        await self.session.flush()
        return log
