import Usuario from "../../models/usuario/Usuario.js";
import Autoescuela from "../../models/autoescuela/Autoescuela.js"; // Importa el modelo de Autoescuela
import Clase from "../../models/clase/clase.js"; // Importa el modelo de Clase
import ClaseDisponible from "../../models/clasedisponible/ClaseDisponible.js"; // Importa el modelo de ClaseDisponible
import { Op } from 'sequelize'; // Importa solo el operador 'Op'
import moment from "moment"; // Asegúrate de tener moment.js para manejar fechas

export const obtenerDatosAlumnosAutoescuela = async (req, res) => {
    const administrativoId = req.usuario.id; // ID del administrativo autenticado
    const { alumnoId } = req.params; // Obtener el id del alumno de los parámetros de la URL
    const { page = 1, pageSize = 10 } = req.query; // Paginación: por defecto página 1 y 10 clases por página

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

        // Obtener el alumno específico
        const alumno = await Usuario.findOne({
            where: { id: alumnoId, id_autoescuela: usuario.autoescuela.id, role: 'estudiante' },
            attributes: ["id", "name", "email", "contact_info", "address", "dni"],
            include: {
                model: Autoescuela,
                as: 'autoescuela',
                attributes: ['id', 'name', 'contact_info', 'address', 'email'],
            },
        });

        if (!alumno) {
            return res.status(404).json({ msg: "Alumno no encontrado en esta autoescuela." });
        }

        // Obtener el número total de clases que ha tomado el alumno
        const totalClases = await Clase.count({
            where: { id_alumno: alumno.id },
        });

        // Obtener las clases pasadas (ya tomadas) del alumno con paginación
        const clasesPasadas = await Clase.findAll({
            where: {
                id_alumno: alumno.id,
                fecha: {
                    [Op.lt]: moment().format('YYYY-MM-DD'), // Filtrar por clases cuya fecha es menor a la actual
                },
            },
            attributes: ['id', 'fecha', 'hora', 'description', 'duration'],
            limit: pageSize,
            offset: (page - 1) * pageSize,
            include: [
                {
                    model: Usuario,
                    as: 'profesor',
                    attributes: ['id', 'name', 'email'],
                },
            ],
        });

        // Obtener las clases disponibles para el alumno
        const clasesDisponibles = await ClaseDisponible.findAll({
            where: { id_usuario: alumno.id },
            attributes: ['id', 'clases_disponibles'],
        });

        // Obtener las clases futuras (no asignadas) para el alumno con paginación
        const clasesFuturas = await Clase.findAll({
            where: {
                id_alumno: alumno.id,
                id_autoescuela: usuario.autoescuela.id,
                fecha: {
                    [Op.gt]: moment().format('YYYY-MM-DD'), // Filtrar por clases cuya fecha es mayor a la actual
                },
            },
            attributes: ['id', 'fecha', 'hora', 'description', 'duration'],
            limit: pageSize,
            offset: (page - 1) * pageSize,
            include: [
                {
                    model: Usuario,
                    as: 'profesor',
                    attributes: ['id', 'name', 'email'],
                },
            ],
        });

        // Añadir las clases pasadas, disponibles y futuras al objeto del alumno
        alumno.clasesPasadas = clasesPasadas;
        alumno.clasesDisponibles = clasesDisponibles.length > 0 ? clasesDisponibles : [];
        alumno.clasesFuturas = clasesFuturas;

        // Devolvemos la respuesta con todos los datos del alumno
        return res.status(200).json({
            alumno: {
                id: alumno.id,
                nombre: alumno.name,
                email: alumno.email,
                telefono: alumno.contact_info,
                direccion: alumno.address,
                dni: alumno.dni,
                autoescuela: alumno.autoescuela,
                totalClases: totalClases,
                clasesPasadas: alumno.clasesPasadas.map(clase => ({
                    id: clase.id,
                    fecha: clase.fecha,
                    hora: clase.hora,
                    descripcion: clase.description,
                    duration: clase.duration,
                    profesor: clase.profesor,
                })),
                clasesDisponibles: alumno.clasesDisponibles.map(clase => ({
                    id: clase.id,
                    clasesDisponibles: clase.clases_disponibles,
                })),
                clasesFuturas: alumno.clasesFuturas.map(clase => ({
                    id: clase.id,
                    fecha: clase.fecha,
                    hora: clase.hora,
                    descripcion: clase.description,
                    duration: clase.duration,
                    profesor: clase.profesor,
                })),
            },
            page: page,
            pageSize: pageSize,
            totalClases: totalClases,
            totalPages: Math.ceil(totalClases / pageSize),
        });
    } catch (error) {
        console.error("Error al obtener los datos del alumno:", error);
        return res.status(500).json({ msg: "Hubo un error al obtener los datos del alumno." });
    }
};