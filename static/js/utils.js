export async function validarSesion(){

    const uuid = localStorage.getItem('token');
    const base_url = "index.html";
    let location = window.location.pathname;

    // validar si existe el dato en el storage del navegador
    if (!uuid && location !== base_url) { location = base_url }

    if (location === base_url) {
        if (uuid) {
            window.location.href = "pantalla2.html"
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
        const response = await fetch(`https://gambling-back2-6fb9f86f7f99.herokuapp.com/usuario/${uuid}`, requestOptions);
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
            window.location.href = 'index.html';
        });
    }
}