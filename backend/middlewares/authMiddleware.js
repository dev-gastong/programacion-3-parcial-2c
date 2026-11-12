const jwt = require('jsonwebtoken');


function verificarToken(req, res, next) {
    console.log('Middleware ejecutado:', req.method, req.originalUrl);


    const authorization = req.headers.authorization;


    // Comprobar que se haya enviado el token
    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({
            error: 'Se requiere un token de autenticación'
        });
    }


    // Extraer el token
    const token = authorization.split(' ')[1];


    try {
        const datosToken = jwt.verify(
            token,
            process.env.JWT_SECRET
        );


        req.usuario = datosToken;
        next();


    } catch (error) {
        return res.status(401).json({
            error: 'Token inválido o vencido'
        });
    }
}

module.exports =  verificarToken ;