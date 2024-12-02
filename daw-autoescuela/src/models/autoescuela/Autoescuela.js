import { DataTypes, Model, UUIDV4 } from "sequelize";
import db from "../../config/db/connection.js";
import { trimHookAuto } from "../../hooks/autoescuelaHookTrim.js";
import { hashPassword } from "../../hooks/hashPass.js";



class Autoescuela extends Model {} 

Autoescuela.init({
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
    token: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'autoescuela',
        allowNull: false,

    },
},{
    sequelize: db,
    modelName: 'Autoescuela',
    tableName: 'autoescuela'
})

Autoescuela.addHook('beforeSave', trimHookAuto);
Autoescuela.addHook('beforeSave', hashPassword);

export default Autoescuela;