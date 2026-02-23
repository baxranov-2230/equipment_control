import { api } from '@/services/api';
import type { PaginatedResponse } from '@/types/common.types';
import type { InventoryWithDetails, Inventory } from '../types/inventory.types';
import type { CreateInventoryInputs } from '../schemas/inventory.schema';

export const inventoryApi = {
    getInventories: async (params?: {
        page?: number;
        limit?: number;
        status?: string;
    }): Promise<PaginatedResponse<InventoryWithDetails>> => {
        const response = await api.get('/inventories', { params });
        return response.data;
    },

    create: async (data: CreateInventoryInputs): Promise<Inventory> => {
        const response = await api.post('/inventories', data);
        return response.data;
    },
};
