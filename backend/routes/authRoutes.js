const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const verificacionController = require('../controllers/verificacionController');


router.get(
    '/verificar-email',
    verificacionController.verificarEmail
);



router.post('/login', authController.login);



module.exports = router;
