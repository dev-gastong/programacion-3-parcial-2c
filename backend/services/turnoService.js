
const db = require('../config/database');

async function obtenerTodos() {
    const [turnos] = await db.query(`
            SELECT *
            FROM turno
            ORDER BY fecha_turno, hora_turno
        `); 
    return turnos;
}

async function obtenerPorId(id) {
    const [turnos] = await db.query(`
            SELECT *
            FROM turno
            WHERE id_turno = ?
        `, [id]);

    return turnos;
}

async function obtenerPorMedico(matricula) {
    const [turnos] = await db.execute(`
            SELECT *
            FROM turno
            WHERE medico_confirmacion = ?
            ORDER BY fecha_turno, hora_turno
        `, [matricula]);

    return turnos;
}

async function crearTurno(turno) {

    const {
            fecha_turno,
            hora_turno,
            medio_solicitado,
            estado_turno,
            fecha_confirmacion,
            medico_confirmacion,
            dni_paciente,
            id_practica,
            id_equipo,
            id_disponibilidad
        } = turno;

    const [resultado] = await db.execute(
            `INSERT INTO turno
            (
                fecha_turno,
                hora_turno,
                medio_solicitado,
                estado_turno,
                fecha_confirmacion,
                medico_confirmacion,
                dni_paciente,
                id_practica,
                id_equipo,
                id_disponibilidad
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                fecha_turno,
                hora_turno,
                medio_solicitado,
                estado_turno,
                fecha_confirmacion,
                medico_confirmacion,
                dni_paciente,
                id_practica,
                id_equipo,
                id_disponibilidad
            ]
        );

        return resultado.insertId;
}

async function cancelarTurno(id) {
    const [turno] = await db.execute(
        `SELECT estado_turno FROM turno WHERE id_turno = ?`,
        [id]
    );

    if (turno.length === 0) {
        return { error: 'El turno no existe' };
    }

    if (turno[0].estado_turno === 'Cancelado') {
        return { error: 'El turno ya se encuentra cancelado' };
    }

    await db.execute(
        `UPDATE turno SET estado_turno = 'Cancelado' WHERE id_turno = ?`,
        [id]
    );

    return { mensaje: 'Turno cancelado correctamente' };
}

module.exports = {
    obtenerTodos,
    obtenerPorId,
    obtenerPorMedico,
    crearTurno,
    cancelarTurno
};
