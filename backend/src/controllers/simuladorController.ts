// backend/src/controllers/simuladorController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getClienteAleatorio = async (req: Request, res: Response) => {
  const { campanaId } = req.query;
  if (!campanaId) return res.status(400).json({ error: 'campanaId es requerido' });

  const disponibles = await prisma.clienteSimulado.findMany({
    where: { campanaId: Number(campanaId), estado: 'disponible' },
    take: 10
  });

  if (!disponibles.length) {
    return res.status(404).json({ error: 'No hay clientes disponibles' });
  }

  const seleccionado = disponibles[Math.floor(Math.random() * disponibles.length)];
  await prisma.clienteSimulado.update({
    where: { id: seleccionado.id },
    data: {
      estado: 'asignado',
      asignadoA: (req as any).user.userId,
      fechaAsignacion: new Date()
    }
  });

  res.json({ cliente: seleccionado });
};

export const registrarSimulacion = async (req: Request, res: Response) => {
  const { clienteId, sessionId, transcripcion, calificacion, feedback, evaluacion, tipificacion } = req.body;
  const usuarioId = (req as any).user.userId;

  const simulacion = await prisma.simulacion.create({
    data: {
      clienteId,
      usuarioId,
      sessionId,
      estado: 'completada',
      fechaFin: new Date(),
      duracion: 180, // ejemplo fijo, ajustar con audio
      transcripcion,
      calificacion,
      feedback,
      evaluacion,
      tipificacion
    }
  });

  await prisma.clienteSimulado.update({
    where: { id: clienteId },
    data: { estado: 'completado' }
  });

  res.status(201).json(simulacion);
};

export const getHistorialSimulaciones = async (req: Request, res: Response) => {
  const usuarioId = (req as any).user.userId;
  const historial = await prisma.simulacion.findMany({
    where: { usuarioId },
    include: {
      cliente: { include: { campana: true } }
    },
    orderBy: { fechaInicio: 'desc' },
    take: 50
  });
  res.json(historial);
};

export const getResumenDashboard = async (req: Request, res: Response) => {
  const usuarioId = (req as any).user.userId;

  const total = await prisma.simulacion.count({ where: { usuarioId } });
  const completadas = await prisma.simulacion.count({ where: { usuarioId, estado: 'completada' } });

  const promedio = await prisma.simulacion.aggregate({
    where: { usuarioId },
    _avg: { calificacion: true },
    _max: { fechaInicio: true },
  });

  res.json({
    total,
    completadas,
    promedioCalificacion: promedio._avg.calificacion || 0,
    ultimaSimulacion: promedio._max.fechaInicio || null
  });
};
