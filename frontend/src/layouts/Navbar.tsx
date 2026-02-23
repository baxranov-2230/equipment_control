import { Menu, UserCircle } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';

export function Navbar() {
    const user = useAuthStore((state) => state.user);

    return (
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10 w-full">
            <div className="flex items-center gap-4">
                <button className="md:hidden text-slate-500 hover:text-slate-700">
                    <Menu className="w-6 h-6" />
                </button>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                    <div className="text-right hidden sm:block">
                        <p className="font-medium text-slate-900 dark:text-white leading-tight">
                            {user?.full_name || 'Foydalanuvchi'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {user?.role_id ? 'Tizim xodimi' : ''}
                        </p>
                    </div>
                    <div className="w-9 h-9 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                        <UserCircle className="w-6 h-6" />
                    </div>
                </div>
            </div>
        </header>
    );
}
