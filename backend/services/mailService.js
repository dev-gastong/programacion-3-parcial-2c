const nodemailer = require('nodemailer');


let transporter;
let cuentaPrueba;


async function obtenerTransporter() {
    if (transporter) {
        return transporter;
    }


    // Crear una cuenta temporal de Ethereal.
    cuentaPrueba = await nodemailer.createTestAccount();


    // Configurar la conexión SMTP.
    transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: cuentaPrueba.user,
            pass: cuentaPrueba.pass
        }
    });


    return transporter;
}


async function enviarCorreo({ to, subject, text, html }) {
    const conexion = await obtenerTransporter();


    const info = await conexion.sendMail({
        from: '"Gestión de Turnos Médicos" <pruebas@gestion-turnos.test>',
        to,
        subject,
        text,
        html
    });


    const urlVistaPrevia = nodemailer.getTestMessageUrl(info);


    console.log('Correo enviado al servicio de pruebas.');
    console.log('Asunto:', subject);
    console.log('Vista previa:', urlVistaPrevia);


    return {
        messageId: info.messageId,
        previewUrl: urlVistaPrevia
    };
}


module.exports = { enviarCorreo };
