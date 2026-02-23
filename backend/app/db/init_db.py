"""
Database initialization helpers.
Creates all tables and seeds default roles and admin user.
"""
import asyncio
import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import async_session_factory, engine
from app.core.security import hash_password

# Import ALL models so Base.metadata knows about them
from app.models.role import Base, Role
from app.models.user import User
from app.models.employee import Employee  # noqa: F401
from app.models.supplier import Supplier  # noqa: F401
from app.models.inventory_category import InventoryCategory  # noqa: F401
from app.models.inventory import Inventory  # noqa: F401
from app.models.assignment import Assignment  # noqa: F401
from app.models.repair_request import RepairRequest  # noqa: F401
from app.models.audit_log import AuditLog  # noqa: F401
from app.models.file_upload import FileUpload  # noqa: F401
from app.repositories.user_repo import UserRepository


DEFAULT_ROLES = [
    {"name": "ADMIN", "description": "System administrator with full access"},
    {"name": "SUPPLY", "description": "Supply chain manager"},
    {"name": "EMPLOYEE", "description": "Regular employee"},
]


async def create_tables() -> None:
    """Create all database tables if they don't exist."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("  ✅ Database tables created")


async def seed_roles_and_admin(session: AsyncSession) -> None:
    repo = UserRepository(session)

    # Seed roles
    for role_data in DEFAULT_ROLES:
        existing = await repo.get_role_by_name(role_data["name"])
        if not existing:
            role = Role(**role_data)
            await repo.create_role(role)
            print(f"  ✅ Created role: {role_data['name']}")

    # Seed admin user
    admin_user = await repo.get_by_username("admin")
    if not admin_user:
        admin_role = await repo.get_role_by_name("ADMIN")
        if admin_role:
            admin = User(
                full_name="System Admin",
                username="admin",
                password_hash=hash_password("admin123"),
                role_id=admin_role.id,
            )
            await repo.create(admin)
            print("  ✅ Created default admin user (admin / admin123)")

    await session.commit()


async def init_db() -> None:
    print("🔧 Initializing database...")
    await create_tables()
    async with async_session_factory() as session:
        await seed_roles_and_admin(session)
    print("✅ Database initialized!")


if __name__ == "__main__":
    asyncio.run(init_db())
