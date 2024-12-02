import Usuario from "../models/usuario/Usuario.js";
import Clase from "../models/clase/clase.js";

export const contarAlumnos = async (req, res) => {
    const { id: profesorId } = req.usuario; // Extraemos el ID del profesor desde la sesión o token

    try {
        // Contar los alumnos únicos asociados al profesor mediante las clases
        const numAlumnos = await Usuario.count({
            include: [
                {
                    model: Clase,
                    as: "clases_alumno", // Relación del alumno con las clases
                    attributes: [], // No necesitamos datos de la clase
                    where: { id_profesor: profesorId }, // Filtrar por el profesor
                },
            ],
            distinct: true, // Evitar duplicados
        });

        res.status(200).json({ totalAlumnos: numAlumnos });
    } catch (error) {
        console.error("Error al contar los alumnos:", error);
        res.status(500).json({ msg: "Hubo un error al contar los alumnos." });
    }
};