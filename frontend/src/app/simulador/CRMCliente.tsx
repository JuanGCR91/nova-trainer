"use client";
import { User, Mail, Phone, Users2, ChevronLeft, Building } from "lucide-react";
import { ClienteSimulado } from "../../../types";

type Props = {
  cliente: ClienteSimulado | null;
  onClose: () => void;
};

export default function CRMCliente({ cliente, onClose }: Props) {
  if (!cliente) {
    return (
      <div className="text-center p-8 text-gray-500">
        <div className="mb-2">No hay cliente asignado</div>
        <button 
          onClick={onClose} 
          className="mt-2 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Cerrar
        </button>
      </div>
    );
  }

  // Acceder a los datos del cliente
  const datos = cliente.datos || {};

  return (
    <div className="w-[340px] sm:w-[380px] bg-white rounded-2xl shadow-2xl p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <User className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-800">Datos del Cliente</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-gray-500 hover:text-gray-700"
          title="Cerrar CRM"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>
      
      <div className="flex flex-col gap-3 mt-2">
        {datos.nombre && (
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-gray-900">
              {datos.nombre} {datos.apellido || ''}
            </span>
          </div>
        )}
        
        {datos.email && (
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-600" />
            <span className="text-gray-700 text-sm">{datos.email}</span>
          </div>
        )}
        
        {datos.telefono && (
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-blue-600" />
            <span className="text-gray-700 text-sm">{datos.telefono}</span>
          </div>
        )}
        
        {datos.segmento && (
          <div className="flex items-center gap-2">
            <Users2 className="h-5 w-5 text-blue-600" />
            <span className="text-gray-700 text-sm">Segmento: {datos.segmento}</span>
          </div>
        )}
        
        {cliente.campana && (
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-blue-600" />
            <span className="text-gray-700 text-sm">Campaña: {cliente.campana.nombre}</span>
          </div>
        )}
        
        {/* Mostrar otros campos dinámicos */}
        {Object.entries(datos).map(([key, value]) => {
          // Omitir campos ya mostrados
          if (['nombre', 'apellido', 'email', 'telefono', 'segmento'].includes(key)) {
            return null;
          }
          return (
            <div key={key} className="flex items-start gap-2">
              <span className="text-gray-600 text-sm capitalize">{key}:</span>
              <span className="text-gray-700 text-sm">{String(value)}</span>
            </div>
          );
        })}
        
        <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
          <span>ID: {cliente.id}</span>
          <span>|</span>
          <span>Estado: {cliente.estado}</span>
        </div>
      </div>
    </div>
  );
}