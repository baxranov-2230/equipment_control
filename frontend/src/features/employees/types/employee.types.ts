export interface Employee {
    id: string;
    department: string;
    position: string;
    phone: string | null;
    status: 'ACTIVE' | 'INACTIVE';
    user_id: string;
    created_at: string;
}

export interface EmployeeWithUser extends Employee {
    user: {
        id: string;
        username: string;
        full_name: string;
        is_active: boolean;
    };
}
