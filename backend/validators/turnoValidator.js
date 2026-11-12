function validarEstadoTurno(body){
    const errores = [];

    if (!body.estado_turno) {
        errores.push('El campo estado_turno es obligatorio');
    }

    if (body.estado_turno && !['Confirmado', 'Reservado', 'Cancelado'].includes(body.estado_turno)) {
        errores.push('El campo estado_turno debe ser "Confirmado", "Reservado" o "Cancelado"');
    }

    return errores;
}

function validarDNI(body) {
    const errores = []; 

    if (!body.dni_paciente) {
        errores.push('El campo dni_paciente es obligatorio');
    }   

    return errores;
}


function validarMedicoConfirmacion(body) {
    
    const errores = [];
    
    // codigos: 1001, null, 1003, 1005, 1007, 1009, 1011, 1013, 1015, 10010
    const codigos = [1001, null, 1003, 1005, 1007, 1009, 1011, 1013, 1015, 10010];

    if (!codigos.includes(body.medico_confirmacion)) {
        errores.push('El campo medico_confirmacion no es válido');
    }

    return errores;
}

function validarMedioSolicitado(body) {
    const errores = [];

    const mediosValidos = ['Teléfono', 'Web', 'WhatsApp'];

    if (!mediosValidos.includes(body.medio_solicitado)) {
        errores.push('El campo medio_solicitado no es válido');
    }

    return errores;
}

function validarFechas(body) {

    const ahora = new Date();

    const errores = [];

    if (!body.fecha_turno) {
        errores.push('El campo fecha_turno es obligatorio');
    }

    if (!body.fecha_confirmacion) {
        errores.push('El campo fecha_confirmacion es obligatorio');
    }

    if (!body.hora_turno) {
        errores.push('El campo hora_turno es obligatorio');
    }

    if (body.fecha_turno && body.fecha_confirmacion) {

        const hora24 = ahora.toLocaleTimeString('es-AR', { hour12: false });
        const horaFechaTurno = body.hora_turno;


        if ( body.fecha_turno == ahora.toISOString().split('T')[0] && horaFechaTurno && hora24 > horaFechaTurno) {
            errores.push('La hora del turno no puede ser anterior a la hora actual');
        }
        
        ahora.setDate(ahora.getDate() - 1); // Restar un día a la fecha actual

        const fechaTurno = new Date(body.fecha_turno);

        const fechaConfirmacion = new Date(body.fecha_confirmacion);

        if (fechaConfirmacion < fechaTurno) {
            errores.push('La fecha de confirmación no puede ser anterior a la fecha del turno');
        }

        if (fechaTurno < ahora) {
            errores.push('La fecha del turno no puede ser anterior a la fecha actual');
        }

        if (fechaConfirmacion < ahora) {
            errores.push('La fecha de confirmación no puede ser anterior a la fecha actual');
        }
    
    }

    return errores;
}

async function existeTurno(body) {

    const turnoModel = require('../models/turnoModel');

    const errores = [];

    if (await turnoModel.existeTurno(body.fecha_turno, body.hora_turno, body.id_equipo)) { 
        errores.push('Ya existe un turno para la fecha, hora y equipo especificados');
    }

    return errores;
}

function validarNulos(body) {
    const errores = [];

    if (!body.id_practica) {
        errores.push('El campo id_practica es obligatorio');
    }

    return errores;
}



async function validarEquipo(body) {
    const turnoModel = require('../models/turnoModel'); 
    
    const errores = [];

    if (await turnoModel.existeEquipo(body.id_equipo, body.fecha_turno, body.hora_turno)) {
        errores.push('Ya existe un turno para el equipo especificado en la fecha y hora dadas');
    }

    return errores;

}

async function validarMedico(body) {
    const turnoModel = require('../models/turnoModel');

    const errores = [];

    if (await turnoModel.existeMedico(body.medico_confirmacion, body.fecha_turno, body.hora_turno)) {
        errores.push('Ya existe un turno para el médico especificado en la fecha y hora dadas');
    }  

    return errores;
}



function validarFranjasHorarias(body) {

    const errores = [];

    const diaSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    const diaActualNumero = new Date();
    const diaActual = diaSemana[diaActualNumero.getDay() - 1];


    if (diaSemana.includes(diaActual)) {
        if (body.hora_turno < '08:00' || body.hora_turno > '20:00') {
            errores.push('Los turnos solo pueden ser solicitados entre las 08:00 y las 20:00 de lunes a viernes');
        }
    } else if (diaActual === 'Sábado') {
        if (body.hora_turno < '08:00' || body.hora_turno > '14:00') {
            errores.push('Los turnos solo pueden ser solicitados entre las 08:00 y las 14:00 de los sábados');
        }
    } else {
        errores.push('Los turnos no pueden ser solicitados los domingos');
    }

    return errores;
}

async function validarTurno(body) {
    return [
        ...(await existeTurno(body)),
        ...(await validarEquipo(body)),
        ...(await validarMedico(body)),
        ...validarEstadoTurno(body), 
        ...validarDNI(body),
        ...validarMedicoConfirmacion(body),
        ...validarMedioSolicitado(body),
        ...validarFechas(body),
        ...validarNulos(body)
    ];
}


module.exports = {
    validarTurno
};

