import { validarSesion } from "./utils.js";

async function RegistrarUsuario(nickname) {

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "nickname": nickname
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };


    try {
        const response = await fetch("http://localhost:8000/usuario", requestOptions);
        const resultadoFetch = await response.json();

        if ( !response.ok ) {
            throw new Error(resultadoFetch.detail);
        }

        Swal.fire({
            title: "¡Perfecto!",
            text: "Te has registrado correctamente",
            icon: "success"
        }).then((result) => {
            localStorage.setItem('token', resultadoFetch.uuid)
            window.location.href = '/templates/pantalla2.html'
        });

    } catch (error) {
        Swal.fire({
            title: "¡Algo sucedió!",
            text: error.message,
            icon: "error"
        });
    }
}

const D = document;

D.addEventListener("DOMContentLoaded", (event) => {

    validarSesion();

    const form = D.getElementById("registerForm");

    form.addEventListener("submit", function(event) {

        // Evita el envío del formulario por defecto
        event.preventDefault();

        // Obtiene el valor del input
        const nickname = D.getElementById("nickname").value.trim();

        if (nickname === "") {
            Swal.fire('Hello world!');  // Aquí muestra la alerta
        } else {

            Swal.fire({
                title: `¿Seguro de que quieres registrarte con el nombre '${nickname}'?`,
                showDenyButton: true,
                confirmButtonText: "Sí, seguro",
                denyButtonText: `Prefiero cambiarlo`
              }).then((result) => {
                if (result.isConfirmed) {
                  RegistrarUsuario(nickname);
                }
              });

        }
    });

});
