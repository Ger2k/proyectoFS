const contenedor = document.querySelector(".listaPeliculas");
const formulario = document.querySelector("form");
const textoTitulo = document.querySelector("form input:first-child");

//CARGA INICIAL
ajax("/lista").then(peliculas => {
	peliculas.forEach(({_id,titulo,terminada}) => {
		new Pelicula(_id,titulo,terminada,contenedor);
	})
});

formulario.addEventListener("submit", e => {
	e.preventDefault();
	if(textoTitulo.value.trim() != ""){
		return formulario.submit()
	}
	console.log("El campo no puede estar vacío")
})



/*

formulario.addEventListener("submit", evento => {
	evento.preventDefault();

	if(textoTitulo.value.trim() != ""){
		//HACEMOS LLAMADA A AJAX, si todo sale bien:
		return ajax("/nueva","POST",{ titulo : textoTitulo.value.trim()})
		.then(({resultado,id}) => {
			if(resultado == "ok"){
				new Pelicula(id, textoTitulo.value.trim(), false, contenedor);
				return textoTitulo.value = "";
			}
			console.log("Error al usuario");
		});
		
	}
	console.log("Error al usuario");
});
*/