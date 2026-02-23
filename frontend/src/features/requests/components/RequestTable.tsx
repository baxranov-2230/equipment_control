import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { useRequests } from '../hooks/useRequests';
import { Badge } from '@/components/ui/Badge';
import { format } from 'date-fns';

export function RequestTable() {
    const { data, isLoading, error } = useRequests();

    if (isLoading) return <div className="p-8 text-center text-slate-500">Yuklanmoqda...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Xatolik yuz berdi</div>;

    const items = data?.items || [];

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'CRITICAL': return <Badge variant="destructive">Kritik</Badge>;
            case 'HIGH': return <Badge variant="warning">Yuqori</Badge>;
            case 'MEDIUM': return <Badge variant="secondary">O'rtacha</Badge>;
            case 'LOW': default: return <Badge variant="outline">Past</Badge>;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'COMPLETED': return <Badge variant="success">Bajarildi</Badge>;
            case 'IN_PROGRESS': return <Badge variant="secondary">Jarayonda</Badge>;
            case 'CANCELLED': return <Badge variant="destructive">Bekor qilindi</Badge>;
            case 'PENDING': default: return <Badge variant="warning">Kutilmoqda</Badge>;
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Jihoz</TableHead>
                        <TableHead>Muammo</TableHead>
                        <TableHead>Xabar beruvchi</TableHead>
                        <TableHead>Muhimlik</TableHead>
                        <TableHead>Holat</TableHead>
                        <TableHead>Sana</TableHead>
                        <TableHead className="text-right">Harakatlar</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                                Nosozliklar ro'yxati bo'sh
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((req) => (
                            <TableRow key={req.id}>
                                <TableCell className="font-medium text-slate-900 dark:text-white">
                                    {req.inventory?.name || 'O\'chirilgan jihoz'}
                                    <div className="text-xs text-slate-500">{req.inventory?.serial_number}</div>
                                </TableCell>
                                <TableCell className="max-w-xs truncate">{req.description}</TableCell>
                                <TableCell>{req.reporter?.user?.full_name || 'Noma\'lum'}</TableCell>
                                <TableCell>{getPriorityBadge(req.priority)}</TableCell>
                                <TableCell>{getStatusBadge(req.status)}</TableCell>
                                <TableCell>
                                    {format(new Date(req.created_at), 'dd.MM.yyyy')}
                                </TableCell>
                                <TableCell className="text-right">
                                    <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">Batafsil</button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
