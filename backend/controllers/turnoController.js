const db = require('../config/database');
const turnoService = require('../services/turnoService');

// ==============================
// OBTENER TODOS LOS TURNOS
// ==============================
async function obtenerTurnos(req, res) {
    try {
        const turnos = await turnoService.obtenerTodos();
        res.json(turnos);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error al obtener los turnos'
        });
    }
}

async function obtenerTurnosId(req, res) {
    try {
        const turno = await turnoService.obtenerPorId(req.params.id);
        res.json(turno);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error al obtener los turnos'
        });
    }
}


async function crearTurno(req, res) {
    try {

        const turnoCreado = await turnoService.crearTurno(req.body);

        res.status(201).json({
            mensaje: 'Turno creado correctamente',
            id_turno: turnoCreado
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: 'Error al crear el turno'
        });
    }
}


async function cancelarTurno(req, res) {
    try {
        const resultado = await turnoService.cancelarTurno(req.params.id);

        if (resultado.error) {
            return res.status(400).json({ error: resultado.error });
        }

        res.json({ mensaje: resultado.mensaje });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error al cancelar el turno'
        });
    }
}


module.exports = {
    obtenerTurnos,
    obtenerTurnosId,
    crearTurno,
    cancelarTurno
};
