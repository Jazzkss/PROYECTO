import { Router } from "express";
import { crearUsuario } from "../controllers/usuarioController.js";
import { checkAuth, checkRole } from "../middleware/authMiddle.js"

// Crear la instancia del Router
const usuarioRouter = Router();

// Ruta para crear un usuario (administrativo, profesor, estudiante)
usuarioRouter.post(
  '/registro',
  checkAuth,
  checkRole(['director', 'administrativo', 'autoescuela']),
  crearUsuario
);

export default usuarioRouter;
