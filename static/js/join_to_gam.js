import { validarSesion, obtenerInfoUsuario } from "./utils.js";

const D = document;
let informacionSala = null; // Variable global para almacenar la información de la sala
let informacionUsuario = null;

async function buscarInformacionSala(codigo_sala) {
    try {
        const response = await fetch(`http://localhost:8000/sala/${codigo_sala}`, {
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

    if (!sala) {
        informacion_sala_div.style.display = "none";
        return;
    }


    codigo_sala_span.innerText = sala.codigo_sala;
    juego_span.innerText = sala.nombre_juego;
    saldo_disponible_span.innerText = `${usuario.saldo_actual}`
    
    select_apuesta.innerHTML = '<option selected>Seleccione una opción de apuesta</option>';
    sala.opciones_apuesta.forEach(opcion => {
        const optionElement = document.createElement("option");
        optionElement.value = opcion.id;
        optionElement.textContent = opcion.nombre_opcion;
        select_apuesta.appendChild(optionElement);
    });

    informacion_sala_div.style.display = "flex";
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

    console.log(typeof valorApuesta);
    // Aquí iría la lógica para enviar la apuesta al backend
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
});
