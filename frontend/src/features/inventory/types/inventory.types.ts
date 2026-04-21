import type { User } from '@/types/common.types';

export interface Inventory {
    id: string;
    name: string;
    category: string;
    supplier_id: string | null;
    serial_number: string;
    quantity: number;
    purchase_date: string;
    price: number | null;
    status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED' | 'BROKEN';
    notes: string | null;
    created_at: string;
}

export interface InventoryWithDetails extends Inventory {
    supplier: {
        id: string;
        name: string;
    } | null;
    assignment: {
        id: string;
        employee_id: string;
        employee: {
            id: string;
            department: string;
            position: string;
            user: User;
        };
    } | null;
}
