import { Request, Response, NextFunction } from 'express';

export function checkAdminRole(req: Request, res: Response, next: NextFunction) {
  if (req.user && req.user.rol === 'admin') {
    next();
  } else {
    res.sendStatus(403); // Devolver 403 si el usuario no es admin
  }
}