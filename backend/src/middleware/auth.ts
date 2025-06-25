import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Define el tipo para la carga útil del JWT si es necesario
interface JwtPayload {
  userId: string;
  email: string;
  rol: string;
}

// Middleware de Autenticación: Verifica y decodifica el JWT
export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
      if (err) {
        console.log('Error en validación de token:', err); // Asegúrate de que los errores están siendo logueados
        return res.sendStatus(401);
      }
      req.user = jwt.decode(token) as JwtPayload; // Decodifica el token y lo asigna a req.user
      next();
    });
  } else {
    res.sendStatus(401);
  }
}

// Middleware de Autorización: Verifica si el usuario es un supervisor
export const soloSupervisores = (req: Request, res: Response, next: NextFunction) => {
  const { rol } = req.user || {}; // Suponiendo que 'req.user' es establecido por authenticateJWT

  if (rol !== 'supervisor') {
    return res.status(403).json({ message: 'Acceso denegado: solo supervisores' });
  }

  next();
};

// Middleware de Autorización: Verifica si el usuario es un administrador
export const soloAdmins = (req: Request, res: Response, next: NextFunction) => {
  const { rol } = req.user || {}; // Suponiendo que 'req.user' es establecido por authenticateJWT

  if (rol !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado: solo administradores' });
  }

  next();
};

// Tipado extendido para Express Request, para evitar errores de TypeScript
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}