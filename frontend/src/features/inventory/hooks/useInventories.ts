import { useQuery } from '@tanstack/react-query';
import { inventoryApi } from '../api/inventory.api';

export function useInventories(params?: { page?: number; limit?: number; status?: string; }) {
    return useQuery({
        queryKey: ['inventories', params],
        queryFn: () => inventoryApi.getInventories(params),
    });
}
