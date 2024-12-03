import Usuario from "../models/usuario/Usuario.js";
import Autoescuela from "../models/autoescuela/Autoescuela.js"; // Importa el modelo de Autoescuela

/**
 * Controlador para obtener el perfil genérico basado en el rol del usuario autenticado.
 * Este controlador soporta roles de autoescuela y usuarios (administrativo, profesor, estudiante, director).
 */
export const perfil = async (req, res) => {
    const { usuario, autoescuela } = req; // Usuario o autoescuela autenticado, inyectado por el middleware `checkAuth`

    try {
        let perfilData;

        if (autoescuela) {
            // Perfil de Autoescuela
            perfilData = await Autoescuela.findByPk(autoescuela.id, {
                attributes: ["id", "name", "email", "contact_info", "address", "role"],
            });

            if (!perfilData) {
                return res.status(404).json({ msg: "Autoescuela no encontrada" });
            }
        } else if (usuario) {
            // Perfil de Usuario
            perfilData = await Usuario.findByPk(usuario.id, {
                attributes: [
                    "id",
                    "name",
                    "email",
                    "contact_info",
                    "address",
                    "dni",
                    "role",
                    "id_autoescuela",
                ],
                include: {
                    model: Autoescuela, // Incluye la autoescuela asociada
                    attributes: ["id", "name", "email", "contact_info", "address", "role"], // Selecciona los atributos de la autoescuela
                    as: 'autoescuela', // Especificamos el alias de la relación si es necesario
                }
            });

            if (!perfilData) {
                return res.status(404).json({ msg: "Usuario no encontrado" });
            }
        } else {
            return res.status(400).json({ msg: "No se encontró información del usuario o autoescuela" });
        }

        // Responder con los datos del perfil
        res.json(perfilData);
    } catch (error) {
        console.error("Error al obtener el perfil:", error);
        res.status(500).json({ msg: "Error al obtener el perfil" });
    }
};
