'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Mail, Lock, AlertCircle } from 'lucide-react'; // Asegúrate de tener lucide-react instalado

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const { login, usuario } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (usuario) {
      switch (usuario.rol) {
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
    }
  }, [usuario, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      await login(email, password);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Error al iniciar sesión');
      } else {
        setError('Error al iniciar sesión');
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f7f7fb] via-[#e0e7ff] to-[#a5b4fc]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10 space-y-8">
        {/* Encabezado con logo */}
        <div className="flex flex-col items-center gap-2">
          {/* Cambia por tu logo real */}
          <img src="/logo-nova.svg" alt="Nova Trainer" className="h-12 w-auto" />
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Nova Trainer</h2>
          <span className="text-sm text-gray-600">Entrena, evoluciona, trasciende.</span>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-500">
                  <Mail className="h-5 w-5" />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
                  placeholder="tucorreo@empresa.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-500">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
                  placeholder="Tu contraseña"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 text-sm text-gray-900">
                Recordarme
              </label>
            </div>

            <Link href="/login/recover" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full flex justify-center items-center gap-2 py-2 px-4 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-white shadow-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cargando && (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            )}
            {cargando ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>

          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-4 bg-gray-100 rounded-md text-sm text-gray-600">
              <p className="font-semibold mb-2">Credenciales de prueba:</p>
              <p>Admin: admin@novatrainer.com / admin123</p>
              <p>Supervisor: supervisor@novatrainer.com / super123</p>
              <p>Agente: agente@novatrainer.com / agente123</p>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} Qtech Experience · <Link href="/soporte" className="underline">Soporte</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
