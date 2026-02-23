import { api } from '@/services/api';
import type { User } from '@/types/common.types';

export interface LoginPayload {
    username: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
}

export const authApi = {
    login: async (data: LoginPayload): Promise<LoginResponse> => {
        const response = await api.post('/auth/login', data);
        return response.data;
    },

    getMe: async (): Promise<User> => {
        const response = await api.get('/auth/me');
        return response.data;
    },
};
