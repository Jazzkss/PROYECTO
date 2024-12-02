import { Router } from 'express';
import { pagarClases } from '../controllers/pagoClaseController.js';  // Asegúrate de importar el controlador
import { checkAuth, checkRole } from '../middleware/authMiddle.js';

const pagoClaseRouter = Router();

// Ruta para pagar clases
pagoClaseRouter.post(
  '/pago',
  checkAuth,
  checkRole(['estudiante']),  // Solo los alumnos pueden pagar clases
  pagarClases
);

export default pagoClaseRouter;