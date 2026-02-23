import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { AxiosError } from 'axios';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { loginSchema, type LoginFormInputs } from '../schemas/auth.schema';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '@/store/auth.store';

export function LoginForm() {
    const [serverError, setServerError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormInputs>({
        resolver: yupResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormInputs) => {
        setServerError('');
        setIsLoading(true);
        try {
            // 1. Authenticate and get token
            const res = await authApi.login(data);
            localStorage.setItem('access_token', res.access_token);

            // 2. Fetch user profile
            const userRes = await authApi.getMe();

            // 3. Set global auth state and redirect
            setAuth(userRes, res.access_token);
            navigate('/dashboard', { replace: true });
        } catch (err: unknown) {
            if (err instanceof AxiosError && err.response?.status === 401) {
                setServerError('Login yoki parol xato');
            } else {
                setServerError('Tizimda xatolik yuz berdi');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {serverError && (
                <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm text-center">
                    {serverError}
                </div>
            )}

            <div>
                <label
                    htmlFor="username"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                    Foydalanuvchi nomi
                </label>
                <Input
                    id="username"
                    type="text"
                    placeholder="admin"
                    {...register('username')}
                    error={errors.username?.message}
                />
            </div>

            <div className="pt-2">
                <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                    Parol
                </label>
                <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...register('password')}
                    error={errors.password?.message}
                />
            </div>

            <div className="pt-4">
                <Button className="w-full flex items-center gap-2" type="submit" disabled={isLoading}>
                    <LogIn className="w-4 h-4" />
                    {isLoading ? 'Yuklanmoqda...' : 'Kirish'}
                </Button>
            </div>
        </form>
    );
}
