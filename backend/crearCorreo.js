const { enviarCorreo } = require('./services/mailService');


async function probarCorreo() {
    try {
        const resultado = await enviarCorreo({
            to: 'destinatario@example.com',
            subject: 'Prueba del servicio de correo',
            text: 'El servicio reutilizable funciona correctamente.',
            html: `
                <h2>Gestión de Turnos Médicos</h2>
                <p>El servicio de correo funciona correctamente.</p>
            `
        });


        console.log('Prueba completada.');
        console.log('ID:', resultado.messageId);
    } catch (error) {
        console.error('Error al enviar el correo:', error.message);
    }
}


probarCorreo();
