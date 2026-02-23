import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createSupplierSchema, type CreateSupplierInputs } from '../schemas/supplier.schema';
import { useCreateSupplier } from '../hooks/useCreateSupplier';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface SupplierFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function SupplierForm({ onSuccess, onCancel }: SupplierFormProps) {
    const { mutate: createSupplier, isPending } = useCreateSupplier();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(createSupplierSchema),
        defaultValues: {
            name: '',
            contact_person: null,
            phone: null,
            email: null,
            address: null,
            status: 'ACTIVE',
        }
    });

    const onSubmit = (data: CreateSupplierInputs) => {
        createSupplier(data, {
            onSuccess: () => {
                if (onSuccess) onSuccess();
            },
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Firma yoki Tashkilot nomi</label>
                    <Input placeholder="MCHJ Misol" {...register('name')} error={errors.name?.message} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kontakt shaxs</label>
                    <Input placeholder="Toshmatov Eshmat" {...register('contact_person')} error={errors.contact_person?.message} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Telefon</label>
                    <Input placeholder="+998901234567" {...register('phone')} error={errors.phone?.message} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Elektron pochta</label>
                    <Input type="email" placeholder="misol@tashkilot.uz" {...register('email')} error={errors.email?.message} />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Yuridik manzil</label>
                    <Input placeholder="Toshkent sh., Yunusobod t." {...register('address')} error={errors.address?.message} />
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Bekor qilish
                </Button>
                <Button type="submit" disabled={isPending}>
                    {isPending ? 'Saqlanmoqda...' : 'Firmani saqlash'}
                </Button>
            </div>
        </form>
    );
}
