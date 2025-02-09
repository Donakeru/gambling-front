import { validarSesion, obtenerInfoUsuario } from "./utils.js";

const D = document;

D.addEventListener("DOMContentLoaded", async (event) => {  // Usar async aquí
    validarSesion();

    // Esperar a que se resuelva la promesa antes de asignar
    const infoUsuario = await obtenerInfoUsuario();

    let nickname_span = D.getElementById('nickname');
    let monedas_span = D.getElementById('monedas');
    let nueva_apuesta_button = D.getElementById('nuevaApuestaBtn')

    nickname_span.innerHTML = infoUsuario.nickname;
    monedas_span.innerHTML = `$${infoUsuario.saldo_actual}`;

    // Obtener el tbody de la tabla donde se agregarán las apuestas
    const tbody = D.querySelector('table tbody');

    // Verificar si existen apuestas en el historial
    if (infoUsuario.historial_apuestas && infoUsuario.historial_apuestas.length > 0) {
        // Recorrer el historial de apuestas y crear una fila por cada apuesta
        infoUsuario.historial_apuestas.forEach((apuesta, index) => {
            const fila = D.createElement('tr');
            
            // Crear las celdas con los datos de cada apuesta
            const celdaId = D.createElement('td');
            celdaId.textContent = apuesta.codigo_sala;  // Aquí puedes poner el ID de la apuesta si lo tienes

            const celdaJuego = D.createElement('td');
            celdaJuego.textContent = `${apuesta.juego}`;
            
            const celdaMonto = D.createElement('td');
            celdaMonto.textContent = `$${apuesta.monto_apostado}`;

            const celdaOpcion = D.createElement('td');
            celdaOpcion.textContent = apuesta.opcion_apuesta;

            const celdaIsFinalizada = D.createElement('td');
            celdaIsFinalizada.textContent = (!apuesta.is_sala_abierta)? "SI" : "NO";

            const celdaResultado = D.createElement('td');

            if (!apuesta.is_sala_abierta){

                const btnVerResultado = D.createElement('button');
                btnVerResultado.classList.add('btn', 'btn-success', 'btn-sm');
                btnVerResultado.textContent = 'Ver';
                btnVerResultado.addEventListener('click', () => {
                    // Aquí puedes agregar la lógica para ver el resultado de la apuesta
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
        // Si no hay apuestas, puedes mostrar un mensaje en la tabla o hacer algo más
        const filaVacia = D.createElement('tr');
        const celdaVacia = D.createElement('td');
        celdaVacia.colSpan = 6;
        celdaVacia.textContent = 'No has realizado apuestas aún';
        filaVacia.appendChild(celdaVacia);
        tbody.appendChild(filaVacia);
    }


    nueva_apuesta_button.addEventListener('click', (event) => {
        window.location.href = '/pantalla3.html'
    })
});
