import { Router } from "express";
import { checkAuth, checkRole } from "../../../middleware/authMiddle.js";
import { obtenerAlumnosAutoescuela } from "../../../views/administrativos/obtenerAlumnos.js";
import { obtenerDatosAlumnosAutoescuela } from "../../../views/administrativos/obtenerDatosClasesAlumnos.js";
import { obtenerProfesoresAutoescuela } from "../../../views/administrativos/obtenerProfesores.js";
import { obtenerDatosProfesoresAutoescuela } from "../../../views/administrativos/obtenerDatosClasesProfesores.js";


const administrativoRoutes = Router();

//Crear una clase (solo para administrativos y profesores)
// administrativoRoutes.get('/clases', checkAuth, checkRole(['profesor']), verclases)
administrativoRoutes.get('/autoescuela/alumnos', checkAuth, checkRole(['administrativo']), obtenerAlumnosAutoescuela)
administrativoRoutes.get('/autoescuela/alumno/:alumnoId', checkAuth, checkRole(['administrativo']), obtenerDatosAlumnosAutoescuela)
administrativoRoutes.get('/autoescuela/profesores', checkAuth, checkRole(['administrativo']), obtenerProfesoresAutoescuela)
administrativoRoutes.get('/autoescuela/profesor/:profeId', checkAuth, checkRole(['administrativo']), obtenerDatosProfesoresAutoescuela)

// administrativoRoutes.get('/numero/alumnos', checkAuth, checkRole(['profesor']), contarAlumnos)
// administrativoRoutes.get('/estadisticas', checkAuth, checkRole(['profesor']), obtenerEstadisticasProfesor)
// administrativoRoutes.get('/datos', checkAuth, checkRole(['profesor']), datosProfesor)


export default administrativoRoutes;
