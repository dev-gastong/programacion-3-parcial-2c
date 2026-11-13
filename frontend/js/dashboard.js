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
    iniciarMedico();
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

async function iniciarMedico() {
    const contenedorTurnos = document.getElementById('turnosMedico');

    try {
        const respuesta = await fetch('http://localhost:3000/api/turnos/medico', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const turnos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(turnos.error || 'No se pudieron cargar los turnos');
        }

        contenedorTurnos.replaceChildren();

        if (turnos.length === 0) {
            contenedorTurnos.textContent = 'No tenés turnos asignados.';
            return;
        }

        const grid = document.createElement('div');
        grid.className = 'grid-turnos';

        turnos.forEach(turno => {
            const tarjeta = document.createElement('article');
            tarjeta.className = 'tarjeta-turno';

            const encabezado = document.createElement('div');
            encabezado.className = 'turno-header';

            const id = document.createElement('span');
            id.className = 'turno-id';
            id.textContent = `Turno #${turno.id_turno}`;

            const estado = document.createElement('span');
            estado.className = 'badge';
            estado.textContent = turno.estado_turno || 'Pendiente';
            encabezado.append(id, estado);

            const detalles = document.createElement('div');
            detalles.className = 'turno-body';

            [
                ['Fecha', turno.fecha_turno],
                ['Hora', turno.hora_turno],
                ['DNI paciente', turno.dni_paciente],
                ['Práctica', turno.id_practica],
                ['Equipo', turno.id_equipo],
                ['Disponibilidad', turno.id_disponibilidad]
            ].forEach(([etiqueta, valor]) => {
                const dato = document.createElement('p');
                const nombre = document.createElement('strong');
                nombre.textContent = `${etiqueta}: `;
                dato.append(nombre, document.createTextNode(valor ?? 'No especificado'));
                detalles.appendChild(dato);
            });

            tarjeta.append(encabezado, detalles);
            grid.appendChild(tarjeta);
        });

        contenedorTurnos.appendChild(grid);
    } catch (error) {
        console.error('Error al obtener turnos del médico:', error);
        contenedorTurnos.textContent = error.message || 'Error al cargar los turnos.';
    }
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

        const medicoConfirmacion = document.getElementById('medico_confirmacion').value;
        const idDisponibilidad = document.getElementById('id_disponibilidad').value;

        const body = {
            fecha_turno:       document.getElementById('fecha_turno').value,
            hora_turno:        document.getElementById('hora_turno').value,
            medio_solicitado:  document.getElementById('medio_solicitado').value,
            estado_turno:      'Reservado',
            fecha_confirmacion: document.getElementById('fecha_turno').value,
            medico_confirmacion: medicoConfirmacion === '' ? null : Number(medicoConfirmacion),
            dni_paciente:      document.getElementById('dni_paciente').value,
            id_practica:       Number(document.getElementById('id_practica').value),
            id_equipo:         Number(document.getElementById('id_equipo').value),
            id_disponibilidad: idDisponibilidad === '' ? null : Number(idDisponibilidad)
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
