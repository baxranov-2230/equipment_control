import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Users, Truck, Wrench, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';

const navItems = [
    { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { name: 'Jihozlar', to: '/inventory', icon: Package },
    { name: 'Xodimlar', to: '/employees', icon: Users },
    { name: 'Firmalar', to: '/suppliers', icon: Truck },
    { name: 'Nosozliklar', to: '/requests', icon: Wrench },
    { name: 'Sozlamalar', to: '/settings', icon: Settings },
];

export function Sidebar() {
    const logout = useAuthStore((state) => state.logout);

    return (
        <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex min-h-screen fixed left-0 top-0">
            <div className="h-16 flex items-center px-6 bg-slate-950 font-bold text-lg text-white gap-2">
                <Package className="w-6 h-6 text-primary-500" />
                <span>InventoryApp</span>
            </div>
            <nav className="flex-1 py-4 flex flex-col gap-1 px-3">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive
                                ? 'bg-primary-600/10 text-primary-500 font-medium'
                                : 'hover:bg-slate-800 hover:text-white'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5" />
                        {item.name}
                    </NavLink>
                ))}
            </nav>
            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-lg transition-colors hover:bg-slate-800 hover:text-white text-slate-400"
                >
                    <LogOut className="w-5 h-5" />
                    Chiqish
                </button>
            </div>
        </aside>
    );
}
