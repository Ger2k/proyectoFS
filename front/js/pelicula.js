class Pelicula {
    constructor(id, titulo, estado, contenedor, fechaCreacion) {
        this.id = id;
        this.titulo = titulo;
        this.fechaCreacion = fechaCreacion; // Asume que ahora también recibes fechaCreacion
        this.estado = estado;
        this.elementoDOM = this.crearEstructuraPelicula(contenedor); // Crear la estructura básica de inmediato
        this.cargarPosterYCrearPelicula(); // Cargar el póster asincrónicamente
    }

    crearEstructuraPelicula(contenedor) {
		let elementoDOM = document.createElement("div");
		elementoDOM.classList.add("pelicula");
	
		// El resto del código para crear titulo, movieYear, poster, y editorTitulo...
	
		// Crear botón para editar el título
		let botonEditar = document.createElement("button");
		botonEditar.classList.add("boton");
		botonEditar.innerHTML = "Editar";
		botonEditar.addEventListener("click", () => this.editarTitulo());
	
		// Crear botón para borrar la película
		let botonBorrar = document.createElement("button");
		botonBorrar.classList.add("boton", "borrar");
		botonBorrar.innerHTML = "Borrar";
		botonBorrar.addEventListener("click", () => this.borrarTitulo());
	
		// Crear botón para cambiar el estado de la película (vista/no vista)
		let botonEstado = document.createElement("button");
		botonEstado.className = `estado ${this.estado == "1" ? "terminada" : ""}`;
		botonEstado.classList.add("boton", "vista");
		botonEstado.innerHTML = "Vista";
		botonEstado.addEventListener("click", () => this.editarEstado());
	
		// Añadir elementos al contenedor de la película
		elementoDOM.appendChild(poster);
		elementoDOM.appendChild(titulo);
		elementoDOM.appendChild(movieYear);
		elementoDOM.appendChild(editorTitulo);
		elementoDOM.appendChild(botonEditar);
		elementoDOM.appendChild(botonBorrar);
		elementoDOM.appendChild(botonEstado);
	
		contenedor.appendChild(elementoDOM); // Añadir al contenedor general
	
		return elementoDOM; // Guardar referencia al contenedor de esta película
	}
	

    async cargarPosterYCrearPelicula() {
        try {
            const response = await fetch(`https://omdbapi.com/?apikey=b45635c9&s=${encodeURIComponent(this.titulo)}`);
            const data = await response.json();
            if (data.Search && data.Search.length > 0) {
                this.elementoDOM.querySelector(".poster").src = data.Search[0].Poster;
                this.elementoDOM.querySelector(".movieYear").innerHTML = data.Search[0].Year || "Año no encontrado";
            } else {
                this.elementoDOM.querySelector(".poster").src = 'https://demofree.sirv.com/nope-not-here.jpg?w=150';
                this.elementoDOM.querySelector(".movieYear").innerHTML = "Año no encontrado";
            }
        } catch (error) {
            console.error("Error cargando el póster: ", error);
        }
    }
    async editarTitulo(){
		if(this.editando){
			// Guardar el título editado
			let tituloTemporal = this.elementoDOM.children[3].value.trim(); // Acceso correcto al input
			if(tituloTemporal != "" && tituloTemporal != this.titulo){ // Uso de this.titulo
				let {resultado} = await ajax(`/editar/${this.id}/1`,"PUT",{ titulo : tituloTemporal})
				if(resultado == "ok"){
					this.titulo = tituloTemporal; // Actualización correcta de this.titulo
				}               
			}
			// Actualizar la representación del título en el DOM
			this.elementoDOM.children[1].innerHTML = this.titulo; // Uso correcto de this.titulo
			this.elementoDOM.children[1].classList.add("visible");
			this.elementoDOM.children[3].classList.remove("visible"); // Ocultar el input
			this.elementoDOM.children[5].innerHTML = "Editar";
	
		}else{
			// Habilitar la edición del título
			this.elementoDOM.children[1].classList.remove("visible"); // Ocultar el h3 del título
			this.elementoDOM.children[3].value = this.titulo; // Asegurar que el valor del input se establezca correctamente con this.titulo
			this.elementoDOM.children[3].classList.add("visible"); // Mostrar el input
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