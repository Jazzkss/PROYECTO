import { Router } from "express";
import { checkAuth, checkRole } from "../../../middleware/authMiddle.js";
import { verClasesDisponibles } from "../../../views/alumnos/totalClases.js";
import { verClases } from "../../../views/alumnos/obtenerClases.js"
import { datosAlumno } from "../../../views/alumnos/obtenerDatos.js";

const alumnosRoutes = Router();

// RUTAS ALUMNOS
alumnosRoutes.get('/clases', checkAuth, checkRole(['estudiante']), verClases)
alumnosRoutes.get('/datos', checkAuth, checkRole(['estudiante']), datosAlumno)
alumnosRoutes.get('/total/clases', checkAuth, checkRole(['estudiante']), verClasesDisponibles)



export default alumnosRoutes;
