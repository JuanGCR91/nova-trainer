"use client";
import { useState, useEffect, useRef } from "react";
import ClientesTable from "@/components/clientes/ClientesTable";
import ClienteForm from "@/components/clientes/ClienteForm";
import Modal from "@/components/ui/Modal";
import Navbar from "@/components/Navbar";
import { ClienteSimulado, Campana } from "../../../types";
import { UserPlus, UploadCloud, Loader2, Users } from "lucide-react";
import axios, { AxiosError } from "axios";

interface DatosCliente {
  [key: string]: string | number | Date | null;
}

interface ErrorResponse {
  error: string;
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<ClienteSimulado[]>([]);
  const [campanas, setCampanas] = useState<Campana[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [editCliente, setEditCliente] = useState<ClienteSimulado | null>(null);
  const [selectedCampanaId, setSelectedCampanaId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    cargarClientes();
    cargarCampanas();
  }, []);

  const cargarClientes = async () => {
    try {
      const response = await axios.get<ClienteSimulado[]>("/clientes");
      setClientes(response.data);
    } catch (error) {
      console.error("Error al cargar clientes:", error);
      setClientes([]);
    }
  };

  const cargarCampanas = async () => {
    try {
      const response = await axios.get<Campana[]>("/campanas");
      setCampanas(response.data);
      // Seleccionar la primera campaña por defecto
      if (response.data.length > 0 && !selectedCampanaId) {
        setSelectedCampanaId(response.data[0].id);
      }
    } catch (error) {
      console.error("Error al cargar campañas:", error);
    }
  };

  function handleOpenModal() {
    setEditCliente(null);
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
    setEditCliente(null);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !selectedCampanaId) {
      if (!selectedCampanaId) {
        alert("Por favor selecciona una campaña primero");
      }
      return;
    }

    setLoadingUpload(true);
    const formData = new FormData();
    formData.append("archivo", file);
    formData.append("campanaId", selectedCampanaId.toString());

    try {
      const response = await axios.post<{ success: boolean; total: number }>("/clientes/upload", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        alert(`Clientes cargados exitosamente: ${response.data.total}`);
        await cargarClientes();
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      alert("Error al cargar clientes: " + (axiosError.response?.data?.error || axiosError.message));
    } finally {
      setLoadingUpload(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleSaveCliente(datos: DatosCliente) {
    if (!selectedCampanaId) {
      alert("Por favor selecciona una campaña");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        campanaId: selectedCampanaId,
        datos: datos
      };

      if (editCliente) {
        await axios.put(`/clientes/${editCliente.id}`, payload);
      } else {
        await axios.post("/clientes", payload);
      }
      
      await cargarClientes();
      setShowModal(false);
      setEditCliente(null);
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      alert("Error al guardar cliente: " + (axiosError.response?.data?.error || axiosError.message));
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteCliente(id: number) {
    if (!window.confirm("¿Seguro que deseas eliminar este cliente?")) return;
    try {
      await axios.delete(`/clientes/${id}`);
      await cargarClientes();
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      alert("Error: " + (axiosError.response?.data?.error || axiosError.message));
    }
  }

  function handleEditCliente(cliente: ClienteSimulado) {
    setEditCliente(cliente);
    setSelectedCampanaId(cliente.campanaId);
    setShowModal(true);
  }

  const campanaSeleccionada = campanas.find(c => c.id === selectedCampanaId);

  return (
    <div className="flex flex-col min-h-[80vh] items-center justify-center bg-gradient-to-br from-[#f7f7fb] via-[#e0e7ff] to-[#a5b4fc]">
      <Navbar />
      <div className="w-full max-w-6xl p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <Users className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
              Gestión de Clientes Simulados
            </h1>
          </div>

          {/* Selector de campaña */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaña activa:
            </label>
            <select
              value={selectedCampanaId || ''}
              onChange={(e) => setSelectedCampanaId(Number(e.target.value))}
              className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecciona una campaña</option>
              {campanas.map((campana) => (
                <option key={campana.id} value={campana.id}>
                  {campana.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-end gap-3 mb-5">
            <button
              onClick={handleOpenModal}
              disabled={!selectedCampanaId}
              className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <UserPlus className="h-5 w-5" />
              Nuevo cliente
            </button>
            <input
              type="file"
              accept=".csv,.xlsx"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={loadingUpload || !selectedCampanaId}
              className="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingUpload ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4" /> Cargando...
                </>
              ) : (
                <>
                  <UploadCloud className="h-5 w-5" />
                  Carga masiva
                </>
              )}
            </button>
          </div>

          {/* Tabla de clientes */}
          <ClientesTable
            clientes={clientes.filter(c => !selectedCampanaId || c.campanaId === selectedCampanaId)}
            onDelete={handleDeleteCliente}
            onEdit={handleEditCliente}
          />
        </div>

        {/* Modal de creación/edición */}
        <Modal open={showModal} onClose={handleCloseModal}>
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            {editCliente ? "Editar cliente simulado" : "Nuevo cliente simulado"}
          </h2>
          {campanaSeleccionada && (
            <p className="text-sm text-gray-600 text-center mb-4">
              Campaña: {campanaSeleccionada.nombre}
            </p>
          )}
          <ClienteForm
            onSave={handleSaveCliente}
            onCancel={handleCloseModal}
            loading={loading}
            cliente={editCliente}
            campos={(campanaSeleccionada?.campos || []).map((campo) => ({
              ...campo,
              tipo: campo.tipo as "texto" | "número" | "fecha" | "opción",
            }))}
          />
        </Modal>
      </div>
    </div>
  );
}