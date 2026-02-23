import axios from 'axios';

export const api = axios.create({
    baseURL: '/rest',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptor to inject auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add interceptor to handle auth errors (e.g. 401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Optionally handle token refresh or redirect to login here
        return Promise.reject(error);
    }
);
