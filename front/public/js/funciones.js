const contenedor = document.querySelector(".listaPeliculas");
const formulario = document.querySelector("form");
const textoTitulo = document.querySelector("form input:first-child");

//CARGA INICIAL
ajax("/lista").then(peliculas => {
	peliculas.forEach(({_id,titulo,terminada}) => {
		
		new Pelicula(_id,titulo,terminada,contenedor);
	})
});

//VALIDACION DEL FORMULARIO ANTES DE ENVIAR
formulario.addEventListener("submit", e => {
	e.preventDefault();
	if(textoTitulo.value.trim() != ""){
		return formulario.submit()
	}
	console.log("El campo no puede estar vacío")
})

//Eliminar el placeholder del formulario al empezar a escribir

textoTitulo.addEventListener('focus', function() {
    this.placeholder = ''; // Limpia el placeholder al enfocar
});

textoTitulo.addEventListener('blur', function() {
    if (this.value === '') {
        this.placeholder = 'Título'; // Restaura el placeholder si el input está vacío al perder el foco
    }
});