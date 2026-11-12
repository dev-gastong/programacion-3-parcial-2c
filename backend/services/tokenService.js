const crypto = require('crypto');
const db = require('../config/database');


// Genera un token y guarda su hash en la base de datos.
async function crearTokenCuenta(idUsuario, tipo, minutosValidez = 30) {
    const tiposPermitidos = [
        'VERIFICACION_EMAIL',
        'RECUPERACION_PASSWORD'
    ];


    if (!tiposPermitidos.includes(tipo)) {
        throw new Error('Tipo de token no válido');
    }


    const token = crypto.randomBytes(32).toString('hex');


    const tokenHash = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');


    const expiracion = new Date(
        Date.now() + minutosValidez * 60 * 1000
    );


    // Invalida tokens anteriores del mismo tipo.
    await db.execute(
        `UPDATE token_cuenta
         SET usado = 1
         WHERE id_usuario = ?
           AND tipo = ?
           AND usado = 0`,
        [idUsuario, tipo]
    );


    // Guarda el hash, nunca el token original.
    await db.execute(
        `INSERT INTO token_cuenta
            (id_usuario, token_hash, tipo, fecha_expiracion, usado)
         VALUES (?, ?, ?, ?, 0)`,
        [idUsuario, tokenHash, tipo, expiracion]
    );


    return token;
}


// Busca un token que todavía no venció ni fue utilizado.
async function buscarTokenValido(token, tipo) {
    const tokenHash = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');


    const [filas] = await db.execute(
        `SELECT id_token, id_usuario
         FROM token_cuenta
         WHERE token_hash = ?
           AND tipo = ?
           AND usado = 0
           AND fecha_expiracion > NOW()
         LIMIT 1`,
        [tokenHash, tipo]
    );


    return filas.length > 0 ? filas[0] : null;
}


// Marca el token como utilizado.
async function marcarTokenUsado(idToken) {
    const [resultado] = await db.execute(
        `UPDATE token_cuenta
         SET usado = 1
         WHERE id_token = ?
           AND usado = 0`,
        [idToken]
    );


    return resultado.affectedRows === 1;
}


module.exports = {
    crearTokenCuenta,
    buscarTokenValido,
    marcarTokenUsado
};
