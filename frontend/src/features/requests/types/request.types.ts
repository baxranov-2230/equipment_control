export interface RepairRequest {
    id: string;
    inventory_id: string;
    description: string;
    reported_by: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    cost: number | null;
    repair_date: string | null;
    created_at: string;
    updated_at: string | null;
    inventory?: {
        id: string;
        name: string;
        serial_number: string;
    };
    reporter?: {
        id: string;
        user: {
            full_name: string;
        };
    };
}
