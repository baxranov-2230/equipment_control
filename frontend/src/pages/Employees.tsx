import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { EmployeeTable } from '@/features/employees/components/EmployeeTable';
import { EmployeeForm } from '@/features/employees/components/EmployeeForm';

export default function EmployeesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Xodimlar
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Tashkilot xodimlari va ularga biriktirilgan jihozlarni boshqarish
                    </p>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Qidirish..."
                            className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-800 rounded-md leading-5 bg-white dark:bg-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
                        />
                    </div>
                    <Button className="flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">Yangi Xodim</span>
                    </Button>
                </div>
            </div>

            <EmployeeTable />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Yangi xodim qo'shish"
            >
                <EmployeeForm
                    onSuccess={() => setIsModalOpen(false)}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
}
