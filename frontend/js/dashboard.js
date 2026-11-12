const token = sessionStorage.getItem('token');
const rol = Number(sessionStorage.getItem('rol'));
const email = sessionStorage.getItem('email');


// Si no hay token, redirigir al login
if (!token) {
    window.location.href = '../index.html';
}


// ==============================
// MOSTRAR DATOS DEL USUARIO
// ==============================
const datosUsuario = document.getElementById('datosUsuario');
const rolesNombre = { 1: 'Administrador', 2: 'Médico', 3: 'Paciente' };
datosUsuario.textContent = `Bienvenido/a, ${email} — ${rolesNombre[rol] || 'Usuario'}`;


// ==============================
// MOSTRAR SECCIÓN SEGÚN ROL
// ==============================
const seccionAdmin   = document.getElementById('seccion-admin');
const seccionMedico  = document.getElementById('seccion-medico');
const seccionPaciente = document.getElementById('seccion-paciente');

if (rol === 1) {
    seccionAdmin.style.display = 'block';
    iniciarAdmin();
} else if (rol === 2) {
    seccionMedico.style.display = 'block';
} else if (rol === 3) {
    seccionPaciente.style.display = 'block';
    iniciarPaciente();
}


// ==============================
// CERRAR SESIÓN
// ==============================
const botonCerrarSesion = document.getElementById('cerrarSesion');

botonCerrarSesion.addEventListener('click', function () {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('rol');
    sessionStorage.removeItem('email');
    window.location.href = '../index.html';
});


// ==============================
// ADMIN — LISTADO DE TURNOS
// ==============================
function iniciarAdmin() {
    const botonObtenerTurnos = document.getElementById('obtenerTurnos');
    const datosTurnos = document.getElementById('datosTurnos');

    botonObtenerTurnos.addEventListener('click', async function () {
        try {
            const respuesta = await fetch('http://localhost:3000/api/turnos', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const turnos = await respuesta.json();

            datosTurnos.innerHTML = '';

            if (turnos.length === 0) {
                datosTurnos.innerHTML = '<p class="sin-turnos">No hay turnos registrados.</p>';
                return;
            }

            const contenedorGrid = document.createElement('div');
            contenedorGrid.className = 'grid-turnos';

            turnos.forEach(turno => {
                const tarjetaTurno = document.createElement('div');
                tarjetaTurno.className = 'tarjeta-turno';

                tarjetaTurno.innerHTML = `
                    <div class="turno-header">
                        <span class="turno-id">Turno #${turno.id_turno}</span>
                        <span class="badge ${turno.estado_turno ? turno.estado_turno.toLowerCase() : 'pendiente'}">
                            ${turno.estado_turno || 'Pendiente'}
                        </span>
                    </div>
                    <div class="turno-body">
                        <p><strong>📅 Fecha:</strong> ${turno.fecha_turno}</p>
                        <p><strong>⏰ Hora:</strong> ${turno.hora_turno}</p>
                        <p><strong>👤 DNI Paciente:</strong> ${turno.dni_paciente}</p>
                        <p><strong>🏥 Medio:</strong> ${turno.medio_solicitado || 'No especificado'}</p>
                        <p><strong>👨‍⚕️ Médico Conf.:</strong> ${turno.medico_confirmacion || 'Sin asignar'}</p>
                    </div>
                `;

                contenedorGrid.appendChild(tarjetaTurno);
            });

            datosTurnos.appendChild(contenedorGrid);

        } catch (error) {
            console.error('Error al obtener turnos:', error);
            datosTurnos.innerHTML = '<p class="error-mensaje">Error al cargar los turnos. Intente nuevamente.</p>';
        }
    });
}


// ==============================
// PACIENTE — NUEVO TURNO Y CANCELAR
// ==============================
function iniciarPaciente() {

    // --- Formulario: nuevo turno ---
    const formNuevoTurno = document.getElementById('formNuevoTurno');
    const mensajeNuevoTurno = document.getElementById('mensajeNuevoTurno');

    formNuevoTurno.addEventListener('submit', async function (evento) {
        evento.preventDefault();

        mensajeNuevoTurno.textContent = '';

        const body = {
            fecha_turno:       document.getElementById('fecha_turno').value,
            hora_turno:        document.getElementById('hora_turno').value,
            medio_solicitado:  document.getElementById('medio_solicitado').value,
            estado_turno:      'Reservado',
            fecha_confirmacion: document.getElementById('fecha_turno').value,
            medico_confirmacion: null,
            dni_paciente:      document.getElementById('dni_paciente').value,
            id_practica:       Number(document.getElementById('id_practica').value),
            id_equipo:         Number(document.getElementById('id_equipo').value),
            id_disponibilidad: null
        };

        try {
            const respuesta = await fetch('http://localhost:3000/api/turnos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                const errores = datos.errores ? datos.errores.join(', ') : datos.error;
                mensajeNuevoTurno.style.color = 'red';
                mensajeNuevoTurno.textContent = `Error: ${errores}`;
                return;
            }

            mensajeNuevoTurno.style.color = 'green';
            mensajeNuevoTurno.textContent = `Turno creado correctamente. ID: ${datos.id_turno}`;
            formNuevoTurno.reset();

        } catch (error) {
            console.error('Error al crear turno:', error);
            mensajeNuevoTurno.style.color = 'red';
            mensajeNuevoTurno.textContent = 'Error al conectar con el servidor. Intente nuevamente.';
        }
    });


    // --- Formulario: cancelar turno ---
    const formCancelarTurno = document.getElementById('formCancelarTurno');
    const mensajeCancelarTurno = document.getElementById('mensajeCancelarTurno');

    formCancelarTurno.addEventListener('submit', async function (evento) {
        evento.preventDefault();

        mensajeCancelarTurno.textContent = '';

        const idTurno = document.getElementById('id_turno_cancelar').value;

        try {
            const respuesta = await fetch(`http://localhost:3000/api/turnos/${idTurno}/cancelar`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                mensajeCancelarTurno.style.color = 'red';
                mensajeCancelarTurno.textContent = `Error: ${datos.error}`;
                return;
            }

            mensajeCancelarTurno.style.color = 'green';
            mensajeCancelarTurno.textContent = datos.mensaje;
            formCancelarTurno.reset();

        } catch (error) {
            console.error('Error al cancelar turno:', error);
            mensajeCancelarTurno.style.color = 'red';
            mensajeCancelarTurno.textContent = 'Error al conectar con el servidor. Intente nuevamente.';
        }
    });
}
