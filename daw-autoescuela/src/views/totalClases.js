import Clase from "../models/clase/clase.js";
import Usuario from "../models/usuario/Usuario.js";
import { Op } from "sequelize"; // Para manejar rangos de fechas
import dayjs from "dayjs"; // Usamos dayjs para formatear fechas

export const obtenerEstadisticasProfesor = async (req, res) => {
    const { id: profesorId } = req.usuario; // ID del profesor extraído del token o sesión
    const { fechaInicio, fechaFin } = req.body; // Fechas opcionales para filtrar por periodo

    try {
        // Asegurarse de que las fechas estén en formato correcto (solo fecha sin hora)
        const fechaInicioFormato = fechaInicio ? dayjs(fechaInicio).format("YYYY-MM-DD") : undefined;
        const fechaFinFormato = fechaFin ? dayjs(fechaFin).format("YYYY-MM-DD") : undefined;

        // Filtrar clases por periodo (si se proporcionan fechas)
        const whereClause = {
            id_profesor: profesorId,
        };

        // Solo añadir el filtro de fechas si ambas fechas son válidas
        if (fechaInicioFormato && fechaFinFormato) {
            whereClause.fecha = {
                [Op.between]: [fechaInicioFormato, fechaFinFormato], // Filtra las fechas entre el rango
            };
        } else if (fechaInicioFormato) {
            whereClause.fecha = { [Op.gte]: fechaInicioFormato }; // Si solo se proporciona fechaInicio
        } else if (fechaFinFormato) {
            whereClause.fecha = { [Op.lte]: fechaFinFormato }; // Si solo se proporciona fechaFin
        }

        console.log("Fecha Inicio Formato:", fechaInicioFormato);
        console.log("Fecha Fin Formato:", fechaFinFormato);

        // Obtener clases impartidas
        const clases = await Clase.findAll({
            where: whereClause,
            include: [
                {
                    model: Usuario,
                    as: "alumno",
                    attributes: ["id", "name", "email"], // Traer información básica de los alumnos
                },
            ],
        });

        // Número total de clases impartidas
        const totalClasesImpartidas = clases.length;

        // Identificar alumnos activos (con clases programadas)
        const alumnosActivos = new Set(clases.map((clase) => clase.id_alumno)).size;

        // Calcular el total de horas impartidas
        let totalMinutosImpartidos = 0;
        clases.forEach((clase) => {
            // Sumamos la duración de cada clase (en minutos)
            totalMinutosImpartidos += clase.duration;
        });

        // Convertir minutos a horas y minutos
        const horasImpartidas = Math.floor(totalMinutosImpartidos / 60); // Obtener las horas
        const minutosImpartidos = totalMinutosImpartidos % 60; // Obtener los minutos restantes

        // Responder con los datos en el formato deseado
        let totalHorasImpartidas = "";

        // Si hay horas, mostramos horas y minutos
        if (horasImpartidas > 0) {
            totalHorasImpartidas += `${horasImpartidas} hora${horasImpartidas > 1 ? "s" : ""}`;
        }

        // Si hay minutos, mostramos los minutos (pueden ser 0 minutos)
        if (minutosImpartidos > 0) {
            if (totalHorasImpartidas) totalHorasImpartidas += " y ";
            totalHorasImpartidas += `${minutosImpartidos} minuto${minutosImpartidos > 1 ? "s" : ""}`;
        }

        // Si no hay horas ni minutos, mostramos 0 minutos
        if (!totalHorasImpartidas) {
            totalHorasImpartidas = "0 minutos";
        }

        res.status(200).json({
            totalClasesImpartidas,
            alumnosActivos,
            totalHorasImpartidas, // Mostrar horas y minutos, o solo minutos
        });
    } catch (error) {
        console.error("Error al obtener estadísticas del profesor:", error);
        res.status(500).json({ msg: "Hubo un error al obtener las estadísticas." });
    }
};
