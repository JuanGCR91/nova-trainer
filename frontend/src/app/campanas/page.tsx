"use client";
import { Card } from "../../components/ui/Card";
import Navbar from '@/components/Navbar';
import CampañasTable from "../campanas/CampañasTable";
import CampañaForm from "../campanas/CampañaForm";
import { useEffect, useState, useCallback } from "react";
import { Campana } from "../../../types/index";
import { Plus } from "lucide-react";

export default function CampañasPage() {
  const [showForm, setShowForm] = useState(false);
  const [campañas, setCampañas] = useState<Campana[]>([]);

  const cargarCampañas = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/campanas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("No se pudo obtener campañas");
      const data = await res.json();
      setCampañas(data);
    } catch (error) {
      console.error("Error al cargar campañas:", error);
    }
  }, []);

  useEffect(() => {
    cargarCampañas();
  }, [cargarCampañas]);

  const handleSaveCampaña = async (data: Omit<Campana, "id">) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/campanas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        alert("Error: " + err.error);
        return;
      }

      const nueva = await res.json();
      setCampañas((prev) => [...prev, nueva]);
      setShowForm(false);
    } catch (error) {
      console.error("Error de red al guardar campaña",error);
      setShowForm(false);
    }
  };

  const handleDeleteCampaña = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/api/campanas/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        alert("Error al eliminar campaña");
        return;
      }
      setCampañas((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert("Error de red");
    }
  };

  return (
    <div className="flex flex-col min-h-[80vh] items-center justify-center bg-gradient-to-br from-[#f7f7fb] via-[#e0e7ff] to-[#a5b4fc]">
      <Navbar />
      <div className="w-full max-w-2xl px-2 py-8">
        <Card className="rounded-2xl shadow-xl p-8 space-y-6 animate-fadeIn">
          <div className="text-center mb-2">
            <h2 className="text-3xl font-bold text-ultramar">Campañas</h2>
            <p className="text-gray-700 mt-1">
              Crea, edita y consulta las campañas y escenarios de simulación.
            </p>
          </div>
          {!showForm ? (
            <>
              <div className="flex justify-end mb-4">
                <button
                  className="inline-flex items-center gap-2 bg-limelime text-graphite px-4 py-2 rounded-lg font-semibold shadow hover:bg-ultramar hover:text-white transition-all duration-150 focus:ring-2 focus:ring-limelime"
                  onClick={() => setShowForm(true)}
                >
                  <Plus className="h-5 w-5" /> Nueva campaña
                </button>
              </div>
              <CampañasTable
                campañas={campañas}
                onDelete={handleDeleteCampaña}
              />
            </>
          ) : (
            <div className="animate-slideInUp">
              <CampañaForm
                onSave={handleSaveCampaña}
                onCancel={() => setShowForm(false)}
              />
            </div>
          )}
        </Card>
      </div>
      <style jsx>{`
        .animate-fadeIn { animation: fadeIn 0.7s; }
        .animate-slideInUp { animation: slideInUp 0.5s; }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(.96); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
