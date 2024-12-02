import Usuario from "../../models/usuario/Usuario.js";
import Autoescuela from "../../models/autoescuela/Autoescuela.js"; // Importa el modelo de Autoescuela

const datosAlumno = async (req, res) => {
    try {
        const { id: alumnoId } = req.usuario; // Extraemos el ID del alumno desde el token o sesión

        // Buscar los datos del alumno en la base de datos
        const alumno = await Usuario.findOne({
            where: {
                id: alumnoId, // Filtramos por ID de alumno
                role: 'estudiante', // Aseguramos que es un alumno
            },
            include: {
                model: Autoescuela, // Incluimos la autoescuela asociada
                as: 'autoescuela', // Especificamos el alias de la relación
                attributes: ['id', 'name', 'email', 'contact_info', 'address'], // Traemos los campos de la autoescuela
            },
            attributes: ['id', 'name', 'email', 'contact_info', 'address', 'dni'], // Traemos los campos del alumno
        });

        // Verificar si el alumno existe
        if (!alumno) {
            return res.status(404).json({ msg: "Alumno no encontrado" });
        }

        // Responder con los datos del alumno y su autoescuela
        return res.status(200).json({
            id: alumno.id,
            nombre: alumno.name,
            email: alumno.email,
            telefono: alumno.contact_info, // Teléfono
            direccion: alumno.address, // Dirección
            dni: alumno.dni, // DNI
            autoescuela: alumno.autoescuela, // Información de la autoescuela
        });
    } catch (error) {
        console.error("Error al obtener los datos del alumno:", error);
        return res.status(500).json({ msg: "Hubo un error al obtener los datos del alumno." });
    }
};

export { datosAlumno };
