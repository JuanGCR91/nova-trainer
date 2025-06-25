import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secreto-temporal'; // Cambia esto en producción

// Ruta para inicio de sesión
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });
  }

  try {
    const user = await prisma.usuario.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    // Asegúrate de que la contraseña es string
    if (await bcrypt.compare(password, user.password ?? '')) {
      const token = jwt.sign(
        { userId: user.id, email: user.email, rol: user.rol },
        JWT_SECRET,
        { expiresIn: '1h' } // El token expira en 1 hora
      );

      res.json({ token });
    } else {
      res.status(401).json({ error: 'Contraseña incorrecta' });
    }
  } catch (error) {
    console.error('Error en proceso de login:', error);
    res.status(500).json({ error: 'Error al procesar la solicitud de inicio de sesión' });
  }
});

// Ruta para registro de usuarios
router.post('/register', async (req, res) => {
  const { email, password, nombre } = req.body;

  if (!email || !password || !nombre) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  try {
    // Encriptar la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.usuario.create({
      data: {
        email,
        password: hashedPassword, // Almacena la contraseña encriptada
        nombre,
        rol: 'agente' // Rol por defecto
      }
    });

    res.status(201).json({ message: 'Usuario creado exitosamente' });
  } catch (error) {
    console.error('Error en crear usuario:', error);
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
});

export default router;