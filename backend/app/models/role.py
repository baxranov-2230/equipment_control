import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import DeclarativeBase, relationship


class Base(DeclarativeBase):
    pass


class Role(Base):
    __tablename__ = "roles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(50), unique=True, nullable=False)  # ADMIN, SUPPLY, EMPLOYEE
    description = Column(Text, nullable=True)

    # relationships
    users = relationship("User", back_populates="role")
