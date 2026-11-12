function autorizarRol(...rolesPermitidos) {
    return function (req, res, next) {


        // Verificar que exista un usuario autenticado
        if (!req.usuario) {
            return res.status(401).json({
                error: 'Se requiere autenticación'
            });
        }


        // Obtener el rol del usuario
        const idRol = Number(req.usuario.id_rol);


        // Comprobar si su rol está autorizado
        if (!rolesPermitidos.includes(idRol)) {
            return res.status(403).json({
                error: 'No tenés permisos para realizar esta acción'
            });
        }


        // El usuario tiene permiso para continuar
        next();
    };
}

module.exports = autorizarRol;