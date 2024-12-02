import { DataTypes, Model, UUIDV4 } from "sequelize";
import db from "../../config/db/connection.js";
import { trimHookAuto } from "../../hooks/autoescuelaHookTrim.js";
import { hashPassword } from "../../hooks/hashPass.js";



class Usuario extends Model {} 

Usuario.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            msg: 'El correo ya existe'
        },
        validate: {
            isEmail: {
                msg: 'Agrega un correo válido'
            },
            notEmpty: {
                msg: 'Ingrese un correo electrónico'
            },
        },
    },
    contact_info: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    dni: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    role: {
        type: DataTypes.ENUM,
        values: ['administrativo', 'profesor', 'estudiante', 'director'],
        allowNull: false,
        defaultValue: 'estudiante'
    },
    id_autoescuela: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'autoescuela',
            key: 'id',
        },
    },
},{
    sequelize: db,
    modelName: 'Usuario',
    tableName: 'usuario'
})

Usuario.addHook('beforeSave', trimHookAuto);
Usuario.addHook('beforeSave', hashPassword);

export default Usuario;