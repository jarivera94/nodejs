const db = require("../config/db.config.js");
const nuxeoconfig= require("../config/nuxeo.conf.js");
var formidable = require ("formidable");
var fs = require ("fs");
var FormData = require ("form-data");
var Documento = db.documento;

var unirest = require('unirest');

//Definicion del cliente rest y autenticacion del mismo
var Client = require('node-rest-client').Client; 
//Definicion de cliente form
var formData = new FormData();
var options_auth = { user: nuxeoconfig.USUARIO, password: nuxeoconfig.PASSWORD };
var client = new Client(options_auth);
var batchId={};


exports.creaNotificacionNuxeo=(req,res,next)=>{
    
    var form = new formidable.IncomingForm();
    var inputs={};
    form.parse(req,function(err,fields,files){
        inputs =fields;
        
    });
    var uids =form.on("end",function(fields,files){
        for (let index = 0; index < this.openedFiles.length; index++) {  
            creaBatchNuxeo(req,res,cargaDocumento,this.openedFiles[index],inputs);   
        }    
    });
}

var creaBatchNuxeo =(req,res,callback,file,inputs)=>{
    var args = {
        data: {},
        headers: { "Content-Type": "application/json" }
    };
    
    client.post(nuxeoconfig.URL_NUXEO+"/nuxeo/api/v1/upload", args, function (data, response) { 
        
        callback(data.batchId,file,inputs,req,res);
    });    
};

var cargaDocumento=(batchId,file,inputs,req,res)=>{
    
      unirest.post(nuxeoconfig.URL_NUXEO+"/nuxeo/api/v1/upload/"+batchId+"/0")
        .headers({'Content-Type': 'multipart/form-data',
            'Authorization':'Basic '+Buffer.from(nuxeoconfig.USUARIO+':'+nuxeoconfig.PASSWORD).toString('base64')})
        .attach('file', file["path"]) // Attachment
        .end(function (response) {
            
            almacenaDocumento(batchId,req,res,response,inputs);
        });
}

var almacenaDocumento =(batchId,req,res,response,inputs)=>{
    if(!response.error){
        var args = {
            data: {
                "entity-type": "document",
                "name":inputs.titulo_documento,
                "type": "File",
                "properties" : {
                  "dc:title":inputs.titulo_documento,
                  "dc:description":inputs.descripcion,
                  "file:content": {
                    "upload-batch":batchId,
                    "upload-fileId":"0"
                  }
                }
              },
              
            headers: { "Content-Type": "application/json" }
        };
        
        client.post(nuxeoconfig.URL_NUXEO+"/nuxeo/api/v1/path/default-domain/UserWorkspaces/"+inputs.tipo_documento+":"+inputs.usuario+"/recibidos/notificaciones", args, function (body, respuesta) { 
            console.log(nuxeoconfig.URL_NUXEO+"/nuxeo/api/v1/path/default-domain/UserWorkspaces/"+inputs.tipo_documento+":"+inputs.usuario+"/recibidos/notificaciones");
            console.log(respuesta.statusCode);
            if(respuesta.statusCode=='201'){
                persisteDocumento(JSON.parse(body.toString('utf-8')),req,res,inputs);
            }
        }); 
    }
}

var persisteDocumento=(body,req,res,inputs)=>{
    
    Documento.create({
        uid:body.uid,
        autor:inputs.autor,
        titulo_documento:inputs.titulo_documento,
        version_documento:inputs.version_documento,
        palabras_clave:inputs.palabras_clave,
        metadatos:inputs.metadatos,
        descripcion:inputs.descripcion,
        tipo_buzon:'1',
        codigo_tramite:inputs.codigo_tramite,
        usuario:inputs.tipo_documento+":"+inputs.usuario

    }).
    then(
        documento =>{
            res.send(documento);
        }
    ).catch(function(error){
            res.send(error);
    });
};