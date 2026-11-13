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

async function obtenerTurnosMedico(req, res) {
    try {
        const [medicos] = await db.execute(
            `SELECT matricula_medico
             FROM usuario
             WHERE id_usuario = ? AND id_rol = 2 AND activo = 1`,
            [req.usuario.id_usuario]
        );

        if (medicos.length === 0 || !medicos[0].matricula_medico) {
            return res.status(403).json({
                error: 'La cuenta no tiene un médico asociado'
            });
        }

        const turnos = await turnoService.obtenerPorMedico(
            medicos[0].matricula_medico
        );

        return res.json(turnos);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Error al obtener los turnos del médico'
        });
    }
}


async function crearTurno(req, res) {
    try {
        let datosTurno = req.body;

        if (Number(req.usuario.id_rol) === 3) {
            const [usuarios] = await db.execute(
                `SELECT dni_paciente
                 FROM usuario
                 WHERE id_usuario = ? AND id_rol = 3 AND activo = 1`,
                [req.usuario.id_usuario]
            );

            if (usuarios.length === 0 || !usuarios[0].dni_paciente) {
                return res.status(403).json({
                    error: 'La cuenta no tiene un paciente asociado'
                });
            }

            datosTurno = {
                ...req.body,
                dni_paciente: usuarios[0].dni_paciente
            };
        }

        const turnoCreado = await turnoService.crearTurno(datosTurno);

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
    obtenerTurnosMedico,
    crearTurno,
    cancelarTurno
};
