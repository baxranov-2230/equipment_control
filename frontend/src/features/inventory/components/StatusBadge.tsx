import { Badge } from '@/components/ui/Badge';
import type { Inventory } from '../types/inventory.types';

export function StatusBadge({ status }: { status: Inventory['status'] }) {
    switch (status) {
        case 'ACTIVE':
            return <Badge variant="success">Faol</Badge>;
        case 'INACTIVE':
            return <Badge variant="secondary">Nofaol</Badge>;
        case 'BROKEN':
            return <Badge variant="destructive">Nosoz</Badge>;
        case 'ARCHIVED':
            return <Badge variant="warning">Eskirgan</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
}
