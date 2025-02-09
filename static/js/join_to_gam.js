import { validarSesion, obtenerInfoUsuario } from "./utils.js";

const D = document;
let informacionSala = null; // Variable global para almacenar la información de la sala
let informacionUsuario = null;

async function buscarInformacionSala(codigo_sala) {
    try {
        const response = await fetch(`https://gambling-back2-6fb9f86f7f99.herokuapp.com/sala/${codigo_sala}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            redirect: "follow"
        });

        const resultadoFetch = await response.json();
        if (!response.ok) throw new Error(resultadoFetch.detail);

        informacionSala = resultadoFetch;
        return resultadoFetch;
    } catch (error) {
        Swal.fire({ title: "¡Algo sucedió!", text: error.message, icon: "error" });
        return null;
    }
}

function actualizarUIConSala(sala, usuario) {
    const informacion_sala_div = D.getElementById('info-apuesta');
    const select_apuesta = D.querySelector('#info-apuesta select');
    const codigo_sala_span = D.getElementById('codigo_sala_span');
    const juego_span = D.getElementById('juego_span');
    const saldo_disponible_span = D.getElementById('saldo_disponible_span');
    const cantidad_personas_span = D.getElementById('cantidad_personas');
    const apuesta_acumulada_span = D.getElementById('apuesta_acumulada');

    if (!sala) {
        informacion_sala_div.style.display = "none";
        return;
    }


    codigo_sala_span.innerText = sala.codigo_sala;
    juego_span.innerText = sala.nombre_juego;
    saldo_disponible_span.innerText = `$${usuario.saldo_actual}`;
    cantidad_personas_span.innerText = sala.cantidad_jugadores;
    apuesta_acumulada_span.innerText = `$${sala.total_apostado}`
    
    select_apuesta.innerHTML = '<option selected>Seleccione una opción de apuesta</option>';
    sala.opciones_apuesta.forEach(opcion => {
        const optionElement = document.createElement("option");
        optionElement.value = opcion.id;
        optionElement.textContent = opcion.nombre_opcion;
        select_apuesta.appendChild(optionElement);
    });

    informacion_sala_div.style.display = "flex";
}

async function simularApuesta(event) {
    
    if (!informacionSala) {
        Swal.fire({ title: "Error", text: "Primero busca una sala válida.", icon: "warning" });
        return;
    }

    if (!informacionUsuario) {
        Swal.fire({ title: "Error", text: "Hubo algún problema identificado tu usuario.", icon: "warning" });
        return;
    }

    const opcionApuesta = D.querySelector('#info-apuesta select').value;
    const valorApuesta = D.getElementById('valorApuesta').value.trim();

    if (!opcionApuesta || !valorApuesta || opcionApuesta === 'Seleccione una opción de apuesta') {
        Swal.fire({ title: "Error", text: "Debe seleccionar una opción y un valor de apuesta.", icon: "warning" });
        return;
    }

    if (parseInt(valorApuesta) > informacionUsuario.saldo_actual) {
        Swal.fire({ title: "Error", text: "El valor que quires apostar excede tu saldo!", icon: "warning" });
        return;
    }

    try {
        const response = await fetch(`https://gambling-back2-6fb9f86f7f99.herokuapp.com/sala/simular`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                uuid_usuario: informacionUsuario.uuid,
                codigo_sala: informacionSala.codigo_sala,
                opcion_apuesta: parseInt(opcionApuesta),
                monto_apuesta: parseFloat(valorApuesta)
            }),
            redirect: "follow"
        });

        const resultadoFetch = await response.json();
        if (!response.ok) throw new Error(resultadoFetch.detail);

        Swal.fire({
            title: "Simulando...",
            text: `De ganar su multiplicador de ganancia según lo apostado sería de aproximadamente x ${resultadoFetch.multiplicador}`,
            icon: "success"
        });

    } catch (error) {
        console.log(JSON.stringify(error))
        Swal.fire({ title: "¡Algo sucedió!", text: error.message, icon: "error" });
        return null;
    }

}

async function unirseASala(event) {
    event.preventDefault();
    if (!informacionSala) {
        Swal.fire({ title: "Error", text: "Primero busca una sala válida.", icon: "warning" });
        return;
    }

    if (!informacionUsuario) {
        Swal.fire({ title: "Error", text: "Hubo algún problema identificado tu usuario.", icon: "warning" });
        return;
    }

    const opcionApuesta = D.querySelector('#info-apuesta select').value;
    const valorApuesta = D.getElementById('valorApuesta').value.trim();

    if (!opcionApuesta || !valorApuesta || opcionApuesta === 'Seleccione una opción de apuesta') {
        Swal.fire({ title: "Error", text: "Debe seleccionar una opción y un valor de apuesta.", icon: "warning" });
        return;
    }

    if (parseInt(valorApuesta) > informacionUsuario.saldo_actual) {
        Swal.fire({ title: "Error", text: "El valor que quires apostar excede tu saldo!", icon: "warning" });
        return;
    }

    const nombreOpcion = informacionSala.opciones_apuesta.find(opcion => opcion.id === parseInt(opcionApuesta)).nombre_opcion

    Swal.fire({
        title: `¿Estás seguro de apostar la cantidad de $${valorApuesta} poer la opcion ${nombreOpcion}?`,
        showDenyButton: true,
        confirmButtonText: "Sí, seguro",
        denyButtonText: `Prefiero cambiarlo`
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch(`https://gambling-back2-6fb9f86f7f99.herokuapp.com/sala/apostar`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        uuid_usuario: informacionUsuario.uuid,
                        codigo_sala: informacionSala.codigo_sala,
                        opcion_apuesta: parseInt(opcionApuesta),
                        monto_apuesta: parseFloat(valorApuesta)
                    }),
                    redirect: "follow"
                });
        
                const resultadoFetch = await response.json();
                if (!response.ok) throw new Error(resultadoFetch.detail);

                Swal.fire({
                    title: "¡Perfecto!",
                    text: "Tu apuesta se ha registrado correctamente",
                    icon: "success"
                }).then((result) => {
                    window.location.href = '/templates/pantalla2.html'
                });
        
            } catch (error) {
                console.log(JSON.stringify(error))
                Swal.fire({ title: "¡Algo sucedió!", text: error.message, icon: "error" });
                return null;
            }
        }
    });

}

D.addEventListener("DOMContentLoaded", async () => {
    validarSesion();
    informacionUsuario = await obtenerInfoUsuario();

    D.getElementById("valorApuesta").addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, "").slice(0, 7); // Solo números, máx 7 dígitos
    });

    D.getElementById("go_back_btn").addEventListener("click", () => {
        window.location.href = "/templates/pantalla2.html";
    });

    D.getElementById("searchForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        const codigo_sala = D.getElementById('codigoSala').value.trim();
        informacionSala = await buscarInformacionSala(codigo_sala);
        actualizarUIConSala(informacionSala, informacionUsuario);
    });

    D.getElementById("joinForm").addEventListener("submit", unirseASala);

    D.getElementById("simular_apuesta_btn").addEventListener("click", simularApuesta);
});
