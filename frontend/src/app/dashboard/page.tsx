'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Card } from '@/components/ui/Card';
import { Usuario, Campana } from '@/../types';
import axios from 'axios';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { BarChart3, Users, Star, Activity, FolderOpen } from 'lucide-react';

interface DashboardStats {
  totalSimulaciones: number;
  simulacionesHoy: number;
  promedioCalificacion: number;
  campanasActivas: number;
}

const COLORS = ['#0ea5e9', '#facc15', '#22d3ee', '#a78bfa', '#f472b6'];

const dataSimulaciones = [
  { fecha: 'Lun', simulaciones: 8 },
  { fecha: 'Mar', simulaciones: 10 },
  { fecha: 'Mié', simulaciones: 6 },
  { fecha: 'Jue', simulaciones: 12 },
  { fecha: 'Vie', simulaciones: 7 },
  { fecha: 'Sáb', simulaciones: 2 },
  { fecha: 'Dom', simulaciones: 0 },
];

const dataPie = [
  { name: '90-100', value: 22 },
  { name: '80-89', value: 12 },
  { name: '70-79', value: 7 },
  { name: '60-69', value: 3 },
  { name: '0-59', value: 1 },
];

const Dashboard = () => {
  const { usuario } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalSimulaciones: 0,
    simulacionesHoy: 0,
    promedioCalificacion: 0,
    campanasActivas: 0
  });
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [campanasDisponibles, setCampanasDisponibles] = useState<Campana[]>([]);
  const [selectedCampana, setSelectedCampana] = useState<string>('');
  const [supervisorId, setSupervisorId] = useState<number | null>(null);

  const cargarDatos = useCallback(async () => {
    try {
      // Simulación: usa datos de ejemplo
      setStats({
        totalSimulaciones: 45,
        simulacionesHoy: 12,
        promedioCalificacion: 85,
        campanasActivas: 3
      });

      if (usuario?.rol === 'admin' || usuario?.rol === 'supervisor') {
        const usuariosResponse = await axios.get('/usuarios');
        setUsuarios(usuariosResponse.data);
      }
      const campanasResponse = await axios.get('/campanas');
      setCampanasDisponibles(campanasResponse.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  }, [usuario?.rol]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f7fb] via-[#e0e7ff] to-[#a5b4fc]">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold text-ultramar mb-8 flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-ultramar" /> Dashboard
        </h1>

        {/* Gráficos principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Gráfico de simulaciones por día */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" /> Simulaciones por día
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={dataSimulaciones}>
                <defs>
                  <linearGradient id="colorSim" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="fecha" />
                <YAxis allowDecimals={false}/>
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area type="monotone" dataKey="simulaciones" stroke="#3b82f6" fill="url(#colorSim)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Pie de calificaciones */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" /> Distribución de Calificaciones
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={dataPie}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={65}
                  innerRadius={30}
                  label
                >
                  {dataPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36}/>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 flex items-center gap-3">
            <Activity className="h-7 w-7 text-blue-500" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Simulaciones</h3>
              <p className="text-2xl font-bold mt-2">{stats.totalSimulaciones}</p>
            </div>
          </Card>

          <Card className="p-6 flex items-center gap-3">
            <Users className="h-7 w-7 text-sky-500" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Simulaciones Hoy</h3>
              <p className="text-2xl font-bold mt-2">{stats.simulacionesHoy}</p>
            </div>
          </Card>

          <Card className="p-6 flex items-center gap-3">
            <Star className="h-7 w-7 text-yellow-500" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Promedio Calificación</h3>
              <p className="text-2xl font-bold mt-2">{stats.promedioCalificacion}%</p>
            </div>
          </Card>

          <Card className="p-6 flex items-center gap-3">
            <FolderOpen className="h-7 w-7 text-violet-500" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Campañas Activas</h3>
              <p className="text-2xl font-bold mt-2">{stats.campanasActivas}</p>
            </div>
          </Card>
        </div>

        {/* Panel de administración */}
        {usuario?.rol === 'admin' && (
          <div className="bg-white rounded-2xl shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-ultramar">Panel de Administración</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supervisor
                </label>
                <select
                  value={supervisorId?.toString() || ''}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                    setSupervisorId(e.target.value ? Number(e.target.value) : null)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos los supervisores</option>
                  {usuarios
                    .filter((u: Usuario) => u.rol === 'supervisor')
                    .map((supervisor: Usuario) => (
                      <option key={supervisor.id} value={supervisor.id}>
                        {supervisor.nombre} {supervisor.apellido}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaña
                </label>
                <select
                  value={selectedCampana}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                    setSelectedCampana(e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todas las campañas</option>
                  {campanasDisponibles.map((campana: Campana) => (
                    <option key={campana.id} value={campana.id}>
                      {campana.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Lista de usuarios (para admin/supervisor) */}
        {(usuario?.rol === 'admin' || usuario?.rol === 'supervisor') && usuarios.length > 0 && (
          <div className="bg-white rounded-2xl shadow mb-10">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-semibold text-ultramar">Usuarios del Sistema</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {usuarios.map((u: Usuario) => (
                    <tr key={u.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {u.nombre} {u.apellido}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {u.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${u.rol === 'admin' ? 'bg-purple-100 text-purple-800' : 
                            u.rol === 'supervisor' ? 'bg-blue-100 text-blue-800' : 
                            'bg-green-100 text-green-800'}`}>
                          {u.rol}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${u.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {u.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
