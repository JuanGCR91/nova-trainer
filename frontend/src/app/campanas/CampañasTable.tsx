import React from "react";
import { Trash2, ListOrdered } from "lucide-react";

type Campo = {
  nombre: string;
  tipo: "texto" | "número" | "fecha" | "opción";
  requerido: boolean;
};

type Campana = {
  id: number;
  nombre: string;
  estado: "activa" | "finalizada";
  fechaInicio: string;
  prompt: string;
  campos: Campo[];
  creadorId: number;
};

type Props = {
  campañas: Campana[];
  onDelete: (id: number) => void;
};

export default function CampañasTable({ campañas, onDelete }: Props) {
  if (!campañas.length)
    return (
      <div className="text-center py-12 text-gray-400">
        <ListOrdered className="mx-auto h-10 w-10 mb-2" />
        <div className="font-semibold">Aún no tienes campañas creadas.</div>
      </div>
    );

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto border-collapse rounded-lg shadow-sm text-black">
        <thead className="bg-ultramar text-white">
          <tr>
            <th className="py-2 px-3 text-left">Nombre</th>
            <th className="py-2 px-3 text-left">Estado</th>
            <th className="py-2 px-3 text-left">Fecha inicio</th>
            <th className="py-2 px-3 text-left"># Campos</th>
            <th className="py-2 px-3"></th>
          </tr>
        </thead>
        <tbody>
          {campañas.map((c) => (
            <tr key={c.id} className="odd:bg-white even:bg-gray-50 border-b">
              <td className="py-2 px-3 text-black">{c.nombre}</td>
              <td className="py-2 px-3">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    c.estado === "activa"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {c.estado}
                </span>
              </td>
              <td className="py-2 px-3 text-black">{new Date(c.fechaInicio).toLocaleDateString()}</td>
              <td className="py-2 px-3 text-black">{c.campos.length}</td>
              <td className="py-2 px-3 text-right">
                <button
                  onClick={() => onDelete(c.id)}
                  className="text-red-600 hover:text-red-900 transition"
                  title="Eliminar"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
