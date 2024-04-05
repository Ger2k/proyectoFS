// Importación de las bibliotecas necesarias para interactuar con MongoDB

const {MongoClient,ObjectId} = require("mongodb");
const urlConexion = process.env.URL_MONGO;


// Función para crear una instancia del cliente de MongoDB y conectar a la base de datos

function conectar(){
    return new MongoClient(urlConexion);
}


// Función para leer todas las películas en la colección "peliculas"

function leerPeliculas() {
    return new Promise(async callback => {
        let conexion = await conectar();

        let coleccion = conexion.db("peliculas").collection("peliculas");

        // Añade el método sort para ordenar las películas por fechaCreacion en orden descendente
        let peliculas = await coleccion.find({}).sort({fechaCreacion: -1}).toArray();

        conexion.close();
        callback(peliculas);
    });
}



// Función para agregar una nueva película a la colección "peliculas"

function nuevaPelicula(titulo){
    return new Promise(async callback => {
    
        MongoClient.connect(urlConexion)
        .then(async conexion => {
            let resultado = { resultado : "ko"}
            let coleccion = conexion.db("peliculas").collection("peliculas");
            let fechaCreacion = new Date(); // Obtener la fecha y hora actual
            let {acknowledged, insertedId} = await coleccion.insertOne({
                "titulo": titulo,
                "terminada": "0",
                "fechaCreacion": fechaCreacion // Añadir la fecha de creación al documento
            });
            if(acknowledged){
                resultado.resultado = "ok";
                resultado.id = insertedId;
                resultado.fechaCreacion = fechaCreacion; // Opcionalmente, puedes devolver también la fecha de creación
                callback(resultado);
            }else{
                callback(resultado);
            }
            conexion.close();
        });
    });
}



// Función para borrar una película por su ID

function borrar(id){
    return new Promise(async callback => {
        
        let conexion = await conectar();
        let resultado = { resultado : "pelicula no encontrada"}
        let coleccion = conexion.db("peliculas").collection("peliculas");
        
        let {deletedCount} = await coleccion.deleteOne({ _id : new ObjectId(id) });
        
        conexion.close()

        if(deletedCount == 1){
            resultado.resultado = "ok"
            return callback(resultado)
        }
        callback(resultado)
    }) 
}


// Función para editar el estado (terminada o no) de una película por su ID

function editarEstado(id){
    return new Promise(async callback => {
        let conexion = await conectar();
        let resultado = { resultado : "ko"}
        let coleccion = conexion.db("peliculas").collection("peliculas");
        let [{terminada}] = await coleccion.find({_id : new ObjectId(id)}).toArray();
        terminada == "1" ? terminada = "0" : terminada = "1";
        

        let {modifiedCount} = await coleccion.updateOne({ _id : new ObjectId(id) }, { $set : { "terminada" : terminada }});
        
        if(modifiedCount == 1){
            resultado.resultado = "ok";
            conexion.close()
            return callback(resultado)            
        }

        conexion.close()

        
        callback(resultado)
    }) 
}


// Función para editar el título de una película por su ID

function editarTitulo(id,nuevoTitulo){
    return new Promise(async callback => {
        let conexion = await conectar();
        let resultado = { resultado : "ko"}
        let coleccion = conexion.db("peliculas").collection("peliculas");

        let {acknowledged} = await coleccion.updateOne({ _id : new ObjectId(id) }, { $set : { "titulo" : nuevoTitulo}});

        if(acknowledged){
            resultado.resultado = "ok";
            conexion.close()
            return callback(resultado)            
        }

        conexion.close()

        
        callback(resultado)
    }) 
}

// Exportar las funciones que se utilizarán en otros archivos

module.exports = {nuevaPelicula,borrar,leerPeliculas,editarEstado,editarTitulo}


