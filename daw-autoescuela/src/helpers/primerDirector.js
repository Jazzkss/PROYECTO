import { Usuario } from "../models/index.js";

export const createDirector = async (autoescuela) => {

    const { name, password, id } = autoescuela;

    // Formatear el nombre de la autoescuela para ser utilizado en el correo (sin espacios y en minúsculas)
    const autoescuelaNameFormatted = autoescuela.name.replace(/ /g, '').toLowerCase();

    // Generar una cadena aleatoria (sufijo) para asegurar la unicidad del correo del director
    const randomSuffix = Math.random().toString(36).substring(2, 8);  // Genera una cadena aleatoria de 6 caracteres
    
    // Crear un correo único para el director con el nombre de la autoescuela + el sufijo aleatorio
    const directorEmail = `${autoescuelaNameFormatted}_${randomSuffix}@${autoescuelaNameFormatted}.com`;


    const director = new Usuario({
        name: `Director ${name}`,
        email: directorEmail,
        password,
        role: 'director',
        id_autoescuela: id,
    })

    const directorGuardado = await director.save();

    return directorGuardado;
}