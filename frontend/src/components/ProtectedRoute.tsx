// frontend/src/components/ProtectedRoute.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  rolesPermitidos?: string[];
  redirigirA?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  rolesPermitidos,
  redirigirA = '/login'
}) => {
  const { usuario, cargando } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!cargando) {
      if (!usuario) {
        router.push(redirigirA);
      } else if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) {
        // Si el usuario no tiene el rol permitido, redirigir a su dashboard por defecto
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
            router.push('/');
        }
      }
    }
  }, [usuario, cargando, rolesPermitidos, router, redirigirA]);

  // Mostrar loading mientras se verifica la autenticación
  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // No mostrar nada si no hay usuario
  if (!usuario) {
    return null;
  }

  // No mostrar nada si el usuario no tiene el rol permitido
  if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) {
    return null;
  }

  // Mostrar el contenido si todo está bien
  return <>{children}</>;
};