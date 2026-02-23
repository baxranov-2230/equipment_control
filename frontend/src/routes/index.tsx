import { Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import { AuthLayout } from '@/layouts/AuthLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';

// Pages
import DashboardPage from '@/pages/Dashboard';
import LoginPage from '@/pages/Login';
import InventoriesPage from '@/pages/Inventories';
import EmployeesPage from '@/pages/Employees';
import SuppliersPage from '@/pages/Suppliers';
import RequestsPage from '@/pages/Requests';

export function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
                <Route element={<DashboardLayout />}>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/inventory" element={<InventoriesPage />} />
                    <Route path="/employees" element={<EmployeesPage />} />
                    <Route path="/suppliers" element={<SuppliersPage />} />
                    <Route path="/requests" element={<RequestsPage />} />
                    {/* Add more protected routes here */}
                </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
