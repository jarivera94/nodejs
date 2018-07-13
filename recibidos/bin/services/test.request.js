const request = require('./request')
const configNuxeo = require('../config/nuxeo.config')
// ejemplo para leer archivos
const fs = require('fs')
const path = require('path')

module.exports = {
  /*
        funcion que envia la peticion a nuxeo tipo post y json
        @param {Request} Objeto req node js
        @param {Response} Onjeto res node js
     */
  testRequestjson: (req, res) => {
    // let bodyExample = {'entity-type': 'document', 'name': 'jvega1234', 'type': 'Folder', 'properties': {'dc:title': 'Carpeta ciudadana1'}}
    // test create batch
    request.postJsonData(configNuxeo.host, configNuxeo.port, configNuxeo.paths.upload, {}, configNuxeo.user, configNuxeo.password)
    // test create workspace
    // request.postJsonData(configNuxeo.host, configNuxeo.port, configNuxeo.paths.create_resource + '/CC:1018468830', bodyExample, configNuxeo.user, configNuxeo.password)
      .then(
        data => {
          console.log(data)
          res.send(data)
        }
      ).catch(err => {
        console.log(err)
        res.send(err)
      })
  },
  /*
        funcion que envia la peticion a nuxeo tipo post y form-data
        @param {Request} Objeto req node js
        @param {Response} Onjeto res node js
     */
  testRequestMultipart: (req, res) => {
    fs.readFile(path.join(__dirname, '/../resources/mozilla.pdf'), 'utf8', function (err, data) {
      if (err) {
        return console.log(err)
      }
      request.postMultipartData(configNuxeo.host, configNuxeo.port, configNuxeo.paths.save_upload + '/batchId-40aed3f3-8728-4fa7-9afc-9c316f23ac82/0', data, 'ARCHIVO.PDF', configNuxeo.user, configNuxeo.password).then(
        data => {
          console.log(data)
          res.send(data)
        }
      ).catch(err => {
        console.log(err)
        res.send(err)
      })
    })
  }
}
