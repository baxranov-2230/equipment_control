import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import BadRequestException, NotFoundException
from app.core.security import hash_password
from app.models.employee import Employee
from app.models.user import User
from app.repositories.audit_log_repo import AuditLogRepository
from app.repositories.employee_repo import EmployeeRepository
from app.repositories.user_repo import UserRepository
from app.schemas.employee import EmployeeCreate, EmployeeRead, EmployeeUpdate


class EmployeeService:
    def __init__(self, session: AsyncSession):
        self.repo = EmployeeRepository(session)
        self.audit = AuditLogRepository(session)
        self.user_repo = UserRepository(session)

    async def list_employees(
        self, offset: int = 0, limit: int = 20
    ) -> tuple[list[EmployeeRead], int]:
        employees, total = await self.repo.list_all(offset, limit)
        return [EmployeeRead.model_validate(e) for e in employees], total

    async def get_employee(self, employee_id: uuid.UUID) -> EmployeeRead:
        emp = await self.repo.get_by_id(employee_id)
        if not emp:
            raise NotFoundException("Employee not found")
        return EmployeeRead.model_validate(emp)

    async def create_employee(
        self, data: EmployeeCreate, performed_by: uuid.UUID | None = None
    ) -> EmployeeRead:
        # Check if username already taken
        existing_user = await self.user_repo.get_by_username(data.username)
        if existing_user:
            raise BadRequestException("Username already exists.")

        # Get EMPLOYEE role
        role = await self.user_repo.get_role_by_name("EMPLOYEE")
        if not role:
            raise NotFoundException("Default role EMPLOYEE not found.")

        # Create user account
        user = User(
            full_name=data.full_name,
            username=data.username,
            password_hash=hash_password(data.password),
            role_id=role.id,
        )
        user = await self.user_repo.create(user)

        # Create employee linked to user
        emp = Employee(
            user_id=user.id,
            department=data.department,
            position=data.position,
            phone=data.phone,
            status=data.status,
        )
        emp = await self.repo.create(emp)

        await self.audit.create(
            entity_type="employee",
            entity_id=emp.id,
            action="CREATE",
            performed_by=performed_by,
            new_value={
                "full_name": data.full_name,
                "username": data.username,
                "department": data.department,
                "position": data.position,
                "phone": data.phone,
                "status": data.status,
            },
        )
        return EmployeeRead.model_validate(emp)

    async def update_employee(
        self,
        employee_id: uuid.UUID,
        data: EmployeeUpdate,
        performed_by: uuid.UUID | None = None,
    ) -> EmployeeRead:
        emp = await self.repo.get_by_id(employee_id)
        if not emp:
            raise NotFoundException("Employee not found")

        old_data = EmployeeRead.model_validate(emp).model_dump(mode="json")
        update_data = data.model_dump(exclude_unset=True)
        emp = await self.repo.update(emp, update_data)

        await self.audit.create(
            entity_type="employee",
            entity_id=emp.id,
            action="UPDATE",
            performed_by=performed_by,
            old_value=old_data,
            new_value=update_data,
        )
        return EmployeeRead.model_validate(emp)

    async def delete_employee(
        self, employee_id: uuid.UUID, performed_by: uuid.UUID | None = None
    ) -> None:
        emp = await self.repo.get_by_id(employee_id)
        if not emp:
            raise NotFoundException("Employee not found")

        await self.audit.create(
            entity_type="employee",
            entity_id=emp.id,
            action="DELETE",
            performed_by=performed_by,
            old_value=EmployeeRead.model_validate(emp).model_dump(mode="json"),
        )
        await self.repo.delete(emp)
