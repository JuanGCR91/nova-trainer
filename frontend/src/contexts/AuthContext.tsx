// frontend/src/contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';

interface Usuario {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  rol: string;
  activo: boolean;
}

interface LoginResponse {
  success: boolean;
  usuario: Usuario;
  token: string;
}

interface AuthContextType {
  usuario: Usuario | null;
  cargando: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  verificarToken: () => Promise<void>;
}

interface ErrorResponse {
  error: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Configurar axios para incluir el token en todas las peticiones
axios.defaults.baseURL = API_URL;

// Interceptor para incluir el token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
axios.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token inválido o expirado
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);
  const router = useRouter();

  useEffect(() => {
    verificarToken();
  }, []);

  const verificarToken = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setCargando(false);
        return;
      }

      // Verificar que el token es válido
      await axios.get('/auth/verify');
      
      // Si el token es válido, recuperar el usuario del localStorage
      const usuarioGuardado = localStorage.getItem('usuario');
      if (usuarioGuardado) {
        setUsuario(JSON.parse(usuarioGuardado));
      }
    } catch (error) {
      console.error('Error al verificar token:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
    } finally {
      setCargando(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post<LoginResponse>('/auth/login', { email, password });
      const { usuario: usuarioData, token } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuarioData));
      
      setUsuario(usuarioData);

      // Redirigir según el rol
      switch (usuarioData.rol) {
        case 'admin':
          router.push('/admin/dashboard');
          break;
        case 'supervisor':
          router.push('/dashboard');
          break;
        case 'agente':
          router.push('/simulador');
          break;
        default:
          router.push('/dashboard');
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const mensaje = axiosError.response?.data?.error || 'Error al iniciar sesión';
      throw new Error(mensaje);
    }
  };

  const logout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      setUsuario(null);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        usuario, 
        cargando, 
        login, 
        logout, 
        verificarToken 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};