import ClaseDisponible from '../../models/clasedisponible/ClaseDisponible.js';
import Usuario from '../../models/usuario/Usuario.js';

const verClasesDisponibles = async (req, res) => {
    const usuarioId = req.usuario.id; // ID del estudiante autenticado, extraído del middleware de autenticación

    try {
        // Obtener el usuario autenticado (el estudiante)
        const usuario = await Usuario.findByPk(usuarioId);
        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado.' });
        }

        // Verificar que el usuario tenga el rol de 'estudiante'
        if (usuario.role !== 'estudiante') {
            return res.status(403).json({ msg: 'Solo los estudiantes pueden ver las clases disponibles.' });
        }

        // Obtener las clases disponibles asociadas al estudiante
        const clasesDisponibles = await ClaseDisponible.findAll({
            where: { id_usuario: usuarioId },  // Filtramos por el estudiante para obtener sus clases disponibles
        });

        if (clasesDisponibles.length === 0) {
            return res.status(404).json({ msg: 'No hay clases disponibles para este estudiante.' });
        }

        return res.status(200).json({ msg: 'Clases disponibles obtenidas con éxito', clasesDisponibles });
    } catch (error) {
        console.error("Error al obtener clases disponibles:", error);
        return res.status(500).json({ msg: 'Hubo un error al intentar obtener las clases disponibles. Inténtalo nuevamente.' });
    }
};

export { verClasesDisponibles };
