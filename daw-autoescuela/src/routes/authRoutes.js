import express from 'express';
import { autenticar } from '../controllers/authController.js';


const router = express.Router();

// Endpoint de autenticación
router.post('/login', autenticar);

export default router;
