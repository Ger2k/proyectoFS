const contenedor = document.querySelector(".listaPeliculas");
const formulario = document.querySelector("form");
const textoTitulo = document.querySelector("form input:first-child");

//CARGA INICIAL
ajax("/lista").then(peliculas => {
	peliculas.forEach(({_id,titulo,terminada}) => {
		getPosterURL(){
			fetch(`https://omdbapi.com/?apikey=b45635c9&s=${this.textoTitulo}`)
			.then(res => res.json())
			.then(data => () => {
				data.Poster = posterURL;
			})
		}
		new Pelicula(_id,titulo,terminada,contenedor,posterURL);
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


