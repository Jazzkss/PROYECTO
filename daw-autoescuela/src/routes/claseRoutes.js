import { Router } from "express";
import { crearClase, obtenerClases } from "../controllers/claseController.js";
import { checkAuth, checkRole } from "../middleware/authMiddle.js";

const claseRouter = Router();

// Crear una clase (solo para administrativos y profesores)
claseRouter.post(
    "/crear",
    checkAuth,
    checkRole(["administrativo", "director"]),
    crearClase
);

// Obtener todas las clases de una autoescuela
claseRouter.get(
    "/autoescuela/:id_autoescuela",
    checkAuth,
    checkRole(["autoescuela", "administrativo", "profesor", 'director']),
    obtenerClases
);

export default claseRouter;
