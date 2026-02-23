import uuid

from sqlalchemy import Column, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.models.role import Base


class InventoryCategory(Base):
    __tablename__ = "inventory_categories"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), unique=True, nullable=False)
    description = Column(Text, nullable=True)

    # relationships
    inventories = relationship("Inventory", back_populates="category")
