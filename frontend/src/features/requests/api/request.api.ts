import { api } from '@/services/api';
import type { PaginatedResponse } from '@/types/common.types';
import type { RepairRequest } from '../types/request.types';
import type { CreateRequestInputs } from '../schemas/request.schema';

export const requestApi = {
    getRequests: async (params?: {
        page?: number;
        limit?: number;
        status?: string;
        priority?: string;
    }): Promise<PaginatedResponse<RepairRequest>> => {
        const response = await api.get('/repair-requests', { params });
        return response.data;
    },

    create: async (data: CreateRequestInputs): Promise<RepairRequest> => {
        const response = await api.post('/repair-requests', data);
        return response.data;
    },

    updateStatus: async (id: string, status: string): Promise<RepairRequest> => {
        const response = await api.patch(`/repair-requests/${id}/status`, { status });
        return response.data;
    },
};
