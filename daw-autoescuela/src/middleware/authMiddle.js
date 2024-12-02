import jwt from 'jsonwebtoken';
import Autoescuela from '../models/autoescuela/Autoescuela.js';
import Usuario from '../models/usuario/Usuario.js';

export const checkAuth = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Buscar Autoescuela
            req.autoescuela = await Autoescuela.findByPk(decoded.id, {
                attributes: { exclude: ['password', 'token'] }
            });

            // Si no es Autoescuela, buscar Usuario
            if (!req.autoescuela) {
                req.usuario = await Usuario.findByPk(decoded.id, {
                    attributes: { exclude: ['password', 'token'] }
                });

                if (!req.usuario) {
                    throw new Error();
                }
            }

            return next();
        } catch (error) {
            console.error('Error en la verificación del token:', error);
            return res.status(403).json({ msg: `El token no es válido: ${error.message}` });
        }
    }

    return res.status(403).json({ msg: 'El token no existe' });
};

// Middleware adicional para roles
export const checkRole = (rolesPermitidos) => (req, res, next) => {
    const usuario = req.usuario;
    const autoescuela = req.autoescuela;

    // Verificar roles de usuarios
    if (usuario && rolesPermitidos.includes(usuario.role)) {
        return next();
    }

    // Permitir autoescuelas si están incluidas en rolesPermitidos
    if (autoescuela && rolesPermitidos.includes('autoescuela')) {
        return next();
    }

    return res.status(403).json({ msg: 'No tienes permisos para realizar esta acción.' });
};

