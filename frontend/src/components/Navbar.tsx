// frontend/src/components/Navbar.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  PhoneIcon, 
  ChartBarIcon, 
  UsersIcon, 
  ClipboardListIcon,
  HistoryIcon,
  SettingsIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
  UserIcon
} from 'lucide-react';

const Navbar: React.FC = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const pathname = usePathname();
  const { usuario, logout } = useAuth();

  if (!usuario) return null;

  const menuItems = [
    {
      nombre: 'Simulador',
      href: '/simulador',
      icono: PhoneIcon,
      roles: ['agente', 'supervisor', 'admin']
    },
    {
      nombre: 'Dashboard',
      href: '/dashboard',
      icono: ChartBarIcon,
      roles: ['agente', 'supervisor', 'admin']
    },
    {
      nombre: 'Campañas',
      href: '/campanas',
      icono: ClipboardListIcon,
      roles: ['supervisor', 'admin']
    },
    {
      nombre: 'Clientes',
      href: '/clientes',
      icono: UsersIcon,
      roles: ['supervisor', 'admin']
    },
    {
      nombre: 'Historial',
      href: '/historial',
      icono: HistoryIcon,
      roles: ['agente', 'supervisor', 'admin']
    },
    {
      nombre: 'Usuarios',
      href: '/usuarios',
      icono: UserIcon,
      roles: ['admin']
    },
    {
      nombre: 'Admin',
      href: '/admin/dashboard',
      icono: SettingsIcon,
      roles: ['admin']
    }
  ];

  const itemsVisibles = menuItems.filter(item => 
    item.roles.includes(usuario.rol)
  );

  const esRutaActiva = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="text-xl font-bold text-blue-600">
                Nova Trainer
              </Link>
            </div>

            {/* Menu desktop */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {itemsVisibles.map((item) => {
                const Icono = item.icono;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      esRutaActiva(item.href)
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <Icono className="mr-2" size={16} />
                    {item.nombre}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Info usuario y logout */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                <p className="font-medium">{usuario.nombre} {usuario.apellido}</p>
                <p className="text-xs text-gray-500">{usuario.rol}</p>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 text-gray-500 hover:text-gray-700"
              >
                <LogOutIcon size={18} />
                <span className="text-sm">Salir</span>
              </button>
            </div>
          </div>

          {/* Botón menú móvil */}
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {menuAbierto ? (
                <XIcon className="block h-6 w-6" />
              ) : (
                <MenuIcon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {menuAbierto && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {itemsVisibles.map((item) => {
              const Icono = item.icono;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    esRutaActiva(item.href)
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                  }`}
                  onClick={() => setMenuAbierto(false)}
                >
                  <div className="flex items-center">
                    <Icono className="mr-3" size={18} />
                    {item.nombre}
                  </div>
                </Link>
              );
            })}
          </div>
          
          {/* Info usuario móvil */}
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <UserIcon className="h-10 w-10 text-gray-400" />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">
                  {usuario.nombre} {usuario.apellido}
                </div>
                <div className="text-sm font-medium text-gray-500">
                  {usuario.email}
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <button
                onClick={() => {
                  logout();
                  setMenuAbierto(false);
                }}
                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;