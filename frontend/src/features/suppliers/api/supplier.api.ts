import { api } from '@/services/api';
import type { PaginatedResponse } from '@/types/common.types';
import type { Supplier } from '../types/supplier.types';
import type { CreateSupplierInputs } from '../schemas/supplier.schema';

export const supplierApi = {
    getSuppliers: async (params?: {
        page?: number;
        limit?: number;
        status?: string;
    }): Promise<PaginatedResponse<Supplier>> => {
        const response = await api.get('/suppliers', { params });
        return response.data;
    },

    create: async (data: CreateSupplierInputs): Promise<Supplier> => {
        const response = await api.post('/suppliers', data);
        return response.data;
    },
};
