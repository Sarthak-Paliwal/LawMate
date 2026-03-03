import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

/* -------------------- Attach Token -------------------- */

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lawmate-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* -------------------- Global Error Handling -------------------- */

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('lawmate-token');
      window.location.replace('/login'); // better than href
    }
    return Promise.reject(error);
  }
);

export default api;
