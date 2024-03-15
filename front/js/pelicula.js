class Pelicula {
    constructor(id, titulo, estado, contenedor, fechaCreacion) {
        this.id = id;
        this.titulo = titulo;
        this.fechaCreacion = fechaCreacion;
        this.estado = estado;
        this.editando = false;
        this.elementoDOM = this.crearEstructuraPelicula(contenedor);
        this.cargarPosterYCrearPelicula();
    }

    crearEstructuraPelicula(contenedor) {
        let elementoDOM = document.createElement("div");
        elementoDOM.classList.add("pelicula");

        let titulo = document.createElement("h3");
        titulo.classList.add("visible");
        titulo.innerHTML = this.titulo;
        elementoDOM.appendChild(titulo);

        let movieYear = document.createElement("h4");
        movieYear.classList.add("movieYear");
        elementoDOM.appendChild(movieYear);

        let poster = document.createElement("img");
        poster.classList.add("poster");
        elementoDOM.appendChild(poster);

        let editorTitulo = document.createElement("input");
        editorTitulo.classList.add("editorTitulo");
        editorTitulo.setAttribute("type", "text");
        editorTitulo.value = this.titulo;
        elementoDOM.appendChild(editorTitulo);
        
        let botonEstado = document.createElement("button");
        botonEstado.className = `boton vista ${this.estado == "1" ? "terminada" : ""}`;
        botonEstado.textContent = "Vista";
        botonEstado.addEventListener("click", () => this.editarEstado());
        elementoDOM.appendChild(botonEstado);

        let botonEditar = document.createElement("button");
        botonEditar.classList.add("boton");
        botonEditar.textContent = "Editar";
        botonEditar.addEventListener("click", () => this.editarTitulo());
        elementoDOM.appendChild(botonEditar);
        
        let botonBorrar = document.createElement("button");
        botonBorrar.classList.add("boton", "borrar");
        botonBorrar.textContent = "Borrar";
        botonBorrar.addEventListener("click", () => this.borrarTitulo());
        elementoDOM.appendChild(botonBorrar);

        contenedor.appendChild(elementoDOM);
        return elementoDOM;
    }

    async cargarPosterYCrearPelicula() {
        try {
            const response = await fetch(`https://omdbapi.com/?apikey=b45635c9&s=${encodeURIComponent(this.titulo)}`);
            const data = await response.json();
            if (data.Search && data.Search.length > 0) {
                this.elementoDOM.querySelector(".poster").src = data.Search[0].Poster;
                this.elementoDOM.querySelector(".movieYear").innerHTML = data.Search[0].Year || "Película no encontrada";
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
			this.elementoDOM.children[0].innerHTML = this.titulo; // Uso correcto de this.titulo
			this.elementoDOM.children[0].classList.add("visible");
			this.elementoDOM.children[3].classList.remove("visible"); // Ocultar el input
			this.elementoDOM.children[5].innerHTML = "Editar";
	
		}else{
			// Habilitar la edición del título
			this.elementoDOM.children[0].classList.remove("visible"); // Ocultar el h3 del título
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
	
	editarEstado() {
		// Alternar el estado local de la película.
		this.estado = this.estado === "0" ? "1" : "0";
		// Alternar la clase "terminada" para el botón visualmente.
		this.elementoDOM.querySelector('.vista').classList.toggle("terminada");
	
		// Aquí suponemos que ajax es una función definida para manejar llamadas AJAX y actualizar el servidor.
		// La función debería manejar la promesa devuelta y reaccionar en consecuencia.
		ajax(`/editar/${this.id}/0`, "PUT", { estado: this.estado })
			.then(response => {
				//console.log(response);
				// Manejar la respuesta del servidor aquí, si es necesario.
			})
			.catch(error => {
				console.error("Error al cambiar el estado: ", error);
				// Posiblemente revertir el cambio de estado visual si la actualización del servidor falla.
			});
	}
}