import { useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { InventoryTable } from '@/features/inventory/components/InventoryTable';
import { InventoryForm } from '@/features/inventory/components/InventoryForm';

export default function InventoriesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Jihozlar
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Tashkilotdagi barcha moddiy jihozlar ro'yxati va ularning holati
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" className="flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        Filtrlash
                    </Button>
                    <Button className="flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
                        <Plus className="w-4 h-4" />
                        Yangi qo'shish
                    </Button>
                </div>
            </div>

            <InventoryTable />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Yangi jihoz qo'shish"
            >
                <InventoryForm
                    onSuccess={() => setIsModalOpen(false)}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
}
