'use strict';

const Client = require("node-rest-client").Client;
const nuxeoconfig = require("../config/nuxeo.conf.js");

var client = new Client({ user: nuxeoconfig.USUARIO, password: nuxeoconfig.PASSWORD });

var request_create_user =(row)=>{
    let body ={ "entity-type": "user", "id":row["tipo_documento"]+":"+row["no_documento"], 
        "properties":{"username":row["tipo_documento"]+":"+row["no_documento"], 
        "email":row["email"], "lastName":row["apellidos"], "firstName":row["nombres"],
         "password":row["tipo_documento"]+":"+row["no_documento"], "groups":"none" } }	;
    
    let p = new Promise( function (resolve,reject){
        resolve(body);
    });

    return p;
}
var request_create_workspace =(tittle,path)=>{
    
    let args = {
        data: {"entity-type": "document","name":tittle,"type": "Workspace","properties": {"dc:title":tittle}},
        headers: { "Content-Type": "application/json" }
    };
    let p = new Promise(function(resolve,reject){   
        client.post(nuxeoconfig.URL_NUXEO+"/nuxeo/api/v1/path/default-domain/UserWorkspaces/"+path, args, function (data, response){
            resolve(response.statusCode); 
        });
    })
    return p;
}

var add_permission=(login_user)=>{
    let args = {
        data: {"params":{"permission":"Everything","acl":"local","username":login_user},"input":"/default-domain/UserWorkspaces/"+login_user,"context":{}},
        headers: { "Content-Type": "application/json" }
    };

    let p = new Promise(function (resolve,reject){
        client.post(nuxeoconfig.URL_NUXEO+"/nuxeo/site/automation/Document.AddPermission/", args, function (data, response){
            
            resolve(response.statusCode); 
        });
    });
    return p;
}


var send_request_user = (body)=>{
    let args = {
        data: body,
        headers: { "Content-Type": "application/json" }
    };
    let p = new Promise(function (resolve,reject){
        client.post(nuxeoconfig.URL_NUXEO+"/nuxeo/api/v1/user/", args, function (data, response){
            resolve(response.statusCode);
        });
    });
    return p;
}


module.exports ={    
    create_request_user_nuxeo:(user) =>{
        return request_create_user(user);
    },
    create_user_nuxeo:(request)=>{
        return send_request_user(request);
    },
    create_directory : (title,path)=>{
        return request_create_workspace(title,path);
    },
    add_permision_to_personal:(login_user)=>{
        return add_permission(login_user);
    }
 }