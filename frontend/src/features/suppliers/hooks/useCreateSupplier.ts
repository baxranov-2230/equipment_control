import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supplierApi } from '../api/supplier.api';
import type { CreateSupplierInputs } from '../schemas/supplier.schema';

export function useCreateSupplier() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateSupplierInputs) => supplierApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['suppliers'] });
        },
    });
}
