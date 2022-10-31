//! NOTAS:
// el path es el endpoint que va despues de la url base: ejemplo: https://google.com/images/ - y se optiene req.url 


// Importamos librerias

// http: sirve para crear un servidor y utilizar sus metodos
const http = require('http');

// path: serve para rosolver las rutas absolutas de nuestros archivos
const path = require('path');

const fs = require('fs/promises');
const { info } = require('console');
const { request } = require('https');

//PORT: Es el puerto que utilizara el servidor
const PORT = 8000;

// voy a leer data.json
//Implementamos el metodo createServer para crear el servidor
const app = http.createServer(async(req, res) => {
    //Codigo de funcionamiento

    // obtengo ruta absoluta de data.json
    const jsonPath = path.resolve("./data.json");

    // req.method lo utilizo para saber cual el el metodo que requiere el cliente
    const method = req.method;

    //optenemos el endpoint o url de donde se hace la peticion para 
    //condicionar que se da respuesta solo si se realiza la peticion desde ese endpoint
    const url = req.url

    if (url === "/tasks") {

        // para responder segun el metodo vamos a consultar cual es el metodo requerido por el cliente
        // y por medio del if hacemos una u otra cosa segun el caso
        // Vamos a leer la información que hay data.json - debo pasa como parametro la ruta absoluta de data.json y el formato utf8
        // como es una propiedad de fs asincrona debemos implementar await y async para reoslver la promesa
        const jsonFile = await fs.readFile(jsonPath, 'utf8');
    
        if (method=== "GET"){    
            // indico en en la cabecera que el contenido que voy a enviar es un json
            res.setHeader("Content-Type", "application/json"); // tipo de contenido Json - aqui ponemos ejemplo "text/html" iamgen audio video etc.
            // Respondemos con el archivo tipo json
            res.write(jsonFile); // es decir obtengo toda la informacion de data.json y la presento
    
        } if (method=== "POST") {
            // como aqui agregamos contenido al data.json necesitamos el body "Que es el contenido nuevo para aagregar"
            // el body es una propiedad del request "req.body"

            //obtenemos el data.json
            // leer data.json
            // escribir el data.json con el body

            //metodo para escuhcar si hay un dato en el body
            req.on("data", (data) => {
                // como recivo un Json debo pasarlo a arreglo para poder editarlo y asi agregar al data.json
                const newTasks = (JSON.parse(data))
                // como ya tengo data.json debo pasarlo a arreglo para poder incluir el body
                const array = JSON.parse(jsonFile) //data.json lo paso a arreglo
                array.push(newTasks) // agrego al arreglo el body
                const newJason = JSON.stringify(array) // convierto el arreglo a JSON
                fs.writeFile(jsonPath, newJason) // sobre escribo en el data.json el newJason
            })
    
        } if (method=== "PUT") {
            //Obtengo el data.json
            const array = JSON.parse(jsonFile) //data.json lo paso a arreglo
             //metodo para escuhcar si hay un dato en el body
             req.on("data", (data) => {
                // como recivo un Json debo pasarlo a arreglo para poder editarlo y asi agregar al data.json
                const newTasks = (JSON.parse(data))
                const idSelection = newTasks.id // identifico el id que esta en el body para actualizar
                
                const result = array.filter(e => e.id !== idSelection); // filtro el objeto que voy a remplazar por lo que voy a editar
                result.push(newTasks) // agrego al arreglo el body
                const newJason = JSON.stringify(result) // convierto el arreglo a JSON
                fs.writeFile(jsonPath, newJason) // sobre escribo en el data.json el newJason
             });
            
            // convierto el data.json a arreglo 
            // obtengo el id seleccionado
            // remplazo la información del objeto que corresponde el id por lo que va en el body
            // convierto de nuevo el arreglo a JSON
            // sobre escribo en el data.json

    
        } if (method=== "DELETE") {
            //Obtengo el data.json
            const array = JSON.parse(jsonFile) //data.json lo paso a arreglo
             //metodo para escuhcar si hay un dato en el body
             req.on("data", (data) => {
                // como recivo un Json debo pasarlo a arreglo para poder editarlo y asi agregar al data.json
                const newTasks = (JSON.parse(data))
                const idSelection = newTasks.id // identifico el id que esta en el body para actualizar
                
                const result = array.filter(e => e.id !== idSelection); // filtro el objeto que voy a remplazar por lo que voy a editar
                const newJason = JSON.stringify(result) // convierto el arreglo a JSON
                fs.writeFile(jsonPath, newJason) // sobre escribo en el data.json el newJason
             });
            
            // convierto el data.json a arreglo 
            // obtengo el id seleccionado
            // Elimino del arreglo el objeto segun el id seleccionado
            // convierto de nuevo el arreglo a JSON
            // sobre escribo en el data.json
        } 

    }

    res.end(); // finaliza la respuesta
});

app.listen(PORT); // escucha por el puerto 8000