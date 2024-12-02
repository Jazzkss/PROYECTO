import Autoescuela from "../models/autoescuela/Autoescuela.js";
import Usuario from "../models/usuario/Usuario.js";
import { comparePassHash } from "../helpers/comparePass.js";
import { crearJWT } from "../helpers/crearJsonWebToken.js";

const autenticar = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar en autoescuelas
        let usuario = await Autoescuela.findOne({ where: { email } });

        // Si no es una autoescuela, buscar en usuarios
        if (!usuario) {
            usuario = await Usuario.findOne({ where: { email } });
        }

        if (!usuario) {
            return res.status(401).json({ msg: 'El usuario no existe' });
        }

        // Verificar contraseña
        const isPasswordCorrect = await comparePassHash(password, usuario.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ msg: 'La contraseña es incorrecta' });
        }

        // Generar y devolver token
        res.json({ token: crearJWT(usuario.id) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};


export {
    autenticar,
}