'use strict'
// Libreria Standard
const request = require('request')
/*
    Funcion para enviar una peticion post
    @param {Object} options objecto que contiene el request
    @param {resolve} success es la funcion que resulve la promesa
    @param {reject} error es la funcion que rechaza la promesa
*/

var sendPost = (options, success, error) => {
  try {
    // se arma la url a enviar la peticion
    let endpoint = options.host + ':' + options.port + options.path
    let optionsRequest = {
      method: 'POST',
      url: endpoint
    }
    // indicar que parametro tomar en la peticion {multipart,formData}
    if (options.content_type === 'json') {
      optionsRequest.body = options.body
      optionsRequest.json = true
    } else if (options.content_type === 'form-data') {
      optionsRequest.formData =
            { file:
                { value: options.body,
                  options:
                   { filename: options.body,
                     contentType: null
                   }
                }
            }
    }
    // envio de la peticion
    request(optionsRequest, function (err, response, body) {
      if (err) {
        let msg = `Ocurrio un error en la invocacion de :${options.host}${options.path}`

        error(msg)
      }
      if (response.statusCode <= 250 && response.statusCode >= 200) {
        success(body)
      } else {
        let msg = `Ocurrio un error en la invocacion de :${options.host}${options.path}: ${body}`
        error(msg)
      }
    }).auth('Administrator', 'Administrator', false)
  } catch (err) {
    console.log(err)
    let msg = `Ocurrio un error inesperado al invocar a :${options.host}${options.path}`
    error(msg)
  }
}

/*
    Funcion que arma el cuerpo de la peticion
    @param {String} host direccion o dominio del servicio
    @param {String} port puerto del servidor
    @param {String} path contexto de conexion
    @param {String} body data que se envia al servicio
    @param {String} content_type indica el tipo de encabezado
    @param {String} us indica el usuario de basic auth
    @param {String} pwd indica la contraseña de basic auth
*/
var postPromise = (host, port, path, body, contentType, fileName, us, pwd) => {
  let options = {
    'host': host,
    'port': port,
    'path': path,
    'body': body,
    'content_type': contentType,
    'file_name': fileName,
    'usuario': us,
    'contrasena': pwd
  }

  // Envia la peticion usando http libreria standard
  let p = new Promise((resolve, reject) => {
    sendPost(options, (data) => {
      resolve(data)
    }, error => {
      reject(error)
    })
  })

  return p
}

//
module.exports = {
  /*
        Funcion que arma el cuerpo de la peticion
        @param {String} host direccion o dominio del servicio
        @param {String} port puerto del servidor
        @param {String} path contexto de conexion
        @param {String} body data que se envia al servicio
        @param {String} us indica el usuario de basic auth
        @param {String} pwd indica la contraseña de basic auth
    */
  postJsonData: (host, port, path, body, us, pwd) => {
    // Se envia la peticion usando http
    return postPromise(host, port, path, body, 'json', '', us, pwd)
  },
  /*
        Funcion que arma el cuerpo de la peticion
         @param {String} host direccion o dominio del servicio
        @param {String} port puerto del servidor
        @param {String} path contexto de conexion
        @param {String} body data que se envia al servicio
        @param {String} file_name indica el nombre del archivo a cargar
        @param {String} us indica el usuario de basic auth
        @param {String} pwd indica la contraseña de basic auth
    */
  postMultipartData: (host, port, path, body, fileName, us, pwd) => {
    // Se envia la peticion usando http
    return postPromise(host, port, path, body, 'form-data', fileName, us, pwd)
  }

}
