import { Op, Sequelize } from 'sequelize';
import Clase from "../models/clase/clase.js";
import Usuario from "../models/usuario/Usuario.js";
import { Autoescuela, ClaseDisponible } from "../models/index.js";
import dayjs from "dayjs";

export const crearClase = async (req, res) => {
    const { id_profesor, id_alumno, fecha, hora, duration, description } = req.body;
    const autoescuela_id = req.usuario?.id_autoescuela;

    // Validar que el ID de la autoescuela esté presente
    if (!autoescuela_id) {
        return res.status(400).json({ msg: "El ID de la autoescuela es obligatorio." });
    }

    // Validar que fecha, hora y duración sean obligatorios
    if (!fecha || !hora || !duration) {
        return res.status(400).json({ msg: "Fecha, hora y duración son obligatorias." });
    }

    // Validar que la duración sea un número positivo
    if (duration <= 0) {
        return res.status(400).json({ msg: "La duración debe ser un valor positivo." });
    }

    // Validar formato de la hora
    const horaRegex = /^([0-1]?[0-9]|2[0-3]):([0-5]?[0-9]):([0-5]?[0-9])$/;
    if (!horaRegex.test(hora)) {
        return res.status(400).json({ msg: "La hora no tiene un formato válido (HH:mm:ss)." });
    }

    try {
        // Verificar que la autoescuela existe
        const autoescuela = await Autoescuela.findByPk(autoescuela_id);
        if (!autoescuela) {
            return res.status(404).json({ msg: "La autoescuela no existe." });
        }

        let profesor = null;
        let alumno = null;

        // Validar el profesor
        if (id_profesor) {
            profesor = await Usuario.findOne({
                where: {
                    id: id_profesor,
                    role: 'profesor',
                    id_autoescuela: autoescuela_id,
                },
            });
            // Primero obtenemos los alumnos activos para un profesor específico
            const alumnosActivos = await Clase.findAll({
                where: {
                    id_profesor: profesor.id,
                    fecha: { [Op.ne]: null }, // Aseguramos que la fecha sea válida
                },
                attributes: ['id_alumno'], // Solo seleccionamos el campo 'id_alumno'
            }).then(clases => {
                return clases.map(clase => clase.id_alumno);
            });

            // Luego usamos esos IDs en la consulta de ClaseDisponible para contar los alumnos activos
            const countAlumnosActivos = await ClaseDisponible.count({
                where: {
                    id_usuario: {
                        [Op.in]: alumnosActivos,  // Lista de IDs de alumnos activos
                    },
                    clases_disponibles: {
                        [Op.gt]: 0, // Alumnos con al menos 1 clase restante
                    },
                },
            });

            if (countAlumnosActivos >= 20) {
                return res.status(400).json({ msg: "El profesor ya tiene 20 alumnos activos." });
            }
            if (!profesor) {
                return res.status(404).json({ msg: "El profesor no existe o no pertenece a esta autoescuela." });
            }

            // Verificar disponibilidad del profesor
            const conflictoProfesor = await verificarConflictoHorario(profesor.id, fecha, hora, duration);
            if (conflictoProfesor) {
                return res.status(400).json({ msg: "El profesor tiene un conflicto de horario con otra clase." });
            }
        }

        // Si no hay ID de profesor, asignar automáticamente
        if (!id_profesor && id_alumno) {
            // Buscar si el alumno tiene un profesor asignado en una clase existente
            const claseExistente = await Clase.findOne({
                where: { id_alumno, id_profesor: { [Op.not]: null } },
                order: [["fecha", "DESC"]],
            });

            if (claseExistente) {
                profesor = await Usuario.findOne({ where: { id: claseExistente.id_profesor } });
            } else {
                // Si no tiene un profesor asignado, buscar uno disponible
                const profesores = await Usuario.findAll({
                    where: { role: "profesor", id_autoescuela: autoescuela_id },
                });

                if (!profesores.length) {
                    return res.status(404).json({ msg: "No hay profesores disponibles en esta autoescuela." });
                }

                const profesoresDisponibles = await Promise.all(
                    profesores.map(async (prof) => {
                        const conflicto = await verificarConflictoHorario(prof.id, fecha, hora, duration);
                        return conflicto ? null : prof;
                    })
                );

                const disponibles = profesoresDisponibles.filter(Boolean);
                if (!disponibles.length) {
                    return res.status(400).json({ msg: "No hay profesores disponibles en esta fecha, hora y duración." });
                }

                profesor = disponibles[Math.floor(Math.random() * disponibles.length)];
            }
        }

        // Validar si el alumno existe y pertenece a la autoescuela
        if (id_alumno) {
            alumno = await Usuario.findOne({
                where: {
                    id: id_alumno,
                    role: 'estudiante',
                    id_autoescuela: autoescuela_id,
                },
            });

            if (!alumno) {
                return res.status(404).json({ msg: "El alumno no existe o no pertenece a esta autoescuela." });
            }

            // Validar si el alumno ya tiene una clase con conflicto de horario
            const conflictoAlumno = await verificarConflictoAlumno(id_alumno, fecha, hora, duration, id_profesor);
            if (conflictoAlumno) {
                return res.status(400).json({ msg: "El alumno ya tiene una clase en ese horario con otro profesor." });
            }

            // Validar si el alumno tiene clases disponibles
            const claseDisponible = await ClaseDisponible.findOne({ where: { id_usuario: id_alumno } });
            if (!claseDisponible || claseDisponible.clases_disponibles <= 0) {
                return res.status(400).json({ msg: "El alumno no tiene suficientes clases disponibles." });
            }
        }

        // Validar que un profesor esté asignado
        if (!profesor) {
            return res.status(400).json({ msg: "No se pudo asignar un profesor para la clase." });
        }

        if(!alumno) {
            return res.status(400).json({ msg: "No se pudo asignar un alumno para la clase." });
        }

        // Crear la clase
        const formattedFecha = dayjs(fecha, "YYYY-MM-DD").format("YYYY-MM-DD");
        const nuevaClase = await Clase.create({
            id_profesor: profesor.id,
            id_autoescuela: autoescuela_id,
            fecha: formattedFecha,
            hora,
            duration,
            description,
            id_alumno: alumno ? alumno.id : null, // Asignar el alumno si existe
        });

        // Obtener la clase con profesor y alumno
        const claseConProfesorYAlumno = await Clase.findOne({
            where: { id: nuevaClase.id },
            include: [
                {
                    model: Usuario,
                    as: "profesor",
                    attributes: ["name", "email"],
                },
                {
                    model: Usuario,
                    as: "alumno", // Relación en el modelo de la clase
                    attributes: ["name", "email"],
                },
            ],
        });

        res.status(201).json({ msg: "Clase creada exitosamente", clase: claseConProfesorYAlumno });

    } catch (error) {
        console.error("Error al crear la clase:", error.message);
        if (error.message.includes("El alumno no tiene suficientes clases disponibles")) {
            return res.status(400).json({ msg: error.message });
        }
        res.status(500).json({ msg: "Hubo un error al crear la clase." });
    }
};


