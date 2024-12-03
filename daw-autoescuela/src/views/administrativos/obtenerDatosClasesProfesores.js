import Usuario from "../../models/usuario/Usuario.js";
import Autoescuela from "../../models/autoescuela/Autoescuela.js";
import Clase from "../../models/clase/clase.js";
import ClaseDisponible from "../../models/clasedisponible/ClaseDisponible.js";
import { Op } from 'sequelize';
import moment from "moment";

export const obtenerDatosProfesoresAutoescuela = async (req, res) => {
    const administrativoId = req.usuario.id;
    const { page = 1, pageSize = 10 } = req.query;  // Paginación (por defecto: página 1, 10 clases por página)
    const { profeId } = req.params;
    const { tipoFiltro } = req.query;  // Parámetro para seleccionar el tipo de filtro

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
            // Obtener un único profesor
            const profesor = await Usuario.findOne({
                where: {
                    id: profeId,
                    id_autoescuela: usuario.autoescuela.id,
                    role: 'profesor',
                },
                attributes: ["id", "name", "email", "contact_info", "address", "dni"],
            });

            if (!profesor) {
                return res.status(404).json({ msg: "Profesor no encontrado o no pertenece a la autoescuela." });
            }

            // Filtrar clases según el tipoFiltro
            let clasesFiltradas = [];
            let totalClases = 0;

            // Si el tipoFiltro es "pasadas", se obtienen clases anteriores al día de hoy
            if (tipoFiltro === 'pasadas') {
                // Usamos la fecha de hoy como fechaInicio
                const fechaInicio = moment().startOf('day').toDate();  // Al inicio del día de hoy
                console.log('fechaInicio:', fechaInicio);  // Verifica la fecha

                clasesFiltradas = await Clase.findAll({
                    where: {
                        id_profesor: profesor.id,
                        fecha: { [Op.lt]: fechaInicio }, // Filtra clases anteriores a la fecha actual
                    },
                    attributes: ['id', 'fecha', 'hora', 'description', 'duration'],
                    include: [
                        {
                            model: Usuario,
                            as: 'profesor',
                            attributes: ['id', 'name', 'email'],
                        },
                        {
                            model: Usuario,
                            as: 'alumno',
                            where: { id_autoescuela: usuario.autoescuela.id },
                            attributes: ['id', 'name', 'email', 'contact_info', 'address'],
                        },
                    ],
                    limit: pageSize,
                    offset: (page - 1) * pageSize, // Paginación
                });

                totalClases = await Clase.count({
                    where: {
                        id_profesor: profesor.id,
                        fecha: { [Op.lt]: fechaInicio }, // Filtra clases anteriores a la fecha actual
                    },
                });
                console.log('Total clases pasadas:', totalClases);  // Verifica el total de clases
            }
            
            else if (tipoFiltro === 'futuras') {
                // Si el filtro es "futuras", usamos la fecha actual como fechaFin
                const fechaFin = moment().endOf('day').toDate();  // Al final del día de hoy
                console.log('fechaFin:', fechaFin);  // Verifica la fecha

                clasesFiltradas = await Clase.findAll({
                    where: {
                        id_profesor: profesor.id,
                        fecha: { [Op.gt]: fechaFin }, // Filtra clases posteriores a la fecha actual
                    },
                    attributes: ['id', 'fecha', 'hora', 'description', 'duration'],
                    include: [
                        {
                            model: Usuario,
                            as: 'profesor',
                            attributes: ['id', 'name', 'email'],
                        },
                        {
                            model: Usuario,
                            as: 'alumno',
                            where: { id_autoescuela: usuario.autoescuela.id },
                            attributes: ['id', 'name', 'email', 'contact_info', 'address'],
                        },
                    ],
                    limit: pageSize,
                    offset: (page - 1) * pageSize, // Paginación
                });

                totalClases = await Clase.count({
                    where: {
                        id_profesor: profesor.id,
                        fecha: { [Op.gt]: fechaFin }, // Filtra clases posteriores a la fecha actual
                    },
                });
                console.log('Total clases futuras:', totalClases);  // Verifica el total de clases
            }

            // Si no se especifica tipoFiltro, se asume "futuras" (clases después de la fechaFin)
            else {
                clasesFiltradas = await Clase.findAll({
                    where: {
                        id_profesor: profesor.id,
                        fecha: { [Op.gt]: moment().endOf('day').toDate() }, // Filtra clases futuras después de hoy
                    },
                    attributes: ['id', 'fecha', 'hora', 'description', 'duration'],
                    include: [
                        {
                            model: Usuario,
                            as: 'profesor',
                            attributes: ['id', 'name', 'email'],
                        },
                        {
                            model: Usuario,
                            as: 'alumno',
                            where: { id_autoescuela: usuario.autoescuela.id },
                            attributes: ['id', 'name', 'email', 'contact_info', 'address'],
                        },
                    ],
                    limit: pageSize,
                    offset: (page - 1) * pageSize, // Paginación
                });
                totalClases = await Clase.count({
                    where: {
                        id_profesor: profesor.id,
                        fecha: { [Op.gt]: moment().endOf('day').toDate() }, // Filtra clases futuras después de hoy
                    },
                });
            }

            // Para cada clase, obtener las clases disponibles correspondientes al alumno
            const obtenerClasesConDisponibles = async (clases) => {
                return Promise.all(clases.map(async (clase) => {
                    const clasesDisponibles = await ClaseDisponible.findAll({
                        where: { id_usuario: clase.alumno.id },
                        attributes: ['clases_disponibles'],
                    });

                    return {
                        id: clase.id,
                        fecha: clase.fecha,
                        hora: clase.hora,
                        descripcion: clase.description,
                        duration: clase.duration,
                        alumno: {
                            id: clase.alumno.id,
                            nombre: clase.alumno.name,
                            email: clase.alumno.email,
                            telefono: clase.alumno.contact_info,
                            direccion: clase.alumno.address,
                        },
                        clasesDisponibles: clasesDisponibles.map(cd => cd.clases_disponibles),
                    };
                }));
            };

            const clasesConDisponibles = await obtenerClasesConDisponibles(clasesFiltradas);

            // Responder con la información estructurada
            return res.status(200).json({
                profesor: {
                    id: profesor.id,
                    nombre: profesor.name,
                    email: profesor.email,
                    telefono: profesor.contact_info,
                    direccion: profesor.address,
                    dni: profesor.dni,
                    clases: clasesConDisponibles,
                    totalClases,  // Número total de clases disponibles para paginación
                    page,
                    pageSize,
                }
            });

        } else {
            return res.status(404).json({ msg: "Profesor no especificado." });
        }

    } catch (error) {
        console.error("Error al obtener los datos de los profesores:", error);
        return res.status(500).json({ msg: "Hubo un error al obtener los datos de los profesores." });
    }
};
