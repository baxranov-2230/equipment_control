import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { useInventories } from '../hooks/useInventories';
import { StatusBadge } from './StatusBadge';
import { format } from 'date-fns';

export function InventoryTable() {
    const { data, isLoading, error } = useInventories();

    if (isLoading) return <div className="p-8 text-center text-slate-500">Yuklanmoqda...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Xatolik yuz berdi</div>;

    const items = data?.items || [];

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Jihoz nomi</TableHead>
                        <TableHead>Kategoriya</TableHead>
                        <TableHead>Seriya raqami</TableHead>
                        <TableHead>Holati</TableHead>
                        <TableHead>Firma</TableHead>
                        <TableHead>Xarid sanasi</TableHead>
                        <TableHead className="text-right">Harakatlar</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                                Jihozlar topilmadi
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium text-slate-900 dark:text-white">{item.name}</TableCell>
                                <TableCell>{item.category}</TableCell>
                                <TableCell className="text-slate-500">{item.serial_number}</TableCell>
                                <TableCell>
                                    <StatusBadge status={item.status} />
                                </TableCell>
                                <TableCell>{item.supplier?.name || '-'}</TableCell>
                                <TableCell>
                                    {format(new Date(item.purchase_date), 'dd.MM.yyyy')}
                                </TableCell>
                                <TableCell className="text-right">
                                    <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">Tahrirlash</button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
