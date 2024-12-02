import Usuario from "../models/usuario/Usuario.js";
import Autoescuela from "../models/autoescuela/Autoescuela.js"; // Importa el modelo de Autoescuela

const datosProfesor = async (req, res) => {
    try {
        const { id: profesorId } = req.usuario; // Extraemos el ID del profesor desde el token o sesión

        // Buscar los datos del profesor en la base de datos
        const profesor = await Usuario.findOne({
            where: {
                id: profesorId, // Filtramos por ID de profesor
                role: 'profesor', // Aseguramos que es un profesor
            },
            include: {
                model: Autoescuela, // Incluimos la autoescuela asociada
                as: 'autoescuela', // Especificamos el alias de la relación
                attributes: ['id', 'name', 'email', 'contact_info', 'address'], // Traemos los campos de la autoescuela
            },
            attributes: ['id', 'name', 'email', 'contact_info', 'address', 'dni'], // Traemos los campos del profesor
        });

        // Verificar si el profesor existe
        if (!profesor) {
            return res.status(404).json({ msg: "Profesor no encontrado" });
        }

        // Responder con los datos del profesor y su autoescuela
        return res.status(200).json({
            id: profesor.id,
            nombre: profesor.name,
            email: profesor.email,
            telefono: profesor.contact_info, // Teléfono
            direccion: profesor.address, // Dirección
            dni: profesor.dni, // DNI
            autoescuela: profesor.autoescuela, // Información de la autoescuela
        });
    } catch (error) {
        console.error("Error al obtener los datos del profesor:", error);
        return res.status(500).json({ msg: "Hubo un error al obtener los datos del profesor." });
    }
};

export { datosProfesor };
