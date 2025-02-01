export function validarSesion(){

    const uuid = localStorage.getItem('token');
    const base_url = "/templates/base.html";
    let location = window.location.pathname;

    // validar si existe el dato en el storage del navegador
    if (!uuid && location !== base_url) { location = base_url }

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
        const response = await fetch(`http://localhost:8000/usuario/${uuid}`, requestOptions);
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
            window.location.href = '/templates/base.html';
        });
    }
}