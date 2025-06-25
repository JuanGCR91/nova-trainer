// backend/src/routes/simulador.ts
import { Router } from 'express';
import {
  getClienteAleatorio,
  registrarSimulacion,
  getHistorialSimulaciones,
  getResumenDashboard
} from '../controllers/simuladorController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.get('/cliente-aleatorio', authenticateJWT, getClienteAleatorio);
router.post('/simulacion', authenticateJWT, registrarSimulacion);
router.get('/historial', authenticateJWT, getHistorialSimulaciones);
router.get('/dashboard', authenticateJWT, getResumenDashboard);

export default router;
