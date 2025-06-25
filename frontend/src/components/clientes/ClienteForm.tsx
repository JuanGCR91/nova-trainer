import React, { useState, useEffect } from "react";
import { ClienteSimulado } from "../../../types";

export type Campo = {
  nombre: string;
  tipo: "texto" | "número" | "fecha" | "opción";
  requerido: boolean;
};

type Props = {
  cliente?: ClienteSimulado;
  campos: Campo[];
  loading: boolean;
  onSave: (datos: FormData) => Promise<void>;
  onCancel: () => void;
};

export default function ClienteForm({ cliente, campos, loading, onSave, onCancel }: Props) {
  const [form, setForm] = useState<Record<string, string>>( {} );

  useEffect(() => {
    if (cliente?.datos) {
      const datosIniciales: Record<string, string> = {};
      campos.forEach(c => {
        const valor = cliente.datos?.[c.nombre];
        datosIniciales[c.nombre] = valor !== undefined && valor !== null ? String(valor) : "";
      });
      setForm(datosIniciales);
    } else {
      const vacios: Record<string, string> = {};
      campos.forEach(c => (vacios[c.nombre] = ""));
      setForm(vacios);
    }
  }, [cliente, campos]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const datosFormateados: Record<string, string | number | Date | null> = {};

    for (const campo of campos) {
      let valor = form[campo.nombre];

      if (campo.requerido && !valor) {
        alert(`El campo "${campo.nombre}" es obligatorio.`);
        return;
      }

      switch (campo.tipo) {
        case "número":
          datosFormateados[campo.nombre] = valor ? Number(valor) : null;
          break;
        case "fecha":
          datosFormateados[campo.nombre] = valor ? new Date(valor) : null;
          break;
        default:
          datosFormateados[campo.nombre] = valor || "";
      }
    }

    const formData = new FormData();
    formData.append("datos", JSON.stringify(datosFormateados));
    await onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {campos.map((campo) => (
        <div key={campo.nombre}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {campo.nombre}{campo.requerido && <span className="text-red-600"> *</span>}
          </label>
          <input
            name={campo.nombre}
            value={form[campo.nombre] || ""}
            onChange={handleChange}
            required={campo.requerido}
            type={campo.tipo === "número" ? "number" : campo.tipo === "fecha" ? "date" : "text"}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ))}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Guardar cliente"}
        </button>
      </div>
    </form>
  );
}
