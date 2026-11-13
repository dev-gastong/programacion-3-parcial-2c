const express = require("express");
const router = express.Router();

const turnoController = require('../controllers/turnoController');

const validarEstadoTurno = require('../middlewares/validarEstadoTurno');
const verificarToken = require('../middlewares/authMiddleware');
const autorizarRol = require('../middlewares/autorizarRol');

// Todas las rutas requieren token
router.use(verificarToken);


// ==============================
// RUTAS DE ADMINISTRADOR (rol 1)
// ==============================
router.get('/', autorizarRol(1), turnoController.obtenerTurnos);
router.get('/medico', autorizarRol(2), turnoController.obtenerTurnosMedico);
router.get('/:id', autorizarRol(1), turnoController.obtenerTurnosId);
router.post('/', autorizarRol(1, 3), validarEstadoTurno, turnoController.crearTurno);


// ==============================
// RUTAS DE PACIENTE (rol 3)
// ==============================
router.put('/:id/cancelar', autorizarRol(3), turnoController.cancelarTurno);


module.exports = router;