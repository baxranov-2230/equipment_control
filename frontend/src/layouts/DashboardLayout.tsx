import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export function DashboardLayout() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
            <Sidebar />
            <div className="flex-1 flex flex-col md:ml-64 transition-all">
                <Navbar />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    <div className="mx-auto max-w-7xl">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
