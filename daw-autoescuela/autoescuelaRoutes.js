import { Router } from "express";
import { perfil, registrar } from "../controllers/autoescuelaController.js";
import { checkAuth, checkRole } from "../middleware/authMiddle.js"
import { crearUsuario } from '../controllers/usuarioController.js'
// ROUTING APP GET

const autoescuela = Router();
autoescuela.post('/', registrar);

// Autenticación y perfil
autoescuela.get('/perfil', checkAuth, perfil);

// Crear usuarios (solo directores y administrativos)
autoescuela.post(
    '/usuarios',
    checkAuth,
    checkRole(['director', 'administrativo', 'autoescuela']), // Solo directores o administrativos
    crearUsuario
);


autoescuela.put('/', (req, res) => {

    res.json('Desde Get')
})

autoescuela.patch('/', (req, res) => {

    res.json('Desde Get')
})

autoescuela.delete('/', (req, res) => {

    res.json('Desde Get')
})


export default autoescuela;