import { LoginForm } from '@/features/auth/components/LoginForm';
import { Package } from 'lucide-react';

export default function LoginPage() {
    return (
        <div className="bg-white dark:bg-slate-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200 dark:border-slate-700">
            <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6 flex flex-col items-center">
                <div className="bg-primary-500/10 p-3 rounded-xl mb-4">
                    <Package className="h-10 w-10 text-primary-600 dark:text-primary-400" />
                </div>
                <h2 className="text-center text-2xl font-bold text-slate-900 dark:text-white">
                    Tizimga kirish
                </h2>
                <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
                    Jihozlar aylanmasini boshqarish tizimi
                </p>
            </div>

            <LoginForm />
        </div>
    );
}
