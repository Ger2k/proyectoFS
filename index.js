const express = require("express");
const {json} = require("body-parser");
const servidor = express();

const {nuevaPelicula,borrar,leerPeliculas,editarEstado,editarTitulo} = require("./db");
const bodyParser = require("body-parser");

let puerto = process.env.PORT || 4000;

servidor.use(json());

servidor.use(bodyParser.urlencoded({ extended : true}));

servidor.use((peticion,respuesta,siguiente) => {
    if( peticion.method == "PUT"){
        if(peticion.headers["content-type"] == "application/json"){
            return siguiente();
        }
        throw { type : "falta el header Content-type"};
    }
    siguiente();
});

servidor.use("/", express.static("./front"));

//GET
servidor.get("/lista", async (peticion,respuesta) => {
    let peliculas = await leerPeliculas();
    respuesta.json(peliculas);
});

//POST

servidor.post("/nueva",  async(peticion,respuesta) => {
    let {resultado} = await nuevaPelicula(peticion.body.titulo);
    if(resultado == "ok"){
        return respuesta.redirect("/");
    }
    console.log("ha ocurrido un error");
});




//DELETE

servidor.delete("/borrar/:id", async(peticion,respuesta) => {
    let resultado = await borrar(peticion.params.id);
    respuesta.json(resultado);
});


//PUT
servidor.put("/editar/:id/:operacion(0|1)", async (peticion,respuesta) => {
    let {id,operacion} = peticion.params;
    let {titulo} = peticion.body;
    if(operacion == 1 && !titulo){
        throw { type : "faltán parámetros"};
    }
    let resultado = operacion == 1 ? await editarTitulo(id,titulo) : await editarEstado(id);
    respuesta.json(resultado);
});

//ERRORES

servidor.use((error,peticion,respuesta,siguiente) => {
    respuesta.status(400);
    respuesta.json({error : "JSON no válido o falta el Content-type"});
})

servidor.use((peticion,respuesta) => {
    respuesta.status(404);
    respuesta.json({ error : "RECURSO NO ENCONTRADO"})
})

servidor.listen(puerto);