import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, Date, DateTime, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.models.role import Base


class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    category_id = Column(
        UUID(as_uuid=True), ForeignKey("inventory_categories.id"), nullable=True
    )
    model = Column(String(255), nullable=True)
    serial_number = Column(String(255), unique=True, nullable=False, index=True)
    supplier_id = Column(
        UUID(as_uuid=True), ForeignKey("suppliers.id"), nullable=True
    )
    purchase_date = Column(Date, nullable=True)
    status = Column(String(50), default="ACTIVE", index=True)  # ACTIVE, INACTIVE, DAMAGED, OBSOLETE
    condition = Column(String(50), default="NEW")  # NEW, GOOD, USED, OLD, BROKEN
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )

    # relationships
    category = relationship("InventoryCategory", back_populates="inventories")
    supplier = relationship("Supplier", back_populates="inventories")
    assignments = relationship("Assignment", back_populates="inventory")
    repair_requests = relationship("RepairRequest", back_populates="inventory")
