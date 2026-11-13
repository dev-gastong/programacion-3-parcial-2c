const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verificacionController = require('../controllers/verificacionController');
const registroController = require('../controllers/registroController');


router.get(
    '/verificar-email',
    verificacionController.verificarEmail
);

router.post('/registro/paciente', registroController.registrarPaciente);
router.post('/registro/medico', registroController.registrarMedico);

router.post('/login', authController.login);

module.exports = router;
