import { useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeApi } from '../api/employee.api';
import type { CreateEmployeeInputs } from '../schemas/employee.schema';

export function useCreateEmployee() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateEmployeeInputs) => employeeApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] });
        },
    });
}
