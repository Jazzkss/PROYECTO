import Autoescuela from "../models/autoescuela/Autoescuela.js";
import { Usuario } from "../models/index.js";
import { comparePassHash } from "../helpers/comparePass.js";
import { crearJWT } from "../helpers/crearJsonWebToken.js";
import { createDirector } from "../helpers/primerDirector.js";

const registrar = async ( req, res ) => {

    const { name, email, password } = req.body;

    if(!name || !email || !password) {
        const error = new Error('Los campos nombre, email y constraseña son obligatorios');
        return res.status(400).json({ msg: error.message });
    }

    try {
        // REVISAR SI UN USUARIO ESTA REGISTRADO
        const existeEmail = await Autoescuela.findOne({ 
            where: {
                email
            }
        })

        const existeEmailUsuario = await Usuario.findOne({
            where: {
                email
            }
        })

        // PREVENIR DUPLICADOS
        if(existeEmail || existeEmailUsuario) {
            const error = new Error('Usuario ya registrado');
            return res.status(400).json({msg: error.message});
        }

        // GUARDAR AUTOESCUELA
        const autoescuela = new Autoescuela(req.body)
        const autoescuelaGuardada = await autoescuela.save()



        const directorGuardado = await createDirector(autoescuelaGuardada);


        // RESPONDER CON AMBOS RESULTADOS
        res.status(201).json({
            msg: 'Autoescuela registrada exitosamente',
            autoescuela,
            director: directorGuardado,
        });
    } catch (error) {
        console.log(error)
    }
}


const perfil = ( req, res ) => {
    
    const { autoescuela } = req
    
    res.json({ autoescuela })
}

export {
    registrar,
    perfil,
}