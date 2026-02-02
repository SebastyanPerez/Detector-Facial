import axios from 'axios';

// --- CONFIGURACIÓN LOCAL FORZADA ---
// El usuario solicitó explícitamente no usar la nube para ahorrar costos.
const API_BASE_URL = 'http://localhost:8000';
const FACE_API_URL = `${API_BASE_URL}/api/v1/face`;
const SETTINGS_API_URL = `${API_BASE_URL}/api/v1/settings`;

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
        const response = await fetch(`${SETTINGS_API_URL}/`);
        if (!response.ok) throw new Error('Failed to fetch settings');
        return response.json();
    },

    updateSettings: async (settings: any) => {
        const response = await fetch(`${SETTINGS_API_URL}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings),
        });
        if (!response.ok) throw new Error('Failed to update settings');
        return response.json();
    }
};
