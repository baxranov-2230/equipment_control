import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.models.role import Base


class RepairRequest(Base):
    __tablename__ = "repair_requests"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    inventory_id = Column(
        UUID(as_uuid=True), ForeignKey("inventory.id"), nullable=False
    )
    employee_id = Column(
        UUID(as_uuid=True), ForeignKey("employees.id"), nullable=False
    )
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    priority = Column(String(50), default="MEDIUM")  # LOW, MEDIUM, HIGH, URGENT
    status = Column(String(50), default="NEW")  # NEW, IN_PROGRESS, FIXED, REJECTED
    image_url = Column(Text, nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )

    # relationships
    inventory = relationship("Inventory", back_populates="repair_requests")
    employee = relationship("Employee", back_populates="repair_requests")
