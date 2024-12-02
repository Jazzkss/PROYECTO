import { DataTypes, Model, UUIDV4 } from 'sequelize';
import db from '../../config/db/connection.js';

class PagoClase extends Model {}

PagoClase.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    id_usuario: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'usuario', // Asegúrate de que 'usuario' es el nombre correcto de la tabla de usuarios
        key: 'id',
      },
    },
    id_clase_disponible: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'clasedisponible', // Asegúrate de que 'clasedisponible' es el nombre correcto de la tabla de clases disponibles
        key: 'id',
      },
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    sequelize: db,
    modelName: 'PagoClase',
    tableName: 'pagoclase', // Nombre de la tabla en la base de datos
  }
);

export default PagoClase;
