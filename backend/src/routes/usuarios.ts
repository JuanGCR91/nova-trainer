import express from "express";
import {
  getUsuarios,
  createUsuario,
  deleteUsuario,
  updateUsuario,
} from "../controllers/usuariosController";
const router = express.Router();

router.get("/", getUsuarios);
router.post("/", createUsuario);
router.delete("/:id", deleteUsuario);
router.put("/:id", updateUsuario);

export default router;
