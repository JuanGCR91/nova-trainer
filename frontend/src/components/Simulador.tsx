"use client";
import { useState } from "react";
import { PhoneCall, RefreshCw } from "lucide-react";
import CRMCliente from "@/app/simulador/CRMCliente";
import { useClienteSimulado } from "@/hooks/useClienteSimulado";
import { useAuth } from "@/contexts/AuthContext";

export default function SimuladorWidget() {
  const [abierto, setAbierto] = useState(false);
  const { clienteSeleccionado, solicitarClienteAleatorio, cargando, error } = useClienteSimulado();
  const { usuario } = useAuth();
  const [campanaId] = useState(1); // Asegura manejo reactivo futuro

  const handleSolicitarCliente = async () => {
    await solicitarClienteAleatorio(campanaId);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
      {!clienteSeleccionado && !abierto && (
        <button
          className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-700 transition font-semibold"
          onClick={handleSolicitarCliente}
          disabled={cargando}
        >
          <RefreshCw className={`h-5 w-5 ${cargando ? 'animate-spin' : ''}`} />
          {cargando ? 'Solicitando...' : 'Solicitar Cliente'}
        </button>
      )}

      {clienteSeleccionado && !abierto && (
        <button
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition font-bold text-lg"
          onClick={() => setAbierto(true)}
        >
          <PhoneCall className="h-6 w-6" /> Iniciar llamada
        </button>
      )}

      {abierto && (
        <div className="animate-slideIn">
          <CRMCliente cliente={clienteSeleccionado} onClose={() => setAbierto(false)} />
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-2">
          {error}
        </div>
      )}

      <style jsx>{`
        .animate-slideIn {
          animation: slideInCRM .3s cubic-bezier(.4,0,.2,1);
        }
        @keyframes slideInCRM {
          from { transform: translateX(80px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
