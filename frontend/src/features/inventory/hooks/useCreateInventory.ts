import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '../api/inventory.api';
import type { CreateInventoryInputs } from '../schemas/inventory.schema';

export function useCreateInventory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateInventoryInputs) => inventoryApi.create(data),
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['inventories'] });
        },
    });
}
