import axios from 'axios';

// --- CONFIGURACIÓN ---
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
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
        const response = await axios.post(`${FACE_API_URL}/recognize`, { image });
        return response.data;
    },

    registerFace: async (name: string, image: string) => {
        const response = await axios.post(`${FACE_API_URL}/register`, { name, image });
        return response.data;
    },

    getAttendance: async () => {
        const response = await axios.get(`${FACE_API_URL}/attendance`);
        return response.data;
    },

    getUsers: async () => {
        const response = await axios.get(`${FACE_API_URL}/users`);
        return response.data;
    },

    // --- SETTINGS (NUEVA FUNCIONALIDAD) ---
    getSettings: async () => {
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
    }
};
