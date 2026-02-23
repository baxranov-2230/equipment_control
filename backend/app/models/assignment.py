import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.models.role import Base


class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    inventory_id = Column(
        UUID(as_uuid=True), ForeignKey("inventory.id"), nullable=False
    )
    employee_id = Column(
        UUID(as_uuid=True), ForeignKey("employees.id"), nullable=False, index=True
    )
    assigned_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )
    returned_at = Column(DateTime(timezone=True), nullable=True)
    is_active = Column(Boolean, default=True)
    assigned_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)

    # relationships
    inventory = relationship("Inventory", back_populates="assignments")
    employee = relationship("Employee", back_populates="assignments")

    __table_args__ = (
        # Enterprise trick: only 1 active assignment per inventory
        Index(
            "unique_active_inventory",
            "inventory_id",
            unique=True,
            postgresql_where=(is_active.is_(True)),
        ),
    )
