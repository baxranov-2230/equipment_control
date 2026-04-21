import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useUIStore } from '@/store/ui.store';
import { cn } from '@/components/ui/utils/button';

export function DashboardLayout() {
    const collapsed = useUIStore((s) => s.sidebarCollapsed);
    const location = useLocation();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
            <Sidebar />
            <div
                className={cn(
                    'flex min-h-screen flex-col transition-[margin] duration-300 ease-out',
                    collapsed ? 'md:ml-20' : 'md:ml-64'
                )}
            >
                <Navbar />
                <main className="flex-1 w-full overflow-x-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="w-full px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8"
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
