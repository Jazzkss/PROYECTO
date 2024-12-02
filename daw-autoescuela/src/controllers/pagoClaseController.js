import PagoClase from '../models/pagoclase/PagoClase.js';
import ClaseDisponible from '../models/clasedisponible/ClaseDisponible.js';
import Usuario from '../models/usuario/Usuario.js';

const pagarClases = async (req, res) => {
    const { cantidad } = req.body;
    const usuarioId = req.usuario.id; // ID del usuario autenticado, extraído del middleware de autenticación

    // Verificar que los datos necesarios estén presentes
    if (!cantidad) {
        return res.status(400).json({ msg: 'La cantidad de clases es obligatoria.' });
    }

    try {
        // Obtener el usuario autenticado
        const usuario = await Usuario.findByPk(usuarioId);
        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado.' });
        }

        // Obtener las clases disponibles asociadas al usuario (id_usuario)
        const claseDisponible = await ClaseDisponible.findOne({
            where: { id_usuario: usuarioId },  // Filtramos por el usuario que está haciendo el pago
        });

        if (!claseDisponible) {
            return res.status(404).json({ msg: 'No tienes clases disponibles asociadas.' });
        }

        // Registrar el pago de clases
        const pago = await PagoClase.create({
            id_usuario: usuarioId,
            id_clase_disponible: claseDisponible.id,
            cantidad,
        });

        // Actualizar el número de clases disponibles
        claseDisponible.clases_disponibles += cantidad;  // Agregar clases compradas
        await claseDisponible.save();

        return res.status(201).json({ msg: 'Compra realizada con éxito', pago });
    } catch (error) {
        console.error("Error al realizar el pago de clases:", error);
        return res.status(500).json({ msg: 'Hubo un error al intentar realizar el pago. Inténtalo nuevamente.' });
    }
};

export { pagarClases };
