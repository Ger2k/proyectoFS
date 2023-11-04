const {MongoClient,ObjectId} = require("mongodb");
const urlConexion = "mongodb+srv://Gerdoski:root@clase.fvxse9x.mongodb.net/";


function conectar(){
    return new MongoClient(urlConexion);
}

function leerPeliculas(){
    return new Promise(async callback => {
        let conexion = await conectar();

        let coleccion = conexion.db("peliculas").collection("peliculas");

        let peliculas = await coleccion.find({}).toArray();

        conexion.close()
        callback(peliculas);
    })
}

function nuevaPelicula(titulo){
    return new Promise(async callback => {
    
        MongoClient.connect(urlConexion)
        .then(async conexion => {
            let resultado = { resultado : "ko"}
            let coleccion = conexion.db("peliculas").collection("peliculas");
            let {acknowledged,insertedId} = await coleccion.insertOne({ "titulo" : titulo , "terminada" : "0"});
            if(acknowledged){
                resultado.resultado = "ok";
                resultado.id = insertedId;
                callback(resultado)
            }else{
                callback(resultado)
            }
            conexion.close()
        })
    })
}

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
module.exports = {nuevaPelicula,borrar,leerPeliculas,editarEstado,editarTitulo}

//nuevaPelicula("Terminator").then(resultado => console.log(resultado))
//leerPeliculas().then(resultado => console.log(resultado))
//borrar("6542508d82bd91e49d91b27a").then(resultado => console.log(resultado))
//editarEstado("654249936a4c1322f4968aac").then(resultado => console.log(resultado))
//editarTitulo("654249936a4c1322f4968aac","Matrix nueva").then(resultado => console.log(resultado))