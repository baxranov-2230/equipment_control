import { useMutation, useQueryClient } from '@tanstack/react-query';
import { requestApi } from '../api/request.api';
import type { CreateRequestInputs } from '../schemas/request.schema';

export function useCreateRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateRequestInputs) => requestApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['repair-requests'] });
        },
    });
}

export function useUpdateRequestStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            requestApi.updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['repair-requests'] });
        },
    });
}
