import React, { useState } from "react";
import { Campana } from "../../../types/index";
import { Plus, Trash2 } from "lucide-react";

type Campo = {
  nombre: string;
  tipo: "texto" | "número" | "fecha" | "opción";
  requerido: boolean;
};

type CampañaFormProps = {
  onSave: (data: Omit<Campana, "id">) => void;
  onCancel: () => void;
};

export default function CampañaForm({ onSave, onCancel }: CampañaFormProps) {
  const [nombre, setNombre] = useState("");
  const [estado, setEstado] = useState<"activa" | "finalizada">("activa");
  const [fechaInicio, setFechaInicio] = useState("");
  const [prompt, setPrompt] = useState("");
  const [caracteristicas, setCaracteristicas] = useState<Campo[]>([]);
  const [creadorId] = useState<number>(1);

  const [nuevoCampo, setNuevoCampo] = useState<Campo>({
    nombre: "",
    tipo: "texto",
    requerido: false,
  });

  const agregarCampo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoCampo.nombre) return;
    setCaracteristicas([...caracteristicas, nuevoCampo]);
    setNuevoCampo({ nombre: "", tipo: "texto", requerido: false });
  };

  const eliminarCampo = (idx: number) => {
    setCaracteristicas(caracteristicas.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !fechaInicio) return;

    onSave({
      nombre,
      estado,
      fechaInicio,
      prompt,
      campos: caracteristicas,
      creadorId,
    });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
      <h3 className="text-xl font-semibold mb-2 text-ultramar">Nueva campaña</h3>

      <div>
        <label className="block text-sm mb-1 font-medium text-ultramar">Nombre</label>
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-ultramar"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          required
          placeholder="Nombre de la campaña"
        />
      </div>

      <div>
        <label className="block text-sm mb-1 font-medium text-ultramar">Estado</label>
        <select
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          value={estado}
          onChange={e => setEstado(e.target.value as "activa" | "finalizada")}
        >
          <option value="activa">Activa</option>
          <option value="finalizada">Finalizada</option>
        </select>
      </div>

      <div>
        <label className="block text-sm mb-1 font-medium text-ultramar">Fecha de inicio</label>
        <input
          type="date"
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          value={fechaInicio}
          onChange={e => setFechaInicio(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm mb-1 font-medium text-ultramar">Prompt (opcional)</label>
        <textarea
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          rows={2}
          placeholder="Instrucción o contexto para IA"
        />
      </div>

      <div>
        <label className="block text-sm mb-2 font-semibold text-ultramar">Campos personalizados</label>
        <div className="space-y-2 mb-3">
          {caracteristicas.map((campo, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-gray-50 border rounded px-2 py-1">
              <span className="flex-1">
                {campo.nombre} <span className="text-xs text-gray-500">({campo.tipo})</span>
                {campo.requerido && <span className="text-red-600">*</span>}
              </span>
              <button
                type="button"
                onClick={() => eliminarCampo(idx)}
                className="text-red-500 hover:text-red-700"
                title="Eliminar"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          {caracteristicas.length === 0 && (
            <div className="text-gray-400 text-sm">No hay campos agregados aún.</div>
          )}
        </div>

        <form className="flex gap-2 items-center" onSubmit={agregarCampo}>
          <input
            className="flex-1 border border-gray-300 rounded px-2 py-1"
            value={nuevoCampo.nombre}
            onChange={e => setNuevoCampo({ ...nuevoCampo, nombre: e.target.value })}
            placeholder="Nombre del campo"
            required
          />
          <select
            className="border border-gray-300 rounded px-2 py-1"
            value={nuevoCampo.tipo}
            onChange={e => setNuevoCampo({ ...nuevoCampo, tipo: e.target.value as Campo["tipo"] })}
          >
            <option value="texto">Texto</option>
            <option value="número">Número</option>
            <option value="fecha">Fecha</option>
            <option value="opción">Opción</option>
          </select>
          <label className="inline-flex items-center text-xs text-gray-600 ml-2">
            <input
              type="checkbox"
              checked={nuevoCampo.requerido}
              onChange={e => setNuevoCampo({ ...nuevoCampo, requerido: e.target.checked })}
              className="mr-1"
            />
            Requerido
          </label>
          <button
            type="submit"
            className="bg-ultramar text-white rounded px-2 py-1 flex items-center hover:bg-limelime hover:text-graphite transition"
            title="Agregar campo"
          >
            <Plus className="h-4 w-4" />
          </button>
        </form>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          className="bg-ultramar text-white rounded-lg px-4 py-2 font-semibold hover:bg-limelime hover:text-graphite transition"
        >
          Guardar campaña
        </button>
        <button
          type="button"
          className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2 font-semibold hover:bg-gray-300 transition"
          onClick={onCancel}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
