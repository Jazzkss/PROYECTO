import { DataTypes, Model, UUIDV4 } from "sequelize";
import db from "../../config/db/connection.js";

class ClaseDisponible extends Model {}

ClaseDisponible.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
    },
    id_usuario: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'usuario',
            key: 'id',
        },
    },
    clases_disponibles: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0, // Inicialmente sin clases asignadas
    },
}, {
    sequelize: db,
    modelName: 'ClaseDisponible',
    tableName: 'clasedisponible'
});



export default ClaseDisponible;