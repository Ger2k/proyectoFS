// Importación de bibliotecas

const express = require("express");
const {json} = require("body-parser");
const servidor = express();
const bodyParser = require("body-parser");


// Importación de las funciones del archivo db.js

const {nuevaPelicula,borrar,leerPeliculas,editarEstado,editarTitulo} = require("./db");


// Definición del puerto para el servidor web

let puerto = process.env.PORT || 4000;


// Configuración del servidor para usar JSON y URL codificada

servidor.use(json());
servidor.use(bodyParser.urlencoded({ extended : true}));


// Middleware para verificar si las peticiones PUT contienen el encabezado Content-type

servidor.use((peticion,respuesta,siguiente) => {
    if( peticion.method == "PUT"){
        if(peticion.headers["content-type"] == "application/json"){
            return siguiente();
        }
        throw { type : "falta el header Content-type"};
    }
    siguiente();
});


// Configuración de rutas estáticas para archivos en la carpeta "front"

servidor.use("/", express.static("./front"));


// Ruta para obtener la lista de películas (GET)

servidor.get("/lista", async (peticion,respuesta) => {
    let peliculas = await leerPeliculas();
    respuesta.json(peliculas);
});


// Ruta para agregar una nueva película (POST)

servidor.post("/nueva",  async(peticion,respuesta) => {
    let {resultado} = await nuevaPelicula(peticion.body.titulo);
    if(resultado == "ok"){
        return respuesta.redirect("/");
    }
    console.log("ha ocurrido un error");
});


// Ruta para borrar una película por su ID (DELETE)

servidor.delete("/borrar/:id", async(peticion,respuesta) => {
    let resultado = await borrar(peticion.params.id);
    respuesta.json(resultado);
});


// Ruta para editar el título o el estado de una película por su ID (PUT)

servidor.put("/editar/:id/:operacion(0|1)", async (peticion,respuesta) => {
    let {id,operacion} = peticion.params;
    let {titulo} = peticion.body;
    if(operacion == 1 && !titulo){
        throw { type : "faltán parámetros"};
    }
    let resultado = operacion == 1 ? await editarTitulo(id,titulo) : await editarEstado(id);
    respuesta.json(resultado);
});


// Middleware para manejar errores de JSON no válido o falta de Content-type

servidor.use((error,peticion,respuesta,siguiente) => {
    respuesta.status(400);
    respuesta.json({error : "JSON no válido o falta el Content-type"});
})


// Middleware para manejar errores de recursos no encontrados

servidor.use((peticion,respuesta) => {
    respuesta.status(404);
    respuesta.json({ error : "RECURSO NO ENCONTRADO"})
})


// Iniciar el servidor

servidor.listen(puerto);