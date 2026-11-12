const db = require('./config/database');

async function probarConexion() {
    try {
        const [resultado] = await db.query('SELECT 1 AS conectado');
        console.log('Conexión a MySQL OK');
        console.log(resultado);
    } catch (error) {
        console.error('Error de conexión:', error.message);
    }
}

probarConexion();   


async function probarTurnos() {
    try {
        const [turnos] = await db.query(`
            SELECT *
            FROM turno
            LIMIT 10
        `);


        console.table(turnos);


    } catch (error) {
        console.error('Error:', error.message);
    }
}


probarTurnos();

