import { useState } from 'react';
import { Plus, Filter, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { RequestTable } from '@/features/requests/components/RequestTable';
import { RequestForm } from '@/features/requests/components/RequestForm';

export default function RequestsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                        Nosozliklar <AlertCircle className="w-5 h-5 text-red-500 hidden sm:inline" />
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Uskuna va jihozlardagi nosozliklar bo'yicha kelib tushgan barcha arizalar paneli
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" className="flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        <span className="hidden sm:inline">Filtrlash</span>
                    </Button>
                    <Button className="flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
                        <Plus className="w-4 h-4" />
                        Nosozlik xabari
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {/* Simple stat summaries manually passed for UI filler. Would typically come from backend */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                    <h3 className="text-sm font-medium text-slate-500">Jami arizalar</h3>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">0</p>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                    <h3 className="text-sm font-medium text-slate-500">Kutilmoqda</h3>
                    <p className="text-2xl font-bold text-warning-500 mt-1">0</p>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                    <h3 className="text-sm font-medium text-slate-500">Jarayonda</h3>
                    <p className="text-2xl font-bold text-primary-500 mt-1">0</p>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                    <h3 className="text-sm font-medium text-slate-500">Bajarildi</h3>
                    <p className="text-2xl font-bold text-success-500 mt-1">0</p>
                </div>
            </div>

            <RequestTable />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Yangi nosozlik xabari"
            >
                <RequestForm
                    onSuccess={() => setIsModalOpen(false)}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
}
