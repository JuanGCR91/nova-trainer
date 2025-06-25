// ✅ campañasController.ts actualizado y validado
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCampanias = async (req: Request, res: Response) => {
  try {
    const campanas = await prisma.campana.findMany({
      include: {
        creador: {
          select: { id: true, nombre: true, apellido: true, email: true },
        },
        _count: {
          select: { clientes: true },
        },
      },
      orderBy: { fechaCreacion: 'desc' },
    });
    res.json(campanas);
  } catch (error) {
    console.error('Error al obtener campañas:', error);
    res.status(500).json({ error: 'Error al obtener campañas' });
  }
};

export const createCampania = async (req: Request, res: Response) => {
  try {
    const { nombre, estado, campos, prompt, fechaInicio } = req.body;

    if (!nombre || !fechaInicio || !campos || !Array.isArray(campos)) {
      return res.status(400).json({ error: 'Datos incompletos o inválidos' });
    }

    const creadorId = (req as any).user?.userId || 1;

    const nueva = await prisma.campana.create({
      data: {
        nombre,
        estado: estado || 'activa',
        fechaInicio: new Date(fechaInicio),
        prompt: prompt || '',
        campos,
        creadorId,
      },
      include: {
        creador: { select: { id: true, nombre: true, apellido: true, email: true } },
        _count: { select: { clientes: true } },
      },
    });

    res.status(201).json(nueva);
  } catch (error) {
    console.error('Error al crear campaña:', error);
    res.status(500).json({ error: 'Error al crear campaña' });
  }
};

export const deleteCampania = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.campana.delete({ where: { id: Number(id) } });
    res.json({ message: 'Campaña eliminada' });
  } catch (error) {
    console.error('Error al eliminar campaña:', error);
    res.status(500).json({ error: 'Error al eliminar campaña' });
  }
};
