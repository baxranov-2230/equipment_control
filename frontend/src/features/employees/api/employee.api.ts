import { api } from '@/services/api';
import type { PaginatedResponse } from '@/types/common.types';
import type { EmployeeWithUser } from '../types/employee.types';
import type { CreateEmployeeInputs } from '../schemas/employee.schema';

export const employeeApi = {
    getEmployees: async (params?: {
        page?: number;
        limit?: number;
        status?: string;
    }): Promise<PaginatedResponse<EmployeeWithUser>> => {
        const response = await api.get('/employees', { params });
        return response.data;
    },

    create: async (data: CreateEmployeeInputs): Promise<EmployeeWithUser> => {
        const response = await api.post('/employees', data);
        return response.data;
    },
};
