import axios from 'axios';
import { MOCK_ATTENDANCE, MOCK_DEPARTMENTS, MOCK_SETTINGS, MOCK_USERS } from '../mocks';

// Helper to check if demo mode is active
const isDemoMode = () => localStorage.getItem('demo_mode') === 'true';

// --- CONFIGURACIÓN ---
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
axios.defaults.baseURL = API_BASE_URL;

const FACE_API_URL = `${API_BASE_URL}/api/v1/face`;
const SETTINGS_API_URL = `${API_BASE_URL}/api/v1/settings`;

// --- CONFIGURACIÓN AXIOS ---
// Agregamos un interceptor para incluir el token en todas las peticiones
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});


export const api = {
    // --- RECONOCIMIENTO FACIAL ---
    recognizeFace: async (image: string) => {
        if (isDemoMode()) {
            return { recognized: true, name: 'Dr. Gregory House', confidence: 0.98, message: 'Face recognized' };
        }
        const response = await axios.post(`${FACE_API_URL}/recognize`, { image });
        return response.data;
    },

    registerFace: async (name: string, image: string) => {
        if (isDemoMode()) {
            return { id: 'new-u', name, owner_id: 'demo-org', status: 'active' };
        }
        const response = await axios.post(`${FACE_API_URL}/register`, { name, image });
        return response.data;
    },

    getAttendance: async () => {
        if (isDemoMode()) return MOCK_ATTENDANCE;
        const response = await axios.get(`${FACE_API_URL}/attendance`);
        return response.data;
    },

    getUsers: async () => {
        if (isDemoMode()) return MOCK_USERS;
        const response = await axios.get(`${FACE_API_URL}/users`);
        return response.data;
    },

    // --- SETTINGS (NUEVA FUNCIONALIDAD) ---
    getSettings: async () => {
        if (isDemoMode()) return MOCK_SETTINGS;
        const token = localStorage.getItem('auth_token');
        const headers: HeadersInit = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${SETTINGS_API_URL}/`, { headers });
        if (!response.ok) throw new Error('Failed to fetch settings');
        return response.json();
    },

    updateSettings: async (settings: any) => {
        if (isDemoMode()) return { ...MOCK_SETTINGS, ...settings };
        const token = localStorage.getItem('auth_token');
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${SETTINGS_API_URL}/`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(settings),
        });
        if (!response.ok) throw new Error('Failed to update settings');
        return response.json();
    },

    // --- GENERIC METHODS ---
    get: async (url: string) => {
        if (isDemoMode()) {
            if (url.includes('/api/v1/departments/')) return { data: MOCK_DEPARTMENTS };
            return { data: [] };
        }
        return axios.get(url);
    },
    post: async (url: string, data?: any) => {
        if (isDemoMode()) return { data: { message: 'Demo success', ...data } };
        return axios.post(url, data);
    },
    delete: async (url: string) => {
        if (isDemoMode()) return { data: { message: 'Demo delete success' } };
        return axios.delete(url);
    },
    put: async (url: string, data?: any) => {
        if (isDemoMode()) return { data: { message: 'Demo success', ...data } };
        return axios.put(url, data);
    }
};


