// ✅ UsuarioForm.tsx corregido para tipado completo y compatibilidad con Usuario
import { useState, useEffect } from "react";
import { Usuario } from "../../../types";

export default function UsuarioForm({
  onSave,
  onCancel,
  loading,
  usuario,
}: {
  onSave: (data: Omit<Usuario, "id">) => void;
  onCancel: () => void;
  loading?: boolean;
  usuario?: Usuario | null;
}) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (usuario) {
      setNombre(usuario.nombre);
      setApellido(usuario.apellido || "");
      setEmail(usuario.email);
    } else {
      setNombre("");
      setApellido("");
      setEmail("");
    }
  }, [usuario]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({ nombre, apellido, email, rol: "agente", activo: true });
  }

  return (
    <form className="space-y-4 mt-2" onSubmit={handleSubmit}>
      <div>
        <label className="block mb-1 font-semibold text-ultramar">Nombre</label>
        <input
          className="w-full border border-graphite rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-limelime"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-semibold text-ultramar">Apellido</label>
        <input
          className="w-full border border-graphite rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-limelime"
          value={apellido}
          onChange={e => setApellido(e.target.value)}
        />
      </div>
      <div>
        <label className="block mb-1 font-semibold text-ultramar">Rol</label>
        <input
          className="w-full border border-graphite rounded-lg px-3 py-2 bg-gray-100 text-gray-500"
          value="Agente"
          disabled
        />
      </div>
      <div>
        <label className="block mb-1 font-semibold text-ultramar">Email</label>
        <input
          className="w-full border border-graphite rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-limelime"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="flex gap-2 mt-6">
        <button
          type="submit"
          className="bg-ultramar text-white rounded-lg py-2 px-4 font-bold hover:bg-limelime hover:text-graphite transition"
          disabled={loading}
        >
          {usuario ? "Actualizar usuario" : loading ? "Guardando..." : "Guardar usuario"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-graphite text-white rounded-lg py-2 px-4 font-bold hover:bg-skyblue transition"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}