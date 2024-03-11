class Pelicula{
		constructor(id,titulo,estado,contenedor){
			this.id = id;
			this.titulo = titulo;
			this.elementoDOM = null;
			// Solo carga el póster y crea la película una vez que se haya obtenido la URL del póster
			this.cargarPosterYCrearPelicula(estado, contenedor);
		}
	async cargarPosterYCrearPelicula(estado, contenedor) {
        try {
            const response = await fetch(`https://omdbapi.com/?apikey=b45635c9&s=${encodeURIComponent(this.titulo)}`);
            const data = await response.json();
            if (data.Search && data.Search.length > 0) {
                this.posterURL = data.Search[0].Poster; // Asumiendo que queremos el primer resultado
				this.movieYear = data.Search[0].Year;
            } else {
                this.posterURL = 'https://demofree.sirv.com/nope-not-here.jpg?w=150'; // O alguna URL de imagen por defecto
            }
            this.nuevaPelicula(estado, contenedor, this.posterURL, this.movieYear); // Asegúrate de que nuevaPelicula maneje correctamente el parámetro posterURL
        } catch (error) {
            console.error("Error cargando el póster: ", error);
            // Manejar el error adecuadamente
        }
    }
    nuevaPelicula(estado,contenedor){
        this.elementoDOM = document.createElement("div");
        this.elementoDOM.classList.add("pelicula");

       
		// Crear elemento para el título de la película
        let titulo = document.createElement("h3");
		titulo.classList.add("visible");
		titulo.innerHTML = this.titulo;

		// Crear elemento para el año de la película
        let movieYear = document.createElement("h4");
		movieYear.classList.add("movieYear visible");
		movieYear.innerHTML = this.movieYear;

		// Crear elemento para el poster de la película
        let poster = document.createElement("img");
		poster.classList.add("poster");
		poster.src = this.posterURL;


        
		// Crear campo de edición para el título
        let editorTitulo = document.createElement("input");
		editorTitulo.setAttribute("type","text");
		editorTitulo.value = this.titulo;

        
		// Crear botón para editar el título
        let botonEditar = document.createElement("button");
		botonEditar.classList.add("boton");
		botonEditar.innerHTML = "Editar";

		// Agregar evento para editar el título al hacer clic en el botón
		botonEditar.addEventListener("click", () => this.editarTitulo());


        
		// Crear botón para borrar la película
        let botonBorrar = document.createElement("button");
		botonBorrar.classList.add("boton","borrar");
		botonBorrar.innerHTML = "Borrar";

		// Agregar evento para borrar la película al hacer clic en el botón
		botonBorrar.addEventListener("click", () => this.borrarTitulo());


        
		// Crear botón para cambiar el estado de la película (vista/no vista)
        let botonEstado = document.createElement("button");
		botonEstado.className = `estado ${estado == "1" ? "terminada" : ""}`;
        botonEstado.classList.add("boton","vista");
        botonEstado.innerHTML = "Vista";
		
		
		
		// Agregar evento para cambiar el estado al hacer clic en el botón
		botonEstado.addEventListener("click", () => {
			this.editarEstado().then(({resultado}) => {
				if(resultado == "ok"){
					return botonEstado.classList.toggle("terminada");
				}
				console.log("...informar del error")
			})
		});

        // Agregar elementos al DOM
		this.elementoDOM.appendChild(poster);
        this.elementoDOM.appendChild(titulo);
		this.elementoDOM.appendChild(movieYear);
		this.elementoDOM.appendChild(editorTitulo);
        this.elementoDOM.appendChild(botonEstado);
		this.elementoDOM.appendChild(botonEditar);
		this.elementoDOM.appendChild(botonBorrar);		

        contenedor.appendChild(this.elementoDOM);
    }
    async editarTitulo(){
		if(this.editando){
			// Guardar el título editado
			let tituloTemporal = this.elementoDOM.children[3].value.trim();
			if(tituloTemporal != "" && tituloTemporal != this.textoTitulo){
				let {resultado} = await ajax(`/editar/${this.id}/1`,"PUT",{ titulo : tituloTemporal})
				if(resultado == "ok"){
					this.textoTitulo = tituloTemporal;
				}				
			}
			// Actualizar la representación del título en el DOM
			this.elementoDOM.children[2].innerHTML = this.textoTitulo;
			this.elementoDOM.children[2].classList.add("visible");
			this.elementoDOM.children[3].classList.remove("visible");
			this.elementoDOM.children[5].innerHTML = "Editar";

		}else{
			// Habilitar la edición del título
			this.elementoDOM.children[2].classList.remove("visible");
			this.elementoDOM.children[2].value = this.textoTitulo;
			this.elementoDOM.children[3].classList.add("visible");
			this.elementoDOM.children[5].innerHTML = "Guardar";
		}
		this.editando = !this.editando;
	}
	
	async borrarTitulo(){
		// Realizar una llamada a AJAX para eliminar la película en el servidor
		let {error} = await ajax(`/borrar/${this.id}`,"DELETE");
		if(!error){
			// Eliminar la representación de la película del DOM
			return this.elementoDOM.remove();
		}
		console.log("no se pudo borrar");
	}
	
	editarEstado(){
		// Realizar una llamada a AJAX para cambiar el estado de la película en el servidor
		return ajax(`/editar/${this.id}/0`,"PUT")
	}
}