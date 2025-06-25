// backend/src/controllers/clientesController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { parse } from 'csv-parse';
import * as XLSX from 'xlsx';
import fs from 'fs';

const prisma = new PrismaClient();

export const getClientes = async (req: Request, res: Response) => {
  try {
    const { campanaId } = req.query;
    const where = campanaId ? { campanaId: Number(campanaId) } : {};
    const clientes = await prisma.clienteSimulado.findMany({ where });
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
};

export const createCliente = async (req: Request, res: Response) => {
  try {
    const { campanaId } = req.body;
    const datos = JSON.parse(req.body.datos);
    const nuevoCliente = await prisma.clienteSimulado.create({
      data: {
        campanaId: Number(campanaId),
        datos,
        estado: 'disponible',
      },
    });
    res.status(201).json(nuevoCliente);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear cliente' });
  }
};

export const updateCliente = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const datos = JSON.parse(req.body.datos);
    const cliente = await prisma.clienteSimulado.update({
      where: { id: Number(id) },
      data: { datos },
    });
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar cliente' });
  }
};

export const deleteCliente = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.clienteSimulado.delete({ where: { id: Number(id) } });
    res.json({ message: 'Cliente eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar cliente' });
  }
};
