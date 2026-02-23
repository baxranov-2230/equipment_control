import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { useEmployees } from '../hooks/useEmployees';
import { Badge } from '@/components/ui/Badge';
import { format } from 'date-fns';

export function EmployeeTable() {
    const { data, isLoading, error } = useEmployees();

    if (isLoading) return <div className="p-8 text-center text-slate-500">Yuklanmoqda...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Xatolik yuz berdi</div>;

    const items = data?.items || [];

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>F.I.SH</TableHead>
                        <TableHead>Foydalanuvchi qismi</TableHead>
                        <TableHead>Bo'lim</TableHead>
                        <TableHead>Lavozim</TableHead>
                        <TableHead>Telefon</TableHead>
                        <TableHead>Holati</TableHead>
                        <TableHead>Yaratilgan sana</TableHead>
                        <TableHead className="text-right">Harakatlar</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                                Xodimlar ro'yxati bo'sh
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((emp) => (
                            <TableRow key={emp.id}>
                                <TableCell className="font-medium text-slate-900 dark:text-white">
                                    {emp.user?.full_name || 'Noma\'lum'}
                                </TableCell>
                                <TableCell className="text-slate-500">@{emp.user?.username || 'user'}</TableCell>
                                <TableCell>{emp.department}</TableCell>
                                <TableCell>{emp.position}</TableCell>
                                <TableCell>{emp.phone || '-'}</TableCell>
                                <TableCell>
                                    <Badge variant={emp.status === 'ACTIVE' ? 'success' : 'secondary'}>
                                        {emp.status === 'ACTIVE' ? 'Faol' : 'Nofaol'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {format(new Date(emp.created_at), 'dd.MM.yyyy')}
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
