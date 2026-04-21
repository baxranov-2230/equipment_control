import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    Users,
    Truck,
    Wrench,
    Settings,
    LogOut,
    ChevronsLeft,
    X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth.store';
import { useUIStore } from '@/store/ui.store';
import { Tooltip } from '@/components/ui/Tooltip';
import { cn } from '@/components/ui/utils/button';

const navItems = [
    { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { name: 'Jihozlar', to: '/inventory', icon: Package },
    { name: 'Xodimlar', to: '/employees', icon: Users },
    { name: 'Firmalar', to: '/suppliers', icon: Truck },
    { name: 'Nosozliklar', to: '/requests', icon: Wrench },
    { name: 'Sozlamalar', to: '/settings', icon: Settings },
];

export function Sidebar() {
    const logout = useAuthStore((s) => s.logout);
    const collapsed = useUIStore((s) => s.sidebarCollapsed);
    const toggleSidebar = useUIStore((s) => s.toggleSidebar);
    const mobileOpen = useUIStore((s) => s.mobileSidebarOpen);
    const closeMobile = useUIStore((s) => s.closeMobileSidebar);

    return (
        <>
            {/* Desktop sidebar */}
            <aside
                className={cn(
                    'hidden md:flex fixed left-0 top-0 z-30 min-h-screen flex-col border-r border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 transition-[width] duration-300 ease-out',
                    collapsed ? 'w-20' : 'w-64'
                )}
            >
                <SidebarInner collapsed={collapsed} onLogout={logout} />
                <button
                    onClick={toggleSidebar}
                    aria-label={collapsed ? 'Ochish' : 'Yopish'}
                    className="absolute -right-3 top-20 z-10 hidden md:flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 shadow-sm transition-all hover:scale-110"
                >
                    <ChevronsLeft
                        className={cn(
                            'h-3.5 w-3.5 transition-transform duration-300',
                            collapsed && 'rotate-180'
                        )}
                    />
                </button>
            </aside>

            {/* Mobile sidebar drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden"
                            onClick={closeMobile}
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                            className="fixed left-0 top-0 z-50 flex h-full w-72 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 md:hidden"
                        >
                            <button
                                onClick={closeMobile}
                                aria-label="Yopish"
                                className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            <SidebarInner collapsed={false} onLogout={logout} onNavigate={closeMobile} />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

interface SidebarInnerProps {
    collapsed: boolean;
    onLogout: () => void;
    onNavigate?: () => void;
}

function SidebarInner({ collapsed, onLogout, onNavigate }: SidebarInnerProps) {
    return (
        <div className="flex h-full min-h-screen flex-col">
            {/* Brand */}
            <div
                className={cn(
                    'h-16 flex items-center gap-3 border-b border-slate-200/70 dark:border-slate-800 shrink-0',
                    collapsed ? 'justify-center px-0' : 'px-6'
                )}
            >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-md shadow-primary-600/20">
                    <Package className="h-5 w-5" />
                </div>
                {!collapsed && (
                    <div className="flex flex-col leading-tight overflow-hidden">
                        <span className="font-semibold text-slate-900 dark:text-white truncate">
                            InventoryApp
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            Boshqaruv paneli
                        </span>
                    </div>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
                {!collapsed && (
                    <span className="px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Menyu
                    </span>
                )}
                {navItems.map((item) => (
                    <Tooltip
                        key={item.to}
                        content={item.name}
                        side="right"
                        disabled={!collapsed}
                    >
                        <NavLink
                            to={item.to}
                            onClick={onNavigate}
                            className={({ isActive }) =>
                                cn(
                                    'group relative flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200',
                                    collapsed ? 'justify-center h-11 w-11 mx-auto' : 'px-3 py-2.5 w-full',
                                    isActive
                                        ? 'bg-gradient-to-r from-primary-500/10 to-primary-500/5 text-primary-700 dark:text-primary-400 shadow-sm'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                                )
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && !collapsed && (
                                        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-primary-500" />
                                    )}
                                    <item.icon
                                        className={cn(
                                            'h-5 w-5 shrink-0 transition-transform group-hover:scale-110',
                                            isActive && 'text-primary-600 dark:text-primary-400'
                                        )}
                                    />
                                    {!collapsed && <span className="truncate">{item.name}</span>}
                                </>
                            )}
                        </NavLink>
                    </Tooltip>
                ))}
            </nav>

            {/* Logout */}
            <div
                className={cn(
                    'border-t border-slate-200/70 dark:border-slate-800 shrink-0',
                    collapsed ? 'p-3' : 'p-4'
                )}
            >
                <Tooltip content="Chiqish" side="right" disabled={!collapsed}>
                    <button
                        onClick={onLogout}
                        className={cn(
                            'group flex items-center gap-3 rounded-xl text-sm font-medium transition-colors',
                            collapsed
                                ? 'justify-center h-11 w-11 mx-auto'
                                : 'px-3 py-2.5 w-full',
                            'text-slate-600 dark:text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400'
                        )}
                    >
                        <LogOut className="h-5 w-5 shrink-0" />
                        {!collapsed && <span>Chiqish</span>}
                    </button>
                </Tooltip>
            </div>
        </div>
    );
}
