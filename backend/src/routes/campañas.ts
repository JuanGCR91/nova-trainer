import express from 'express';
import {
  getCampanias,
  createCampania,
  deleteCampania,
  updateCampania,
  getCampania
} from '../controllers/campañasController';
import { authenticateJWT, soloSupervisores } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateJWT, soloSupervisores, getCampanias);
router.post('/', authenticateJWT, soloSupervisores, createCampania);
router.delete('/:id', authenticateJWT, soloSupervisores, deleteCampania);
router.put('/:id', authenticateJWT, soloSupervisores, updateCampania);
router.get('/:id', authenticateJWT, soloSupervisores, getCampania);

export default router;