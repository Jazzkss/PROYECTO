import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db/connection.js';
import { PORT } from './config/db/config.js';
import autoescuela from './routes/autoescuelaRoutes.js';
import authRouter from './routes/authRoutes.js';
import usuarioRouter from './routes/usuarioRoutes.js';
import claseRouter from './routes/claseRoutes.js';
import pagoClaseRoutes from './routes/pagoClaseRoutes.js';
import profesoresRoutes from './routes/routesViews/rutasprofesores/profesoresRoutes.js';
import alumnosRoutes from './routes/routesViews/rutasalumnos/alumnoRoutes.js';
import administrativoRoutes from './routes/routesViews/rutasdministrativo/administrativoRoutes.js';

// Conectar base de datos
connectDB();
const app = express();
const dominiosPermitidos = [process.env.FRONTEND_URL]

const corsOptions = {
    origin: function(origin, callback){
        if(dominiosPermitidos.indexOf(origin) !== -1) {
            // EL origen del request está permitido
            callback(null, true)
        } else {
            callback(new Error("No permitido por cors"))
        }
    }
}

app.use(cors(corsOptions))



app.use(express.json())


app.use('/api/autoescuelas', autoescuela)
app.use('/api/auth', authRouter)
app.use('/api/usuarios', usuarioRouter);
app.use('/api/clases', claseRouter);
app.use('/api/pagos', pagoClaseRoutes);


// RUTAS DE LAS VISTAS

// RUTAS DE LOS PROFESORES
app.use('/api/profesor', profesoresRoutes)
// RUTAS DE LOS ALUMNOS
app.use('/api/alumno', alumnosRoutes)
// RUTAS DE LOS ALUMNOS
app.use('/api/administrativo', administrativoRoutes)

app.listen(PORT, () => {
    console.log(`App funcionando en el puerto ${PORT}`)
})

