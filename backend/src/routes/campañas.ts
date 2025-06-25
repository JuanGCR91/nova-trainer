import express from 'express';
import { getCampanias, createCampania, deleteCampania } from '../controllers/campañasController';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateJWT, getCampanias);
router.post('/', authenticateJWT, createCampania);
router.delete('/:id', authenticateJWT, deleteCampania);

export default router;
