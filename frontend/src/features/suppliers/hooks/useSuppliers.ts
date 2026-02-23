import { useQuery } from '@tanstack/react-query';
import { supplierApi } from '../api/supplier.api';

export function useSuppliers(params?: { page?: number; limit?: number; status?: string; }) {
    return useQuery({
        queryKey: ['suppliers', params],
        queryFn: () => supplierApi.getSuppliers(params),
    });
}
