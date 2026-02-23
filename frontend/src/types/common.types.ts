export interface User {
    id: string;
    full_name: string;
    username: string;
    role_id: string;
    is_active: boolean;
    created_at: string;
}

export interface Role {
    id: string;
    name: 'ADMIN' | 'SUPPLY' | 'EMPLOYEE';
    description?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
}
