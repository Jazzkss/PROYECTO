import Usuario from "../models/usuario/Usuario.js";
import Autoescuela from "../models/autoescuela/Autoescuela.js";
import ClaseDisponible from "../models/clasedisponible/ClaseDisponible.js"; // Asegúrate de importar el modelo de clases disponibles

// Controlador para crear usuarios
const crearUsuario = async (req, res) => {
    const { name, email, password, role, clases_disponibles } = req.body;
    const autoescuelaId = req.autoescuela?.id || req.usuario?.id_autoescuela;

    if (!autoescuelaId) {
        return res.status(403).json({ msg: 'No tienes permisos para realizar esta acción.' });
    }

    if (!name || !email || !password || !role) {
        return res.status(400).json({ msg: 'Todos los campos (name, email, password, role) son obligatorios.' });
    }

    const rolesPermitidos = ['administrativo', 'profesor', 'estudiante'];
    if (!rolesPermitidos.includes(role)) {
        return res.status(400).json({ msg: `El rol debe ser uno de los siguientes: ${rolesPermitidos.join(', ')}` });
    }

    try {
        // Verificar que la autoescuela existe
        const autoescuelaExistente = await Autoescuela.findByPk(autoescuelaId);
        if (!autoescuelaExistente) {
            return res.status(400).json({ msg: 'La autoescuela asociada no existe.' });
        }

        // Verificar si el correo del usuario ya existe
        const existeUsuario = await Usuario.findOne({ where: { email } });
        if (existeUsuario) {
            return res.status(400).json({ msg: 'El correo ya está registrado. Usa otro correo.' });
        }

        // Crear el nuevo usuario
        const nuevoUsuario = await Usuario.create({
            name,
            email,
            password,
            role,
            id_autoescuela: autoescuelaId,
        });

        // Si el rol es "estudiante", manejar clases disponibles
        if (role === 'estudiante') {
            // Asegúrate de que `clases_disponibles` esté definido y sea un número
            let clases = clases_disponibles !== undefined ? Number(clases_disponibles) : 0;

            // Verificar que el valor de `clases` es un número válido y no es negativo
            if (isNaN(clases) || clases < 0) {
                return res.status(400).json({ msg: 'El número de clases disponibles debe ser un número positivo.' });
            }

            // Crear el registro en la tabla de clases disponibles
            await ClaseDisponible.create({
                id_usuario: nuevoUsuario.id,
                clases_disponibles: clases,
            });
        }


        // No asignar clases disponibles a "profesor" o "administrativo"
        if (['profesor', 'administrativo'].includes(role) && clases_disponibles) {
            return res.status(400).json({
                msg: `No puedes asignar clases a un ${role}. Este rol no tiene clases disponibles.`,
            });
        }

        const usuarioRes = {
            id: nuevoUsuario.id,
            name: nuevoUsuario.name,
            email: nuevoUsuario.email,
            role: nuevoUsuario.role,
            id_autoescuela: nuevoUsuario.id_autoescuela,
        };

        res.status(201).json({ msg: 'Usuario creado exitosamente', usuario: usuarioRes });

    } catch (error) {
        console.error("Error al crear el usuario:", error);
        res.status(500).json({ msg: 'Hubo un error al intentar crear el usuario. Inténtalo nuevamente.' });
    }
};

export { crearUsuario };
