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


