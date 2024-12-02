import Usuario from "../../models/usuario/Usuario.js";
import Autoescuela from "../../models/autoescuela/Autoescuela.js"; // Importa el modelo de Autoescuela
import Clase from "../../models/clase/clase.js"; // Importa el modelo de Clase
import { Op } from 'sequelize'; // Importa el operador 'Op'
import moment from "moment"; // Asegúrate de tener moment.js para manejar fechas

export const obtenerDatosProfesoresAutoescuela = async (req, res) => {
    const administrativoId = req.usuario.id; // ID del administrativo autenticado
    const { page = 1, pageSize = 10 } = req.query; // Paginación: por defecto página 1 y 10 clases por página
    const { profeId } = req.params; // Obtener el profeId desde los parámetros de la URL

    try {
        // Obtener el usuario administrativo y buscar la autoescuela a la que pertenece
        const usuario = await Usuario.findOne({
            where: { id: administrativoId },
            include: {
                model: Autoescuela,
                as: 'autoescuela',
                attributes: ['id'],
            },
        });

        if (!usuario || !usuario.autoescuela) {
            return res.status(404).json({ msg: "Autoescuela no encontrada." });
        }

        if (profeId) {
            // Si se pasa un profeId, obtener solo ese profesor
            const profesor = await Usuario.findOne({
                where: {
                    id: profeId, // Usamos el profeId de los parámetros de la URL
                    id_autoescuela: usuario.autoescuela.id, // Aseguramos que el profesor pertenece a la misma autoescuela
                    role: 'profesor', // Filtramos solo por profesores
                },
                attributes: ["id", "name", "email", "contact_info", "address", "dni"],
            });

            if (!profesor) {
                return res.status(404).json({ msg: "Profesor no encontrado o no pertenece a la autoescuela." });
            }

            // Obtener las clases pasadas (ya impartidas) para el profesor
            const clasesPasadas = await Clase.findAll({
                where: {
                    id_profesor: profesor.id,
                    fecha: {
                        [Op.lt]: moment().format('YYYY-MM-DD'),
                    },
                },
                attributes: ['id', 'fecha', 'hora', 'description', 'duration', 'id_profesor'],
                include: [
                    {
                        model: Usuario,
                        as: 'profesor',
                        attributes: ['id', 'name', 'email'],
                    },
                ],
            });

            // Obtener las clases futuras (no impartidas) para el profesor
            const clasesFuturas = await Clase.findAll({
                where: {
                    id_profesor: profesor.id,
                    fecha: {
                        [Op.gt]: moment().format('YYYY-MM-DD'),
                    },
                },
                attributes: ['id', 'fecha', 'hora', 'description', 'duration', 'id_profesor'],
                include: [
                    {
                        model: Usuario,
                        as: 'profesor',
                        attributes: ['id', 'name', 'email'],
                    },
                ],
            });

            // Añadir las clases pasadas y futuras al objeto del profesor
            profesor.clasesPasadas = clasesPasadas;
            profesor.clasesFuturas = clasesFuturas;

            // Devolvemos la respuesta con los datos del profesor
            return res.status(200).json({
                id: profesor.id,
                nombre: profesor.name,
                email: profesor.email,
                telefono: profesor.contact_info,
                direccion: profesor.address,
                dni: profesor.dni,
                clasesPasadas: profesor.clasesPasadas.map(clase => ({
                    id: clase.id,
                    fecha: clase.fecha,
                    hora: clase.hora,
                    descripcion: clase.description,
                    duration: clase.duration,
                    profesor: clase.profesor,
                })),
                clasesFuturas: profesor.clasesFuturas.map(clase => ({
                    id: clase.id,
                    fecha: clase.fecha,
                    hora: clase.hora,
                    descripcion: clase.description,
                    duration: clase.duration,
                    profesor: clase.profesor,
                })),
            });
        }

        // Si no se pasa un profeId, obtenemos todos los profesores con paginación
        const profesores = await Usuario.findAndCountAll({
            where: {
                id_autoescuela: usuario.autoescuela.id, // Aseguramos que los profesores sean de la misma autoescuela
                role: 'profesor', // Filtramos solo por profesores
            },
            attributes: ["id", "name", "email", "contact_info", "address", "dni"],
            limit: pageSize,  // Número de profesores por página
            offset: (page - 1) * pageSize,  // Calcular el offset para la paginación
        });

        // Obtener las clases pasadas (ya impartidas) para los profesores
        const clasesPasadas = await Clase.findAll({
            where: {
                id_profesor: {
                    [Op.in]: profesores.rows.map(profesor => profesor.id), // Filtramos por los profesores
                },
                fecha: {
                    [Op.lt]: moment().format('YYYY-MM-DD'), // Filtrar por clases cuya fecha es menor a la actual
                },
            },
            attributes: ['id', 'fecha', 'hora', 'description', 'duration', 'id_profesor'],
            include: [
                {
                    model: Usuario,
                    as: 'profesor',
                    attributes: ['id', 'name', 'email'],
                },
            ],
        });

        // Obtener las clases futuras (no impartidas) para los profesores
        const clasesFuturas = await Clase.findAll({
            where: {
                id_profesor: {
                    [Op.in]: profesores.rows.map(profesor => profesor.id), // Filtramos por los profesores
                },
                fecha: {
                    [Op.gt]: moment().format('YYYY-MM-DD'), // Filtrar por clases cuya fecha es mayor a la actual
                },
            },
            attributes: ['id', 'fecha', 'hora', 'description', 'duration', 'id_profesor'],
            include: [
                {
                    model: Usuario,
                    as: 'profesor',
                    attributes: ['id', 'name', 'email'],
                },
            ],
        });

        // Añadir las clases pasadas y futuras a cada profesor
        profesores.rows.forEach(profesor => {
            profesor.clasesPasadas = clasesPasadas.filter(clase => clase.id_profesor === profesor.id);
            profesor.clasesFuturas = clasesFuturas.filter(clase => clase.id_profesor === profesor.id);
        });

        // Devolvemos la respuesta con todos los datos de los profesores
        return res.status(200).json({
            profesores: profesores.rows.map(profesor => ({
                id: profesor.id,
                nombre: profesor.name,
                email: profesor.email,
                telefono: profesor.contact_info,
                direccion: profesor.address,
                dni: profesor.dni,
                clasesPasadas: profesor.clasesPasadas.map(clase => ({
                    id: clase.id,
                    fecha: clase.fecha,
                    hora: clase.hora,
                    descripcion: clase.description,
                    duration: clase.duration,
                    profesor: clase.profesor,
                })),
                clasesFuturas: profesor.clasesFuturas.map(clase => ({
                    id: clase.id,
                    fecha: clase.fecha,
                    hora: clase.hora,
                    descripcion: clase.description,
                    duration: clase.duration,
                    profesor: clase.profesor,
                })),
            })),
            total: profesores.count,
            page: page,
            pageSize: pageSize,
            totalPages: Math.ceil(profesores.count / pageSize),
        });
    } catch (error) {
        console.error("Error al obtener los datos de los profesores:", error);
        return res.status(500).json({ msg: "Hubo un error al obtener los datos de los profesores." });
    }
};
