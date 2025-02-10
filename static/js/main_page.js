import { validarSesion, obtenerInfoUsuario } from "./utils.js";
import { REGISTER_GAMBLE } from "./const.js";

const D = document;

D.addEventListener("DOMContentLoaded", async () => {
    validarSesion();

    // Elementos de la interfaz
    let nickname_span = D.getElementById('nickname');
    let monedas_span = D.getElementById('monedas');
    let nueva_apuesta_button = D.getElementById('nuevaApuestaBtn');
    let actualizar_tabla_button = D.getElementById('actualizarTablaBtn');
    const tbody = D.querySelector('table tbody');

    async function cargarDatosUsuario() {
        const infoUsuario = await obtenerInfoUsuario();
        nickname_span.innerHTML = infoUsuario.nickname;
        monedas_span.innerHTML = `$${infoUsuario.saldo_actual}`;
        renderizarTabla(infoUsuario);
    }

    function renderizarTabla(infoUsuario) {
        // Limpiar el contenido actual de la tabla antes de actualizarla
        tbody.innerHTML = '';

        if (infoUsuario.historial_apuestas && infoUsuario.historial_apuestas.length > 0) {
            infoUsuario.historial_apuestas.forEach((apuesta) => {
                const fila = D.createElement('tr');

                const celdaId = D.createElement('td');
                celdaId.textContent = apuesta.codigo_sala;

                const celdaJuego = D.createElement('td');
                celdaJuego.textContent = `${apuesta.juego}`;

                const celdaMonto = D.createElement('td');
                celdaMonto.textContent = `$${apuesta.monto_apostado}`;

                const celdaOpcion = D.createElement('td');
                celdaOpcion.textContent = apuesta.opcion_apuesta;

                const celdaIsFinalizada = D.createElement('td');
                celdaIsFinalizada.textContent = !apuesta.is_sala_abierta ? "SI" : "NO";

                const celdaResultado = D.createElement('td');

                if (!apuesta.is_sala_abierta) {
                    const btnVerResultado = D.createElement('button');
                    btnVerResultado.classList.add('btn', 'btn-success', 'btn-sm');
                    btnVerResultado.textContent = 'Ver';
                    btnVerResultado.addEventListener('click', () => {
                        Swal.fire({
                            title: 'Resultado de la apuesta',
                            text: apuesta.is_gano ? '¡Has ganado!' : 'Has perdido',
                            icon: apuesta.is_gano ? 'success' : 'error'
                        });
                    });
                    celdaResultado.appendChild(btnVerResultado);
                } else {
                    celdaResultado.textContent = "---";
                }

                // Agregar las celdas a la fila
                fila.appendChild(celdaId);
                fila.appendChild(celdaJuego);
                fila.appendChild(celdaMonto);
                fila.appendChild(celdaOpcion);
                fila.appendChild(celdaIsFinalizada);
                fila.appendChild(celdaResultado);

                // Agregar la fila a la tabla
                tbody.appendChild(fila);
            });
        } else {
            // Si no hay apuestas, mostrar un mensaje en la tabla
            const filaVacia = D.createElement('tr');
            const celdaVacia = D.createElement('td');
            celdaVacia.colSpan = 6;
            celdaVacia.textContent = 'No has realizado apuestas aún';
            filaVacia.appendChild(celdaVacia);
            tbody.appendChild(filaVacia);
        }
    }

    nueva_apuesta_button.addEventListener('click', () => {
        window.location.href = REGISTER_GAMBLE;
    });

    actualizar_tabla_button.addEventListener('click', async () => {
        await cargarDatosUsuario(); // Recargar datos sin recargar la página
    });

    await cargarDatosUsuario(); // Cargar datos iniciales al entrar a la página
});