// Función para verificar si el alumno tiene una clase con otro profesor en el mismo horario
const verificarConflictoAlumno = async (id_alumno, fecha, hora, duration, id_profesor) => {
    const inicioNuevaClase = dayjs(`${fecha} ${hora}`, "YYYY-MM-DD HH:mm");
    const finNuevaClase = inicioNuevaClase.add(duration, "minute");

    const clasesAlumno = await Clase.findAll({
        where: {
            id_alumno,
            fecha: dayjs(fecha, "YYYY-MM-DD").format("YYYY-MM-DD"),
        },
    });

    for (const clase of clasesAlumno) {
        const inicioClaseExistente = dayjs(`${clase.fecha} ${clase.hora}`, "YYYY-MM-DD HH:mm");
        const finClaseExistente = inicioClaseExistente.add(clase.duration, "minute");

        // Verificar si el alumno tiene clase en el mismo horario y con un profesor diferente
        if (
            (inicioNuevaClase.isBefore(finClaseExistente) && inicioNuevaClase.isAfter(inicioClaseExistente)) || 
            (finNuevaClase.isAfter(inicioClaseExistente) && finNuevaClase.isBefore(finClaseExistente)) || 
            (inicioNuevaClase.isSame(inicioClaseExistente) || finNuevaClase.isSame(finClaseExistente))
        ) {
            // Si la clase existe con otro profesor, retornar true
            if (clase.id_profesor !== id_profesor) {
                return true;
            }
        }
    }

    return false;
};

// Función para verificar conflictos de horario
const verificarConflictoHorario = async (id_profesor, fecha, hora, duration) => {
    const inicioNuevaClase = dayjs(`${fecha} ${hora}`, "YYYY-MM-DD HH:mm");
    const finNuevaClase = inicioNuevaClase.add(duration, "minute");

    const clasesProfesor = await Clase.findAll({
        where: {
            id_profesor,
            fecha: dayjs(fecha, "YYYY-MM-DD").format("YYYY-MM-DD"),
        },
    });

    for (const clase of clasesProfesor) {
        const inicioClaseExistente = dayjs(`${clase.fecha} ${clase.hora}`, "YYYY-MM-DD HH:mm");
        const finClaseExistente = inicioClaseExistente.add(clase.duration, "minute");

        if (
            (inicioNuevaClase.isBefore(finClaseExistente) && inicioNuevaClase.isAfter(inicioClaseExistente)) || 
            (finNuevaClase.isAfter(inicioClaseExistente) && finNuevaClase.isBefore(finClaseExistente)) || 
            (inicioNuevaClase.isSame(inicioClaseExistente) || finNuevaClase.isSame(finClaseExistente))
        ) {
            return true;
        }
    }

    return false;
};





// Obtener todas las clases de una autoescuela
export const obtenerClases = async (req, res) => {
    const { id_autoescuela } = req.params;

    try {
        const clases = await Clase.findAll({
            where: { id_autoescuela },
            include: [{ model: Usuario, as: "profesor", attributes: ["id", "name", "email"] }],
        });

        res.status(200).json({ clases });
    } catch (error) {
        console.error("Error al obtener las clases:", error);
        res.status(500).json({ msg: "Hubo un error al obtener las clases." });
    }
};