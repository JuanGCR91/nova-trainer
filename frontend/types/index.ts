// ✅ index.ts - Tipos globales corregidos para frontend/backend
export type Usuario = {
  id: number;
  email: string;
  nombre: string;
  apellido?: string;
  rol: 'admin' | 'supervisor' | 'agente';
  activo: boolean;
  fechaCreacion?: string;
  fechaActualizacion?: string;
};

export type Campo = {
  nombre: string;
  tipo: 'texto' | 'número' | 'fecha' | 'opción';
  requerido: boolean;
};

export type Campana = {
  id: number;
  nombre: string;
  estado: 'activa' | 'finalizada';
  fechaInicio: string;
  fechaFin?: string;
  descripcion?: string;
  creadorId: number;
  creador?: Usuario;
  campos: Campo[];
  prompt: string;
  criteriosEvaluacion?: any;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  clientes?: ClienteSimulado[];
};

export type ClienteSimulado = {
  id: number;
  campanaId: number;
  datos: Record<string, any>;
  estado: 'disponible' | 'asignado' | 'completado';
  asignadoA?: number;
  fechaAsignacion?: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
};

export type Simulacion = {
  id: number;
  clienteId: number;
  usuarioId: number;
  sessionId: string;
  estado: 'en_progreso' | 'completada' | 'cancelada';
  fechaInicio: string;
  fechaFin?: string;
  duracion?: number;
  transcripcion: any[];
  calificacion?: number;
  feedback?: string;
  evaluacion?: any;
  tipificacion?: any;
  fechaCreacion?: string;
  fechaActualizacion?: string;
};
