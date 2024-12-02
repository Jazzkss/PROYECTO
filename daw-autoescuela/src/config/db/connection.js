import { Sequelize } from "sequelize";
import { DATABASE_URL } from "./config.js";

const db = new Sequelize(DATABASE_URL);

// CONTECTAR DB

export const connectDB = async () => {
    try {
        db.authenticate();
        db.sync()
        console.log('Conexión exitosa a la base de datos')
    } catch (error) {
        // console.log(error)
        console.error('Hubo un error al conectar la base de datos');
    }
}


export default db;