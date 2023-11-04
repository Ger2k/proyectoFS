class Pelicula{
    constructor(id,titulo,estado,contenedor){
        this.id = id;
        this.titulo = titulo;
        this.elementoDOM = null;
        this.nuevaPelicula(estado,contenedor)
    }
    nuevaPelicula(estado,contenedor){
        this.elementoDOM = document.createElement("div");
        this.elementoDOM.classList.add("pelicula");

        //titulo

        let titulo = document.createElement("h3");
		titulo.classList.add("visible");
		titulo.innerHTML = this.titulo;

        //edit titulo

        let editorTitulo = document.createElement("input");
		editorTitulo.setAttribute("type","text");
		editorTitulo.value = this.titulo;

        //boton editar

        let botonEditar = document.createElement("button");
		botonEditar.classList.add("boton");
		botonEditar.innerHTML = "Editar";

		botonEditar.addEventListener("click", () => this.editarTitulo());


        //boton borrar

        let botonBorrar = document.createElement("button");
		botonBorrar.classList.add("boton","borrar");
		botonBorrar.innerHTML = "Borrar";

		botonBorrar.addEventListener("click", () => this.borrarTitulo());


        //boton estado

        let botonEstado = document.createElement("button");
		botonEstado.className = `estado ${estado == "1" ? "terminada" : ""}`;
        botonEstado.classList.add("boton","vista");
        botonEstado.innerHTML = "Vista";
		
		
		

		botonEstado.addEventListener("click", () => {
			this.editarEstado().then(({resultado}) => {
				if(resultado == "ok"){
					return botonEstado.classList.toggle("terminada");
				}
				console.log("...informar del error")
			})
		});

        //agregar elementos al DOM

        this.elementoDOM.appendChild(titulo);
		this.elementoDOM.appendChild(editorTitulo);
        this.elementoDOM.appendChild(botonEstado);
		this.elementoDOM.appendChild(botonEditar);
		this.elementoDOM.appendChild(botonBorrar);
		

        contenedor.appendChild(this.elementoDOM);
    }
    async editarTitulo(){
		if(this.editando){
			//guardar
			let tituloTemporal = this.elementoDOM.children[1].value.trim();
			if(tituloTemporal != "" && tituloTemporal != this.textoTitulo){
				//HACEMOS LLAMADA A AJAX... si sale bien:
				let {resultado} = await ajax(`/editar/${this.id}/1`,"PUT",{ titulo : tituloTemporal})
				if(resultado == "ok"){
					this.textoTitulo = tituloTemporal;
				}				
			}
			this.elementoDOM.children[0].innerHTML = this.textoTitulo;
			this.elementoDOM.children[0].classList.add("visible");
			this.elementoDOM.children[1].classList.remove("visible");
			this.elementoDOM.children[3].innerHTML = "Editar";

		}else{
			//editar
			this.elementoDOM.children[0].classList.remove("visible");
			this.elementoDOM.children[0].value = this.textoTitulo;
			this.elementoDOM.children[1].classList.add("visible");
			this.elementoDOM.children[3].innerHTML = "Guardar";
		}
		this.editando = !this.editando;
	}
	async borrarTitulo(){
		let {error} = await ajax(`/borrar/${this.id}`,"DELETE");
		if(!error){
			return this.elementoDOM.remove();
		}
		console.log("no se pudo borrar");
	}
	editarEstado(){
		return ajax(`/editar/${this.id}/0`,"PUT")
	}
}