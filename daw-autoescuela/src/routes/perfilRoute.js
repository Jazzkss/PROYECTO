import { Router } from "express";
import { checkAuth, checkRole } from "../middleware/authMiddle.js";
import { perfil } from "../views/perfil.js";

const perfilRoute = Router();

// Obtener perfiles
perfilRoute.get(
    "/perfil",
    checkAuth,
    checkRole(["autoescuela", "administrativo", "profesor", 'director', 'estudiante']),
    perfil
);

export default perfilRoute;
