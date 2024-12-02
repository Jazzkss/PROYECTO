import Usuario from "../models/usuario/Usuario.js";
import Clase from "../models/clase/clase.js";

export const veralumnos = async (req, res) => {
    const { id: profesorId } = req.usuario; // Extraemos el ID del profesor desde la sesión o token

    try {
        // Buscar los alumnos únicos asociados al profesor mediante las clases
        const alumnos = await Usuario.findAll({
            include: [
                {
                    model: Clase,
                    as: "clases_alumno", // Relación del alumno con las clases
                    attributes: [], // No necesitamos datos de la clase
                    where: { id_profesor: profesorId }, // Filtrar por el profesor
                },
            ],
            attributes: ["id", "name", "email"], // Datos básicos del alumno
            distinct: true, // Evitar duplicados
        });

        if (!alumnos.length) {
            return res.status(404).json({ msg: "No se encontraron alumnos para este profesor." });
        }

        res.status(200).json({ alumnos });
    } catch (error) {
        console.error("Error al obtener los alumnos:", error);
        res.status(500).json({ msg: "Hubo un error al obtener los alumnos." });
    }
};