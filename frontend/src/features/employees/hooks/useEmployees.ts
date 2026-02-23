import { useQuery } from '@tanstack/react-query';
import { employeeApi } from '../api/employee.api';

export function useEmployees(params?: { page?: number; limit?: number; status?: string; }) {
    return useQuery({
        queryKey: ['employees', params],
        queryFn: () => employeeApi.getEmployees(params),
    });
}
