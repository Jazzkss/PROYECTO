import Usuario from "../models/usuario/Usuario.js";
import Clase from "../models/clase/clase.js";
import ClaseDisponible from "../models/clasedisponible/ClaseDisponible.js";

export const verclases = async (req, res) => {
    const { id: profesorId } = req.usuario; // Extraemos el ID del profesor desde la sesión o token

    try {
        // Buscar las clases asociadas al profesor
        const clases = await Clase.findAll({
            where: { id_profesor: profesorId }, // Clases asignadas al profesor actual
            include: [
                {
                    model: Usuario, // Incluye la información del alumno
                    as: "alumno",
                    attributes: ["id", "name", "email"],
                    include: [
                        {
                            model: ClaseDisponible, // Relación con las clases disponibles del alumno
                            as: "clases_disponibles_usuario", // Alias correcto según tus relaciones
                            attributes: ["clases_disponibles"], // Solo traemos el número de clases disponibles
                        },
                    ],
                },
                {
                    model: Usuario, // Incluye la información del profesor
                    as: "profesor",
                    attributes: ["id", "name", "email"],
                },
            ],
        });

        if (!clases.length) {
            return res.status(404).json({ msg: "No se encontraron clases asignadas a este profesor." });
        }

        res.status(200).json({ clases });
    } catch (error) {
        console.error("Error al obtener las clases:", error);
        res.status(500).json({ msg: "Hubo un error al obtener las clases." });
    }
};
