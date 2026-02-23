from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.inventory_repo import InventoryRepository
from app.repositories.repair_request_repo import RepairRequestRepository
from app.schemas.dashboard import DashboardStats


class DashboardService:
    def __init__(self, session: AsyncSession):
        self.inventory_repo = InventoryRepository(session)
        self.repair_repo = RepairRequestRepository(session)

    async def get_stats(self) -> DashboardStats:
        total = await self.inventory_repo.count_total()
        active = await self.inventory_repo.count_by_status("ACTIVE")
        damaged = await self.inventory_repo.count_by_status("DAMAGED")
        obsolete = await self.inventory_repo.count_by_status("OBSOLETE")
        repair_requests = await self.repair_repo.count_open()

        return DashboardStats(
            total_inventory=total,
            active=active,
            damaged=damaged,
            obsolete=obsolete,
            repair_requests=repair_requests,
        )
