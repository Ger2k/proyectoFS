let peliculas = []; // Asumiendo que tus películas están aquí.

document.getElementById('ordenarAlfabeticamente').addEventListener('click', () => {
    peliculas.sort((a, b) => a.titulo.localeCompare(b.titulo));
    renderizarPeliculas();
});

document.getElementById('ordenarPorAno').addEventListener('click', () => {
    peliculas.sort((a, b) => a.ano - b.ano); // Asumiendo que tienes un campo 'ano' en tus objetos de película
    renderizarPeliculas();
});

document.getElementById('ordenarPorFecha').addEventListener('click', () => {
    peliculas.sort((a, b) => new Date(a.fechaCreacion) - new Date(b.fechaCreacion));
    renderizarPeliculas();
});

function renderizarPeliculas() {
    const contenedor = document.getElementById('listaPeliculas'); // Cambia este ID por donde quieras renderizar tus películas
    contenedor.innerHTML = ''; // Limpiar el contenedor antes de renderizar de nuevo
    peliculas.forEach(pelicula => {
        // Aquí iría tu lógica para crear y añadir cada película al DOM basado en el objeto de película
        // Por ejemplo: contenedor.appendChild(crearElementoPelicula(pelicula));
    });
}
