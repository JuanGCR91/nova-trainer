// backend/src/controllers/usuariosController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Obtener todos los usuarios
export const getUsuarios = async (req: Request, res: Response) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      orderBy: { id: 'asc' },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        activo: true
      }
    });
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// Crear nuevo usuario
export const createUsuario = async (req: Request, res: Response) => {
  try {
    const { nombre, email, rol = 'agente', activo = true } = req.body;
    
    if (!nombre || !email || !rol) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    // Crear usuario
    const nuevoUsuario = await prisma.usuario.create({
      data: { nombre, email, rol, activo },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        activo: true,
      }
    });

    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

// Actualizar usuario
export const updateUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, rol, activo } = req.body;

    const usuarioActualizado = await prisma.usuario.update({
      where: { id: Number(id) },
      data: {
        nombre,
        apellido,
        rol,
        activo
      }
    });

    res.json(usuarioActualizado);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

// Eliminar usuario por ID
export const deleteUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.usuario.delete({ where: { id: Number(id) } });
    res.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};