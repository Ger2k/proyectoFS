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
    
        let poster = document.createElement("img");
        poster.classList.add("poster");
        elementoDOM.appendChild(poster);
    
        let titulo = document.createElement("h3");
        titulo.classList.add("visible");
        titulo.innerHTML = this.titulo;
        elementoDOM.appendChild(titulo);
    
        let editorTitulo = document.createElement("input");
        editorTitulo.classList.add("editorTitulo");
        editorTitulo.setAttribute("type", "text");
        editorTitulo.value = this.titulo;
        elementoDOM.appendChild(editorTitulo);
    
        let movieYear = document.createElement("h4");
        movieYear.classList.add("movieYear");
        elementoDOM.appendChild(movieYear);
    
        let seccionBotones = document.createElement("section");
        seccionBotones.classList.add("contenedor-botones");
    
        let botonEstado = document.createElement("button");
        botonEstado.className = `boton vista ${this.estado == "1" ? "terminada" : ""}`;
        botonEstado.textContent = "Vista";
        botonEstado.addEventListener("click", () => this.editarEstado());
        seccionBotones.appendChild(botonEstado);
    
        let botonEditar = document.createElement("button");
        botonEditar.classList.add("boton", "editar");
        botonEditar.textContent = "Editar";
        botonEditar.addEventListener("click", () => this.editarTitulo());
        seccionBotones.appendChild(botonEditar);
        
        let botonBorrar = document.createElement("button");
        botonBorrar.classList.add("boton", "borrar");
        botonBorrar.textContent = "Borrar";
        botonBorrar.addEventListener("click", () => this.borrarTitulo());
        seccionBotones.appendChild(botonBorrar);
    
        elementoDOM.appendChild(seccionBotones);
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
            let tituloTemporal = this.elementoDOM.children[2].value.trim(); // Ahora el input es children[2]
            if(tituloTemporal != "" && tituloTemporal != this.titulo){
                let {resultado} = await ajax(`/editar/${this.id}/1`,"PUT",{ titulo : tituloTemporal})
                if(resultado == "ok"){
                    this.titulo = tituloTemporal;
                }               
            }
            // Actualizar la representación del título en el DOM
            this.elementoDOM.children[1].innerHTML = this.titulo; // El h3 del título es ahora children[1]
            this.elementoDOM.children[1].classList.add("visible");
            this.elementoDOM.children[2].classList.remove("visible"); // Ocultar el input, que es ahora children[2]
            this.elementoDOM.querySelector(".boton.editar").textContent = "Editar"; // Usar querySelector para encontrar el botón editar
    
        }else{
            // Habilitar la edición del título
            this.elementoDOM.children[1].classList.remove("visible"); // Ocultar el h3 del título, que es ahora children[1]
            this.elementoDOM.children[2].value = this.titulo; // El input es ahora children[2]
            this.elementoDOM.children[2].classList.add("visible"); // Mostrar el input, que es ahora children[2]
            this.elementoDOM.querySelector(".boton.editar").textContent = "Guardar"; // Usar querySelector para encontrar el botón editar
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