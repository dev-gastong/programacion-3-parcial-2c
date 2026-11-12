 
const formulario = document.getElementById('formLogin');
const mensaje = document.getElementById('mensaje');
const boton = formulario.querySelector('button');

/**

admin@turnos.com
AdminTurnos2026!



 */

formulario.addEventListener('submit', async function (evento) {
    evento.preventDefault();


    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;


    mensaje.textContent = '';
    boton.disabled = true;
    boton.textContent = 'Ingresando...';


    try {
        const datos = await iniciarSesion(email, password);


        mensaje.textContent =
            `Bienvenida/o, ${datos.usuario.email}. Rol: ${datos.usuario.id_rol}`;


        mensaje.style.color = 'green';


        console.log('Login exitoso');
        console.log('Usuario:', datos.token);

        sessionStorage.setItem('token', datos.token);
        sessionStorage.setItem('rol', datos.usuario.id_rol);
        sessionStorage.setItem('email', datos.usuario.email);

        window.location.href = 'pages/dashboard.html';


        // Por ahora no guardamos ni mostramos el token.
        // Lo utilizaremos en el siguiente paso para consultar turnos.


    } catch (error) {
        mensaje.textContent = error.message;
        mensaje.style.color = 'red';


    } finally {
        boton.disabled = false;
        boton.textContent = 'Iniciar sesión';
    }
});
