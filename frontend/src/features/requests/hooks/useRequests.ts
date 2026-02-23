import { useQuery } from '@tanstack/react-query';
import { requestApi } from '../api/request.api';

export function useRequests(params?: {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
}) {
    return useQuery({
        queryKey: ['repair-requests', params],
        queryFn: () => requestApi.getRequests(params),
    });
}
