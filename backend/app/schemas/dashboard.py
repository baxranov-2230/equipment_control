from pydantic import BaseModel


class DashboardStats(BaseModel):
    total_inventory: int
    active: int
    damaged: int
    obsolete: int
    repair_requests: int
