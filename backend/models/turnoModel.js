// models/turnoModel.js
const db = require('../config/database');

async function existeTurno(fecha, hora, idEquipo) {
    const [filas] = await db.execute(
        `SELECT 1 FROM turno
        WHERE fecha_turno = ? AND hora_turno = ? AND id_equipo = ?`,
        [fecha, hora, idEquipo]
    );
    return filas.length > 0;
}

async function existeEquipo(idEquipo, fecha, hora) {
    const [filas] = await db.execute(
        `SELECT 1 FROM turno
        WHERE id_equipo = ? AND fecha_turno = ? AND hora_turno = ?`,
        [idEquipo, fecha, hora]
    );
    return filas.length > 0;    
}

async function existeMedico(medico, fecha, hora) {
    const [filas] = await db.execute(
        `SELECT 1 FROM turno     
        WHERE medico_confirmacion = ? AND fecha_turno = ? AND hora_turno = ?`,
        [medico, fecha, hora]
    );
    return filas.length > 0;
}


module.exports = { 
    existeTurno,
    existeEquipo,
    existeMedico
};