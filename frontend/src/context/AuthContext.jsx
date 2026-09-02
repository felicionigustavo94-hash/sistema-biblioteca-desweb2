import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ao carregar a página, verifica se já existe login salvo
  useEffect(() => {
    async function checkUserLoggedIn() {
      const token = localStorage.getItem('biblioteca_token');
      if (token) {
        try {
          const response = await api.get('/auth/me');
          setUser(response.data.user);
        } catch (error) {
          console.error('Sessão expirada:', error);
          localStorage.removeItem('biblioteca_token');
          localStorage.removeItem('biblioteca_user');
          setUser(null);
        }
      }
      setLoading(false);
    }

    checkUserLoggedIn();
  }, []);

  // Função para fazer Login
  async function login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    const { token, user: loggedUser } = response.data;

    localStorage.setItem('biblioteca_token', token);
    localStorage.setItem('biblioteca_user', JSON.stringify(loggedUser));
    setUser(loggedUser);
    return loggedUser;
  }

  // Função para Registrar novo usuário
  async function register(userData) {
    const response = await api.post('/auth/register', userData);
    const { token, user: newUser } = response.data;

    localStorage.setItem('biblioteca_token', token);
    localStorage.setItem('biblioteca_user', JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  }

  // Função para Deslogar
  async function logout() {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Mesmo se a rota falhar, limpamos localmente
    }
    localStorage.removeItem('biblioteca_token');
    localStorage.removeItem('biblioteca_user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}