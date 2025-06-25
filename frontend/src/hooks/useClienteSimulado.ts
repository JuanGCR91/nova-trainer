// frontend/src/hooks/useClienteSimulado.ts
import { useState, useCallback } from 'react';
import axios from 'axios';
import { ClienteSimulado } from '../../types';

export const useClienteSimulado = () => {
  const [clienteSeleccionado, setClienteSeleccionado] = useState<ClienteSimulado | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const solicitarClienteAleatorio = useCallback(async (campanaId: number) => {
    try {
      setCargando(true);
      setError(null);
      
      // Primero obtener un cliente aleatorio
      const response = await axios.get(`/clientes/aleatorio?campanaId=${campanaId}`);
      
      if (response.data.success && response.data.cliente) {
        // Luego asignarlo al usuario actual
        const asignacionResponse = await axios.post('/simulador/asignar-cliente', {
          campanaId,
          usuarioId: 1, // TODO: Obtener del contexto de auth
          clienteId: response.data.cliente.id
        });
        
        if (asignacionResponse.data.success) {
          setClienteSeleccionado(response.data.cliente);
          return response.data.cliente;
        }
      }
    } catch (err) {
      console.error('Error al solicitar cliente:', err);
      setError('Error al solicitar cliente');
    } finally {
      setCargando(false);
    }
  }, []);

  const liberarCliente = useCallback(async () => {
    if (clienteSeleccionado) {
      try {
        // TODO: Implementar endpoint para liberar cliente
        setClienteSeleccionado(null);
      } catch (err) {
        console.error('Error al liberar cliente:', err);
      }
    }
  }, [clienteSeleccionado]);

  return {
    clienteSeleccionado,
    solicitarClienteAleatorio,
    liberarCliente,
    cargando,
    error
  };
};