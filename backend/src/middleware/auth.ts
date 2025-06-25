// backend/src/middleware/auth.ts corregido con export explícito
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secreto-temporal';

export interface JwtPayload {
  userId: number;
  email: string;
  rol: 'admin' | 'supervisor' | 'agente';
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

export const soloSupervisores = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (req.user?.rol === 'supervisor' || req.user?.rol === 'admin') {
    return next();
  }
  return res.status(403).json({ error: 'Acceso denegado: solo supervisores o admins' });
};
