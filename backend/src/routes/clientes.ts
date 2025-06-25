// backend/src/routes/clientes.ts
import { Router } from 'express';
import multer from 'multer';
import {
  getClientes,
  createCliente,
  updateCliente,
  deleteCliente
} from '../controllers/clientesController';

const upload = multer({ dest: 'uploads/' });
const router = Router();

router.get('/', getClientes);
router.post('/', upload.none(), createCliente);
router.put('/:id', upload.none(), updateCliente);
router.delete('/:id', deleteCliente);

export default router;
