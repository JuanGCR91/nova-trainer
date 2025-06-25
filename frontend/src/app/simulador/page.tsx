'use client';

import Navbar from '@/components/Navbar';
import SimuladorWidget from '@/components/Simulador'; // Ajusta la ruta

export default function SimuladorPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <SimuladorWidget />
      </div>
    </div>
  );
}
