import Clase from "../../models/clase/clase.js";
import Usuario from "../../models/usuario/Usuario.js";

export const verClases = async (req, res) => {
    const alumnoId = req.usuario.id; // ID del alumno autenticado, extraído del token o sesión

    try {
        // Obtener las clases asignadas al alumno actual con el detalle del profesor
        const clases = await Clase.findAll({
            include: [
                {
                    model: Usuario, // Incluir la información del profesor
                    as: "profesor", // Asegúrate de que el alias sea el correcto
                    attributes: ["id", "name", "email"], // Información del profesor
                },
                {
                    model: Usuario, // Incluir la información del alumno
                    as: "alumno", // Alias de los alumnos relacionados
                    attributes: ["id", "name", "email"],
                    where: {
                        id: alumnoId, // Filtrar por el ID del alumno para obtener solo las clases que le corresponden
                    },
                    required: true, // Esto asegura que solo se obtengan las clases en las que el alumno está inscrito
                }
            ],
        });

        // Verificar si hay clases disponibles
        if (!clases.length) {
            return res.status(404).json({ msg: "No se encontraron clases asignadas a este alumno." });
        }

        return res.status(200).json({ clases });
    } catch (error) {
        console.error("Error al obtener las clases:", error);
        return res.status(500).json({ msg: "Hubo un error al obtener las clases disponibles." });
    }
};
