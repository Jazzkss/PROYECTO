import Usuario from "../../models/usuario/Usuario.js";
import Autoescuela from "../../models/autoescuela/Autoescuela.js";

export const obtenerProfesoresAutoescuela = async (req, res) => {
    const administrativoId = req.usuario.id; // ID del administrativo autenticado
    const { page = 1, pageSize = 10 } = req.query; // Obtener la página y el tamaño de la página (por defecto 1 y 10)

    try {
        // Obtener el usuario administrativo y buscar la autoescuela a la que pertenece
        const usuario = await Usuario.findOne({
            where: { id: administrativoId }, // Buscar por id del administrativo
            include: {
                model: Autoescuela,
                as: 'autoescuela',
                attributes: ['id'], // Solo necesitamos el id de la autoescuela
            },
        });

        if (!usuario || !usuario.autoescuela) {
            return res.status(404).json({ msg: "Autoescuela no encontrada." });
        }

        // Obtener los profesores de la autoescuela correcta con paginación
        const profesores = await Usuario.findAndCountAll({
            where: {
                id_autoescuela: usuario.autoescuela.id, // Aseguramos que los profesores son de la misma autoescuela
                role: 'profesor', // Filtramos solo por profesores
            },
            attributes: ["id", "name", "email"], // Traemos los datos básicos del usuario
            limit: pageSize,  // Número de profesores por página
            offset: (page - 1) * pageSize,  // Calcular el offset para la paginación
        });

        return res.status(200).json({
            profesores: profesores.rows,
            total: profesores.count,
            page,
            pageSize,
            totalPages: Math.ceil(profesores.count / pageSize),
        });
    } catch (error) {
        console.error("Error al obtener los profesores de la autoescuela:", error);
        return res.status(500).json({ msg: "Hubo un error al obtener los profesores." });
    }
};
