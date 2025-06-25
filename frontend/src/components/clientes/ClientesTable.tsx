import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { ClienteSimulado } from "../../../types";

type Props = {
  clientes: ClienteSimulado[];
  onEdit: (c: ClienteSimulado) => void;
  onDelete: (id: number) => void;
};

export default function ClientesTable({ clientes, onEdit, onDelete }: Props) {
  if (!clientes.length) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p className="text-lg">No hay clientes registrados aún.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-200 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left py-2 px-3">ID</th>
            <th className="text-left py-2 px-3">Datos</th>
            <th className="text-left py-2 px-3">Estado</th>
            <th className="text-right py-2 px-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((c) => (
            <tr key={c.id} className="border-b">
              <td className="py-2 px-3">{c.id}</td>
              <td className="py-2 px-3">
                {Object.entries(c.datos || {}).map(([key, value]) => (
                  <div key={key}>
                    <span className="font-semibold text-gray-700 mr-1">{key}:</span>
                    <span className="text-gray-600">{String(value)}</span>
                  </div>
                ))}
              </td>
              <td className="py-2 px-3 text-sm">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  c.estado === "disponible"
                    ? "bg-green-100 text-green-700"
                    : c.estado === "asignado"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-200 text-gray-500"
                }`}>
                  {c.estado}
                </span>
              </td>
              <td className="py-2 px-3 text-right">
                <button
                  onClick={() => onEdit(c)}
                  className="text-blue-600 hover:text-blue-800 mr-3"
                  title="Editar"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(c.id)}
                  className="text-red-600 hover:text-red-800"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
