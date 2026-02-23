import type { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './queryClient';
import { BrowserRouter } from 'react-router-dom';

interface ProvidersProps {
    children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                {children}
            </BrowserRouter>
        </QueryClientProvider>
    );
}
