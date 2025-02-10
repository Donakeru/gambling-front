import {HOST, MAIN_PAGE, REGISTER_PAGE} from "./const.js"

export async function validarSesion(){

    const uuid = localStorage.getItem('token');
    const base_url = REGISTER_PAGE;
    let location = window.location.pathname;

    // validar si existe el dato en el storage del navegador
    if (!uuid && location !== base_url) { location = base_url }

    if (location === base_url) {
        if (uuid) {
            window.location.href = MAIN_PAGE
        }
    }

}

export async function obtenerInfoUsuario() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const uuid = localStorage.getItem('token');

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    try {
        const response = await fetch(`${HOST}/usuario/${uuid}`, requestOptions);
        const resultadoFetch = await response.json();

        if (!response.ok) {
            throw new Error(resultadoFetch.detail);
        }

        return resultadoFetch;

    } catch (error) {
        Swal.fire({
            title: "¡Algo sucedió!",
            text: error.message,
            icon: "error"
        }).then((result) => {
            localStorage.removeItem('token');
            window.location.href = REGISTER_PAGE;
        });
    }
}