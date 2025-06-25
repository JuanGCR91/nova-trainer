// frontend/src/app/historial/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { 
  CalendarIcon, 
  ClockIcon, 
  StarIcon, 
  DownloadIcon,
  FilterIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from 'lucide-react';

interface DatosCliente {
  nombre?: string;
  apellido?: string;
  dni?: string;
  edad?: number;
  telefono?: string;
  email?: string;
  [key: string]: string | number | boolean | undefined;
}

interface Simulacion {
  id: number;
  fechaInicio: string;
  fechaFin?: string;
  duracion?: number;
  estado: string;
  calificacion?: number;
  cliente: {
    datos: DatosCliente;
    campana: {
      nombre: string;
    };
  };
}

const HistorialPage: React.FC = () => {
  const { usuario } = useAuth();
  const [simulaciones, setSimulaciones] = useState<Simulacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [filtros, setFiltros] = useState({
    campanaId: '',
    fechaInicio: '',
    fechaFin: ''
  });

  const limite = 10;

  const cargarHistorial = useCallback(async () => {
    try {
      setCargando(true);
      const params = new URLSearchParams({
        limite: limite.toString(),
        offset: ((paginaActual - 1) * limite).toString(),
        ...filtros
      });

      const response = await axios.get(
        `/simulador/historial/${usuario?.id}?${params}`
      );

      setSimulaciones(response.data.simulaciones);
      setTotalPaginas(response.data.totalPaginas);
    } catch (error) {
      console.error('Error al cargar historial:', error);
    } finally {
      setCargando(false);
    }
  }, [paginaActual, filtros, usuario?.id, limite]);

  useEffect(() => {
    if (usuario?.id) {
      cargarHistorial();
    }
  }, [cargarHistorial, usuario?.id]);

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatearDuracion = (segundos?: number) => {
    if (!segundos) return 'N/A';
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins}m ${secs}s`;
  };

  const obtenerColorCalificacion = (calificacion?: number) => {
    if (!calificacion) return 'text-gray-500';
    if (calificacion >= 80) return 'text-green-600';
    if (calificacion >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const descargarReporte = async (simulacionId: number) => {
    try {
      // TODO: Implementar descarga de reporte
      console.log('Descargando reporte de simulación:', simulacionId);
    } catch (error) {
      console.error('Error al descargar reporte:', error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                Historial de Simulaciones
              </h1>
              <p className="text-gray-600 mt-1">
                Revisa tu desempeño en simulaciones anteriores
              </p>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <FilterIcon size={18} className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Filtros:
                  </span>
                </div>
                
                <input
                  type="date"
                  value={filtros.fechaInicio}
                  onChange={(e) => setFiltros({...filtros, fechaInicio: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Desde"
                />
                
                <input
                  type="date"
                  value={filtros.fechaFin}
                  onChange={(e) => setFiltros({...filtros, fechaFin: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Hasta"
                />
                
                <button
                  onClick={() => {
                    setFiltros({ campanaId: '', fechaInicio: '', fechaFin: '' });
                    setPaginaActual(1);
                  }}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Limpiar filtros
                </button>
              </div>
            </div>

            {/* Tabla de simulaciones */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {cargando ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : simulaciones.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No se encontraron simulaciones
                </div>
              ) : (
                <>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Campaña / Cliente
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Duración
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Calificación
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {simulaciones.map((simulacion) => {
                        const datos = simulacion.cliente.datos;

                        return (
                          <tr key={simulacion.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center text-sm text-gray-900">
                                <CalendarIcon size={16} className="mr-2 text-gray-400" />
                                {formatearFecha(simulacion.fechaInicio)}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm">
                                <p className="font-medium text-gray-900">
                                  {simulacion.cliente.campana.nombre}
                                </p>
                                <p className="text-gray-500">
                                  {datos.nombre || 'Sin nombre'} {datos.apellido || ''}
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center text-sm text-gray-900">
                                <ClockIcon size={16} className="mr-2 text-gray-400" />
                                {formatearDuracion(simulacion.duracion)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {simulacion.calificacion ? (
                                <div className="flex items-center">
                                  <StarIcon
                                    size={16}
                                    className={`mr-1 ${obtenerColorCalificacion(simulacion.calificacion)}`}
                                    fill="currentColor"
                                  />
                                  <span className={`text-sm font-medium ${obtenerColorCalificacion(simulacion.calificacion)}`}>
                                    {simulacion.calificacion}%
                                  </span>
                                </div>
                              ) : (
                                <span className="text-sm text-gray-500">-</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                simulacion.estado === 'completada'
                                  ? 'bg-green-100 text-green-800'
                                  : simulacion.estado === 'en_progreso'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {simulacion.estado === 'completada'
                                  ? 'Completada'
                                  : simulacion.estado === 'en_progreso'
                                  ? 'En progreso'
                                  : 'Cancelada'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <button
                                onClick={() => descargarReporte(simulacion.id)}
                                className="text-blue-600 hover:text-blue-900 flex items-center"
                                disabled={simulacion.estado !== 'completada'}
                              >
                                <DownloadIcon size={16} className="mr-1" />
                                Descargar
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* Paginación */}
                  <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                        disabled={paginaActual === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        Anterior
                      </button>
                      <button
                        onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
                        disabled={paginaActual === totalPaginas}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        Siguiente
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Página <span className="font-medium">{paginaActual}</span> de{' '}
                          <span className="font-medium">{totalPaginas}</span>
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                          <button
                            onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                            disabled={paginaActual === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                          >
                            <ChevronLeftIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
                            disabled={paginaActual === totalPaginas}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                          >
                            <ChevronRightIcon className="h-5 w-5" />
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default HistorialPage;