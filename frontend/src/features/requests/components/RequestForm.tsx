import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createRequestSchema, type CreateRequestInputs } from '../schemas/request.schema';
import { useCreateRequest } from '../hooks/useCreateRequest';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface RequestFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function RequestForm({ onSuccess, onCancel }: RequestFormProps) {
    const { mutate: createRequest, isPending } = useCreateRequest();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(createRequestSchema),
        defaultValues: {
            inventory_id: '',
            description: '',
            priority: 'LOW' as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
        }
    });

    const onSubmit = (data: CreateRequestInputs) => {
        createRequest(data, {
            onSuccess: () => {
                if (onSuccess) onSuccess();
            },
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
                {/* Note: Inventory selection pending full drop-down lookup component */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Jihoz ID</label>
                    <Input placeholder="Jihoz UUID" {...register('inventory_id')} error={errors.inventory_id?.message} />
                    <p className="text-xs text-slate-500 mt-1">Vaqtinchalik: Tizimdagi jihoz UUID sini kiriting</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Muhimlik darajasi</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((level) => (
                            <button
                                key={level}
                                type="button"
                                onClick={() => setValue('priority', level as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL')}
                                className="px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                            >
                                {level === 'LOW' ? 'Past' : level === 'MEDIUM' ? 'O\'rtacha' : level === 'HIGH' ? 'Yuqori' : 'Kritik'}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nosozlik tavsifi</label>
                    <textarea
                        className="flex min-h-[120px] w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 dark:border-slate-800 dark:placeholder:text-slate-400"
                        placeholder="Nosozlik haqida to'liq ma'lumot yozing..."
                        {...register('description')}
                    />
                    {errors.description && (
                        <span className="text-sm text-red-500 mt-1">{errors.description.message}</span>
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Bekor qilish
                </Button>
                <Button type="submit" disabled={isPending}>
                    {isPending ? 'Yuborilmoqda...' : 'Tasdiqlash'}
                </Button>
            </div>
        </form>
    );
}
