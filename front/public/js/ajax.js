//ESTA FUNCION GESTIONA TODAS LAS LLAMADAS A AJAX

function ajax(url,metodo,datos){
    const configuracion = !metodo ? null : {
        method : metodo
    };
    if(metodo == "POST" || metodo == "PUT"){
        configuracion.body = datos ? JSON.stringify(datos) : null;
        configuracion.headers = { "Content-type" : "application/json" }
    }
    return fetch(url,configuracion).then(respuesta => respuesta.json());
}