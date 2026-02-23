import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.models.role import Base


class Employee(Base):
    __tablename__ = "employees"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False
    )
    department = Column(String(255), nullable=False)
    position = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    status = Column(String(50), default="ACTIVE")
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )

    # relationships
    user = relationship("User", back_populates="employee")
    assignments = relationship("Assignment", back_populates="employee")
    repair_requests = relationship("RepairRequest", back_populates="employee")
