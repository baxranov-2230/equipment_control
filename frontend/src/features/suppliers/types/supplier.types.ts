export interface Supplier {
    id: string;
    name: string;
    contact_person: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    status: 'ACTIVE' | 'INACTIVE';
    created_at: string;
}
