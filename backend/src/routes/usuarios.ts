import express from "express";
import {
  getUsuarios,
  createUsuario,
  deleteUsuario,
  updateUsuario
} from "../controllers/usuariosController";
import { authenticateJWT, soloAdmins } from "../middleware/auth";  // verifica ambos
import { checkAdminRole } from '../middleware/roles';

const router = express.Router();

router.get("/", authenticateJWT, soloAdmins, getUsuarios);
router.post("/", authenticateJWT, soloAdmins, createUsuario);
router.delete("/:id", authenticateJWT, soloAdmins, deleteUsuario);
router.put("/:id", authenticateJWT, soloAdmins, updateUsuario);
router.get('/', authenticateJWT, checkAdminRole, (req, res) => {
  // Lógica para manejar la solicitud de obtener usuarios
  res.status(200).json({ message: 'Lista de usuarios...' });
});

export default router;