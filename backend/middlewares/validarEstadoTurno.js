const { validarTurno } = require('../validators/turnoValidator');

module.exports = async (req, res, next) => {
    const errores = await validarTurno(req.body);
    if (errores.length) return res.status(400).json({ errores });
    next();
};
