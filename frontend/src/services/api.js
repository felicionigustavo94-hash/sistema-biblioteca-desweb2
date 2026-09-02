import axios from 'axios';

// Cria o cliente HTTP apontando para o backend Laravel
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Accept': 'application/json',
  },
});

// Interceptor para incluir o token de autenticação em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('biblioteca_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;