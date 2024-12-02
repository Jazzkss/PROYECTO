import db from "../config/db/connection.js";
import Autoescuela from "./autoescuela/Autoescuela.js";
import Usuario from "./usuario/Usuario.js";
import Clase from "./clase/clase.js";
import ClaseDisponible from "./clasedisponible/ClaseDisponible.js";
import PagoClase from "./pagoclase/PagoClase.js";

// RELACION AUTOESCUELA A USUARIO (USUARIO PERTENECE A AUTOESCUELA)
Autoescuela.hasMany(Usuario, { foreignKey: 'id_autoescuela', as: 'usuarios' });
Usuario.belongsTo(Autoescuela, { foreignKey: 'id_autoescuela', as: 'autoescuela' });


// RELACION ENTRE CLASE Y USUARIO (CLASE PERTENECE A UN PROFESOR)
Usuario.hasMany(Clase, { foreignKey: "id_profesor", as: "clases_profesor" });
Clase.belongsTo(Usuario, { foreignKey: "id_profesor", as: "profesor" });

// RELACION ENTRE CLASE Y AUTOESCUELA (CLASE PERTENECE A UNA AUTOESCUELA)
Autoescuela.hasMany(Clase, { foreignKey: "id_autoescuela", as: "clases" });
Clase.belongsTo(Autoescuela, { foreignKey: "id_autoescuela", as: "autoescuela" });

// Relación entre Usuario y Clase (Alumno)
Usuario.hasMany(Clase, { foreignKey: 'id_alumno', as: 'clases_alumno' });
Clase.belongsTo(Usuario, { foreignKey: 'id_alumno', as: 'alumno' });

// Relación entre Clase y ClaseDisponible
ClaseDisponible.belongsTo(Usuario, { foreignKey: 'id_usuario' });  // Relación donde el alumno se vincula con el usuario que toma la clase
Usuario.hasMany(ClaseDisponible, { foreignKey: 'id_usuario', as: 'clases_disponibles' });

// Relación entre Usuario y ClaseDisponible
Usuario.hasMany(ClaseDisponible, { foreignKey: 'id_usuario', as: 'clases_disponibles_usuario' }); // Change alias here
ClaseDisponible.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' }); // Keep alias as 'usuario'


// Relación entre PagoClase y Usuario
Usuario.hasMany(PagoClase, { foreignKey: 'id_usuario', as: 'pagos' });
PagoClase.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });

// Relación entre PagoClase y ClaseDisponible
ClaseDisponible.hasMany(PagoClase, { foreignKey: 'id_clase_disponible', as: 'pagos_clase_disponible' });
PagoClase.belongsTo(ClaseDisponible, { foreignKey: 'id_clase_disponible', as: 'claseDisponible' });



// Exportar todos los modelos y la conexión a la base de datos
export {
    db,
    Autoescuela,
    Usuario,
    Clase,
    ClaseDisponible,
};
