import axios from 'axios';

/**
 * Configuration de l'instance Axios pour communiquer avec Laravel.
 * 
 * L'URL de base pointe généralement vers le dossier /api de votre Laravel.
 * `withCredentials: true` est CRUCIAL pour Laravel Sanctum, car il permet
 * l'envoi et la réception des cookies d'authentification (XSRF-TOKEN).
 */
const api = axios.create({
    baseURL: 'http://localhost:8000/api', // Remplacez par l'URL de votre backend
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

// Intercepteur pour gérer les requêtes sortantes (ex: rajouter un token si vous n'utilisez pas les cookies)
api.interceptors.request.use(config => {
    // Si vous utilisez JWT au lieu de Sanctum Cookies, vous pourriez faire :
    // const token = localStorage.getItem('token');
    // if (token) {
    //     config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
});

// Intercepteur pour gérer les erreurs globalement
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            // L'utilisateur n'est pas authentifié, le rediriger vers le login
            console.error("Non authentifié - Redirection vers /login");
            // window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);

export default api;
