import { Router } from "express";
import { perfil, registrar } from "../controllers/autoescuelaController.js";
import { checkAuth } from "../middleware/authMiddle.js"
// ROUTING APP GET

const autoescuela = Router();
autoescuela.post('/registro', registrar);

// Autenticación y perfil
autoescuela.get('/perfil', checkAuth, perfil);




export default autoescuela;