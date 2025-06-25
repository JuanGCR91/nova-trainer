// ✅ page.tsx ajustado para gestión de usuarios por supervisor
"use client";
import { useState, useEffect } from "react";
import UsuariosTable from "../../components/usuarios/UsuariosTable";
import UsuarioForm from "../../components/usuarios/UsuarioForm";
import Modal from "../../components/ui/Modal";
import { Usuario } from "../../../types";
import { UserPlus, Users } from "lucide-react";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
    fetchUsuarios(storedToken);
  }, []);

  async function fetchUsuarios(authToken: string | null) {
    try {
      const res = await fetch("http://localhost:4000/api/usuarios", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      setUsuarios(data);
    } catch {
      setUsuarios([]);
    }
  }

  function handleOpenModal() {
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
  }

  async function handleSaveUsuario(data: Omit<Usuario, "id">) {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await fetchUsuarios(token);
        setShowModal(false);
      } else {
        alert("Error al crear usuario");
      }
    } catch {
      alert("Error de red al crear usuario");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteUsuario(id: number) {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      const res = await fetch(`http://localhost:4000/api/usuarios/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) await fetchUsuarios(token);
      else alert("Error al eliminar usuario");
    } catch {
      alert("Error de red al eliminar usuario");
    }
  }

  function handleEditUsuario() {
    // Edición futura
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#f7f7fb] via-[#e0e7ff] to-[#a5b4fc]">
      <div className="w-full max-w-3xl p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <Users className="h-8 w-8 text-ultramar" />
            <div>
              <h1 className="text-2xl font-bold text-ultramar tracking-tight">
                Gestión de Usuarios
              </h1>
              <span className="text-gray-500 text-sm">
                Crea y administra usuarios tipo agente.
              </span>
            </div>
          </div>

          <div className="flex justify-end mb-5">
            <button
              onClick={handleOpenModal}
              className="inline-flex items-center gap-2 bg-limelime text-graphite px-5 py-2.5 rounded-lg font-semibold hover:bg-ultramar hover:text-white transition shadow"
            >
              <UserPlus className="h-5 w-5" /> Nuevo usuario
            </button>
          </div>

          <UsuariosTable
            usuarios={usuarios}
            onDelete={handleDeleteUsuario}
            onEdit={handleEditUsuario}
          />
        </div>

        <Modal open={showModal} onClose={handleCloseModal}>
          <h2 className="text-2xl font-bold text-ultramar text-center mb-6">
            Nuevo usuario
          </h2>
          <UsuarioForm
            onSave={handleSaveUsuario}
            onCancel={handleCloseModal}
            loading={loading}
          />
        </Modal>
      </div>
    </div>
  );
}
