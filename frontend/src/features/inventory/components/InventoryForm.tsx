import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createInventorySchema, type CreateInventoryInputs } from '../schemas/inventory.schema';
import { useCreateInventory } from '../hooks/useCreateInventory';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface InventoryFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function InventoryForm({ onSuccess, onCancel }: InventoryFormProps) {
    const { mutate: createInventory, isPending } = useCreateInventory();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(createInventorySchema),
        defaultValues: {
            name: '',
            category: '',
            supplier_id: '',
            serial_number: '',
            quantity: 1,
            purchase_date: '',
            price: null,
            status: 'ACTIVE',
            notes: null,
        }
    });

    const onSubmit = (data: CreateInventoryInputs) => {
        createInventory(data, {
            onSuccess: () => {
                if (onSuccess) onSuccess();
            },
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Jihoz nomi</label>
                    <Input placeholder="Masalan: Noutbuk HP" {...register('name')} error={errors.name?.message} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kategoriya</label>
                    <Input placeholder="Electronics" {...register('category')} error={errors.category?.message} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Seriya raqami</label>
                    <Input placeholder="SN-12345" {...register('serial_number')} error={errors.serial_number?.message} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Miqdor</label>
                    <Input type="number" {...register('quantity')} error={errors.quantity?.message} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Xarid sanasi</label>
                    <Input type="date" {...register('purchase_date')} error={errors.purchase_date?.message} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Narxi (ixtiyoriy)</label>
                    <Input type="number" step="0.01" {...register('price')} error={errors.price?.message} />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Qo'shimcha ma'lumot</label>
                    <textarea
                        className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 dark:border-slate-800 dark:placeholder:text-slate-400"
                        placeholder="Izoh yozing..."
                        {...register('notes')}
                    />
                </div>
                {/* Note: Supplier integration pending full lookup */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Firma ID</label>
                    <Input placeholder="Firma UUID" {...register('supplier_id')} error={errors.supplier_id?.message} />
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Bekor qilish
                </Button>
                <Button type="submit" disabled={isPending}>
                    {isPending ? 'Saqlanmoqda...' : 'Saqlash'}
                </Button>
            </div>
        </form>
    );
}
