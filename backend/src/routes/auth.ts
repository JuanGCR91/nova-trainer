// backend/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secreto-temporal';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    rol: 'admin' | 'supervisor' | 'agente';
  };
}

export function verificarToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; rol: string };
    req.user = {
      userId: decoded.userId,
      rol: decoded.rol as 'admin' | 'supervisor' | 'agente',
    };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

export function soloSupervisores(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (req.user?.rol === 'supervisor' || req.user?.rol === 'admin') {
    return next();
  }
  return res.status(403).json({ error: 'Acceso denegado: solo supervisores o admins' });
}
