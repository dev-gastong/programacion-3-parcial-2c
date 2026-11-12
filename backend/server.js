const express = require("express");

const cors = require('cors');


const app = express();
const PORT = 3000;

const turnoroutes = require('./routes/router');
const authRoutes = require('./routes/authRoutes');

app.use(express.json());

app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://127.0.0.1:3001']
}));

app.use('/api/turnos', turnoroutes);

console.log('Rutas de turnos cargadas correctamente');


app.use('/api/auth', authRoutes);
console.log('Rutas de autenticación cargadas correctamente');


app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
