import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Menu,
    Bell,
    Search,
    Sun,
    Moon,
    UserCircle,
    LogOut,
    Settings as SettingsIcon,
    ChevronDown,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth.store';
import { useUIStore } from '@/store/ui.store';
import { Tooltip } from '@/components/ui/Tooltip';
import { cn } from '@/components/ui/utils/button';

export function Navbar() {
    const user = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);
    const theme = useUIStore((s) => s.theme);
    const toggleTheme = useUIStore((s) => s.toggleTheme);
    const openMobile = useUIStore((s) => s.openMobileSidebar);

    const [userOpen, setUserOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const userRef = useRef<HTMLDivElement>(null);
    const notifRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        function onDocClick(e: MouseEvent) {
            if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
        }
        document.addEventListener('mousedown', onDocClick);
        return () => document.removeEventListener('mousedown', onDocClick);
    }, []);

    const initials = (user?.full_name ?? 'F')
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <header className="sticky top-0 z-20 h-16 w-full border-b border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
            <div className="flex h-full items-center justify-between gap-4 px-4 sm:px-6">
                {/* Left: mobile menu + search */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <button
                        onClick={openMobile}
                        aria-label="Menyu"
                        className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <Menu className="h-5 w-5" />
                    </button>

                    <div className="relative hidden sm:block flex-1 max-w-md">
                        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Qidirish..."
                            className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-100/80 dark:bg-slate-900 border border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 transition-all"
                        />
                        <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden lg:inline-flex items-center gap-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                            ⌘K
                        </kbd>
                    </div>
                </div>

                {/* Right: actions */}
                <div className="flex items-center gap-1 sm:gap-2">
                    {/* Theme toggle */}
                    <Tooltip content={theme === 'dark' ? 'Yorug‘ rejim' : 'Qorong‘i rejim'} side="bottom">
                        <button
                            onClick={toggleTheme}
                            aria-label="Mavzu o‘zgartirish"
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hover:scale-105"
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.span
                                    key={theme}
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex"
                                >
                                    {theme === 'dark' ? (
                                        <Sun className="h-4.5 w-4.5 text-amber-400" />
                                    ) : (
                                        <Moon className="h-4.5 w-4.5" />
                                    )}
                                </motion.span>
                            </AnimatePresence>
                        </button>
                    </Tooltip>

                    {/* Notifications */}
                    <div ref={notifRef} className="relative">
                        <Tooltip content="Bildirishnomalar" side="bottom" disabled={notifOpen}>
                            <button
                                onClick={() => setNotifOpen((o) => !o)}
                                aria-label="Bildirishnomalar"
                                className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                            >
                                <Bell className="h-4.5 w-4.5" />
                                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-950" />
                            </button>
                        </Tooltip>
                        <AnimatePresence>
                            {notifOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl"
                                >
                                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                            Bildirishnomalar
                                        </span>
                                        <button className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline">
                                            Tozalash
                                        </button>
                                    </div>
                                    <ul className="max-h-80 overflow-y-auto">
                                        {[
                                            { t: 'Yangi nosozlik so‘rovi', d: '2 daqiqa oldin', c: 'bg-red-500' },
                                            { t: 'Jihoz biriktirildi', d: '1 soat oldin', c: 'bg-primary-500' },
                                            { t: 'Yangi xodim qo‘shildi', d: '3 soat oldin', c: 'bg-amber-500' },
                                        ].map((n, i) => (
                                            <li
                                                key={i}
                                                className="flex gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                                            >
                                                <span className={cn('mt-1.5 h-2 w-2 rounded-full shrink-0', n.c)} />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-slate-900 dark:text-white truncate">
                                                        {n.t}
                                                    </p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                        {n.d}
                                                    </p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="mx-1 h-6 w-px bg-slate-200 dark:bg-slate-800" />

                    {/* User dropdown */}
                    <div ref={userRef} className="relative">
                        <button
                            onClick={() => setUserOpen((o) => !o)}
                            className="flex items-center gap-2.5 pl-1.5 pr-2 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center text-xs font-semibold shadow-sm">
                                {initials}
                            </div>
                            <div className="text-left hidden sm:block">
                                <p className="text-sm font-medium text-slate-900 dark:text-white leading-tight truncate max-w-[140px]">
                                    {user?.full_name || 'Foydalanuvchi'}
                                </p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                    Tizim xodimi
                                </p>
                            </div>
                            <ChevronDown
                                className={cn(
                                    'h-4 w-4 text-slate-400 transition-transform hidden sm:block',
                                    userOpen && 'rotate-180'
                                )}
                            />
                        </button>

                        <AnimatePresence>
                            {userOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl"
                                >
                                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                            {user?.full_name || 'Foydalanuvchi'}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                            @{user?.username || 'foydalanuvchi'}
                                        </p>
                                    </div>
                                    <div className="p-1.5">
                                        <MenuItem
                                            icon={UserCircle}
                                            label="Profil"
                                            onClick={() => {
                                                setUserOpen(false);
                                                navigate('/settings');
                                            }}
                                        />
                                        <MenuItem
                                            icon={SettingsIcon}
                                            label="Sozlamalar"
                                            onClick={() => {
                                                setUserOpen(false);
                                                navigate('/settings');
                                            }}
                                        />
                                    </div>
                                    <div className="p-1.5 border-t border-slate-100 dark:border-slate-800">
                                        <MenuItem
                                            icon={LogOut}
                                            label="Chiqish"
                                            danger
                                            onClick={() => {
                                                setUserOpen(false);
                                                logout();
                                            }}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </header>
    );
}

interface MenuItemProps {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    onClick?: () => void;
    danger?: boolean;
}

function MenuItem({ icon: Icon, label, onClick, danger }: MenuItemProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                'w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors',
                danger
                    ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            )}
        >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
        </button>
    );
}
