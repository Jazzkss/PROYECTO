import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db/connection.js';
import { PORT } from './config/db/config.js';
import autoescuela from './routes/autoescuelaRoutes.js';
import authRouter from './routes/authRoutes.js';
// Conectar base de datos
connectDB();

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


const app = express();

app.use(express.json())


app.use('/api/autoescuelas', autoescuela)
app.use('/api/auth', authRouter)
app.use('/api/pagos', pagoClaseRouter); 


app.listen(PORT, () => {
    console.log(`App funcionando en el puerto ${PORT}`)
})

