import { DataTypes, Model, UUIDV4 } from "sequelize";
import db from "../../config/db/connection.js";
import dayjs from "dayjs";
import { ClaseDisponible } from "../index.js";

class Clase extends Model {
    toJSON() {
        // Modifica el método toJSON para formatear fechas al enviar al frontend
        const values = { ...this.get() };

        values.fecha = values.fecha ? dayjs(values.fecha).format("DD-MM-YYYY") : null;
        values.hora = values.hora ? values.hora : null;
        values.hora_fin = values.hora_fin ? values.hora_fin : null;

        return values;
    }
}

Clase.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: UUIDV4,
            primaryKey: true,
        },
        fecha: {
            type: DataTypes.DATEONLY, // Fecha en formato estándar YYYY-MM-DD
            allowNull: false,
        },
        hora: {
            type: DataTypes.TIME, // Hora en formato HH:mm:ss
            allowNull: false,
        },
        duration: {
            type: DataTypes.INTEGER, // Duración en minutos
            allowNull: false,
        },
        hora_fin: {
            type: DataTypes.TIME, // Hora de fin calculada
            allowNull: true,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        id_profesor: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'usuario',
                key: 'id',
            },
        },
        id_autoescuela: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'autoescuela',
                key: 'id',
            },
        },
        id_alumno: {
            type: DataTypes.UUID,
            allowNull: true,  // El alumno no es obligatorio al crear la clase
            references: {
                model: 'usuario',
                key: 'id',
            },
        },
    },
    {
        sequelize: db,
        modelName: "Clase",
        tableName: "clase",
        hooks: {
            beforeSave: (clase) => {
                if (clase.fecha && clase.hora && clase.duration) {
                    const inicio = dayjs(`${clase.fecha}T${clase.hora}`);
                    const fin = inicio.add(clase.duration, "minute");
                    clase.hora_fin = fin.format("HH:mm");
                }
            },
            afterCreate: async (clase, options) => {
                // Después de crear la clase, debemos restar una clase disponible al alumno que asistió
                if (clase.id_alumno) {
                    const t = options.transaction;  // Obtener la transacción de la operación actual
                    try {
                        let claseDisponible = await ClaseDisponible.findOne({
                            where: { id_usuario: clase.id_alumno },
                            transaction: t,
                        });

                        if (!claseDisponible) {
                            claseDisponible = await ClaseDisponible.create(
                                {
                                    id_usuario: clase.id_alumno,
                                    clases_disponibles: 0,  // Inicializamos a 0 si no existe
                                },
                                { transaction: t }
                            );
                        }

                        if (claseDisponible.clases_disponibles > 0) {
                            claseDisponible.clases_disponibles -= 1;
                            await claseDisponible.save({ transaction: t });
                        } else {
                            throw new Error('El alumno no tiene suficientes clases disponibles.');
                        }
                    } catch (error) {
                        console.error('Error al actualizar las clases disponibles:', error);
                        throw new Error('No se pudo actualizar las clases disponibles del alumno.');
                    }
                }
            },
        },
    }
);


export default Clase;
