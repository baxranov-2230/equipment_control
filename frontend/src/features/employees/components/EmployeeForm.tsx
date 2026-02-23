import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createEmployeeSchema, type CreateEmployeeInputs } from '../schemas/employee.schema';
import { useCreateEmployee } from '../hooks/useCreateEmployee';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface EmployeeFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function EmployeeForm({ onSuccess, onCancel }: EmployeeFormProps) {
    const { mutate: createEmployee, isPending } = useCreateEmployee();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(createEmployeeSchema),
        defaultValues: {
            full_name: '',
            username: '',
            password: '',
            department: '',
            position: '',
            phone: null,
            status: 'ACTIVE',
        }
    });

    const onSubmit = (data: CreateEmployeeInputs) => {
        createEmployee(data, {
            onSuccess: () => {
                if (onSuccess) onSuccess();
            },
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg mb-4 border border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Tizim foydalanuvchisi</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">To'liq ism (F.I.SH)</label>
                        <Input placeholder="Toshmatov Eshmat" {...register('full_name')} error={errors.full_name?.message} />
                    </div>
                    <div></div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Login (Username)</label>
                        <Input placeholder="eshmat" {...register('username')} error={errors.username?.message} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Parol</label>
                        <Input type="password" placeholder="••••••••" {...register('password')} error={errors.password?.message} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bo'lim</label>
                    <Input placeholder="IT Bo'limi" {...register('department')} error={errors.department?.message} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Lavozim</label>
                    <Input placeholder="Dasturchi" {...register('position')} error={errors.position?.message} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Telefon (ixtiyoriy)</label>
                    <Input placeholder="+998901234567" {...register('phone')} error={errors.phone?.message} />
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 border-t border-slate-200 dark:border-slate-800 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Bekor qilish
                </Button>
                <Button type="submit" disabled={isPending}>
                    {isPending ? 'Saqlanmoqda...' : 'Xodim qo\'shish'}
                </Button>
            </div>
        </form>
    );
}
