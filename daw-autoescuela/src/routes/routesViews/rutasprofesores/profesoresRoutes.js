import { Router } from "express";
import { checkAuth, checkRole } from "../../../middleware/authMiddle.js";
import { verclases } from "../../../views/obtenerClaseProfesor.js";
import { veralumnos } from "../../../views/obtenerAlumnosProfesor.js";
import { contarAlumnos } from "../../../views/numeroalumnos.js";
import { obtenerEstadisticasProfesor } from "../../../views/totalClases.js";
import { datosProfesor } from "../../../views/obtenerDatosProfesor.js";

const profesoresRoutes = Router();

// Crear una clase (solo para administrativos y profesores)
profesoresRoutes.get('/clases', checkAuth, checkRole(['profesor']), verclases)
profesoresRoutes.get('/alumnos', checkAuth, checkRole(['profesor']), veralumnos)
profesoresRoutes.get('/numero/alumnos', checkAuth, checkRole(['profesor']), contarAlumnos)
profesoresRoutes.get('/estadisticas', checkAuth, checkRole(['profesor']), obtenerEstadisticasProfesor)
profesoresRoutes.get('/datos', checkAuth, checkRole(['profesor']), datosProfesor)


export default profesoresRoutes;
