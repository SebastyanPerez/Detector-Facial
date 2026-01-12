// --- EDUCATIONAL COMMENT: Cliente HTTP (Axios) ---
// Axios es una librería para hacer peticiones al backend (como fetch, pero más fácil).
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1/face';

export const api = {
    // --- EDUCATIONAL COMMENT: Funciones Asíncronas (async/await) ---
    // Las peticiones al servidor toman tiempo. 'async' le dice a JS que esta función
    // esperará operaciones lentas. 'await' pausa la ejecución hasta que el servidor responda.
    recognizeFace: async (image: string) => {
        // image is base64 string
        const response = await axios.post(`${API_URL}/recognize`, { image });
        return response.data;
    },

    registerFace: async (name: string, image: string) => {
        const response = await axios.post(`${API_URL}/register`, { name, image });
        return response.data;
    },

    getAttendance: async () => {
        const response = await axios.get(`${API_URL}/attendance`);
        return response.data;
    },

    getUsers: async () => {
        const response = await axios.get(`${API_URL}/users`);
        return response.data;
    }
};
