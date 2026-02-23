import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { useSuppliers } from '../hooks/useSuppliers';
import { Badge } from '@/components/ui/Badge';
import { format } from 'date-fns';

export function SupplierTable() {
    const { data, isLoading, error } = useSuppliers();

    if (isLoading) return <div className="p-8 text-center text-slate-500">Yuklanmoqda...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Xatolik yuz berdi</div>;

    const items = data?.items || [];

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Firma nomi</TableHead>
                        <TableHead>Kontakt shaxs</TableHead>
                        <TableHead>Telefon</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Holati</TableHead>
                        <TableHead>Kiritilgan sana</TableHead>
                        <TableHead className="text-right">Harakatlar</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                                Firmalar ro'yxati bo'sh
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((sup) => (
                            <TableRow key={sup.id}>
                                <TableCell className="font-medium text-slate-900 dark:text-white">
                                    {sup.name}
                                </TableCell>
                                <TableCell>{sup.contact_person || '-'}</TableCell>
                                <TableCell>{sup.phone || '-'}</TableCell>
                                <TableCell>{sup.email || '-'}</TableCell>
                                <TableCell>
                                    <Badge variant={sup.status === 'ACTIVE' ? 'success' : 'secondary'}>
                                        {sup.status === 'ACTIVE' ? 'Faol' : 'Nofaol'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {format(new Date(sup.created_at), 'dd.MM.yyyy')}
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
