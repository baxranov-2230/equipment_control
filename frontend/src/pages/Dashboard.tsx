import { Activity, ArchiveX, CheckCircle, PackageSearch } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';

export default function DashboardPage() {
    // TODO: Replace with real API data hook (e.g. useDashboardStats())
    const stats = [
        {
            title: 'Jami jihozlar',
            value: '1,245',
            icon: PackageSearch,
            trend: { value: '+12.5%', isUp: true },
        },
        {
            title: 'Faol jihozlar',
            value: '984',
            icon: CheckCircle,
            trend: { value: '+1.2%', isUp: true },
        },
        {
            title: 'Nosoz jihozlar',
            value: '32',
            icon: Activity,
            trend: { value: '-2.4%', isUp: false },
        },
        {
            title: 'Eskirganlar',
            value: '229',
            icon: ArchiveX,
            trend: { value: '+4.1%', isUp: false },
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Dashboard
                </h1>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <StatCard
                        key={stat.title}
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        trend={stat.trend}
                    />
                ))}
            </div>

            {/* Main Charts & Logs Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                {/* Placeholder for Chart */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm min-h-[300px] flex items-center justify-center">
                    <p className="text-slate-500 dark:text-slate-400">Diagramma qismi bu yerda bo'ladi</p>
                </div>

                {/* Placeholder for Activity Logs */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm min-h-[300px]">
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Oxirgi harakatlar</h3>
                    <ul className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <li key={i} className="flex gap-4">
                                <div className="w-2 h-2 mt-2 rounded-full bg-primary-500"></div>
                                <div>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">Hp ProBook 450 G8 xodimga biriktirildi</p>
                                    <p className="text-xs text-slate-500">2 soat oldin</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
