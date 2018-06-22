var formidable = require("formidable");
var fs = require('fs')
const csv=require('csvtojson');
var request = require("./request.js");
var ldap = require("./ldap.js");
const Promise =require("bluebird");

var read_csv =(file,req,res,next)=>{
    
    csv()
        .fromFile(file["path"])
        .then((jsonObj)=>{
            
            Promise.map(jsonObj, function (item){
                let users_created={};    
                return request.create_request_user_nuxeo(item)
                .then(request_user_nuxeo=>{
                    return request.create_user_nuxeo(request_user_nuxeo);
                }).then(created_user=>{
                    if(created_user==201){
                        users_created={"upload_nuxeo":"ok","login_nuxeo":item["tipo_documento"]+":"+item["no_documento"]};
                        return request.create_directory(item["tipo_documento"]+":"+item["no_documento"],"");
                    }
                    else {
                        users_created={"upload_nuxeo":"error","login_nuxeo":item["tipo_documento"]+":"+item["no_documento"]};
                        return 409;
                    }  
                }).then(directory_personal=>{
                    if(directory_personal==201){
                        users_created.directory_personal="ok";
                        return request.create_directory("recibidos",item["tipo_documento"]+":"+item["no_documento"]);
                    }else{
                        users_created.directory_personal="error";
                        return 409;
                    } 
                }).then(directory_recibidos=>{
                    if(directory_recibidos==201){
                        users_created.directory_recibidos="ok";
                        return request.create_directory("notificaciones",item["tipo_documento"]+":"+item["no_documento"]+"/recibidos");
                    }else{
                        users_created.directory_recibidos="error";
                        return 409;
                    }
                }).then(directory_notificaciones=>{
                    if(directory_notificaciones==201){
                        users_created.directory_notificaciones="ok";
                        return request.create_directory("comunicaciones",item["tipo_documento"]+":"+item["no_documento"]+"/recibidos");
                    }else{
                        users_created.directory_notificaciones="error";
                        return 409;
                    }
                }).then(directory_comunicaciones=>{
                    if(directory_comunicaciones==201){
                        users_created.directory_comunicaciones="ok";
                        return request.add_permision_to_personal(item["tipo_documento"]+":"+item["no_documento"]);
                    }else{
                        users_created.directory_comunicaciones="error";
                        return 409;
                    }
                }).then(permission_personal_space=>{
                    if(permission_personal_space==200){
                        users_created.permission_personal_space="ok";
                        return  ldap.create_user_ldap(item);
                    }else{
                        users_created.permission_personal_space="error";
                        return 409;
                    }
                    
                }).then(user_ldap=>{
                    if(user_ldap==201){
                        users_created.ldap_user="ok";
                    }else{
                        users_created.ldap_user="error";
                    }
                    return users_created;
                });
            }).then(all_results=>{
                
                res.send(all_results);
            });  
    })
}


var process_input=(req,res,next)=>{
    let form = new formidable.IncomingForm();
    let inputs={};
    
    form.parse(req,function(err,fields,files){
        inputs =fields;
    });
    
    try {
        form.on("end",function (fields,files){
            read_csv(this.openedFiles[0],req,res,next);
        });
    } catch (error) {
        
    }
            
}

var upload_nuxeo =(req)=>{
   let p = new Promise();
}

module.exports ={
   create_users:(req,res,next)=>{
        process_input(req,res,next);
   }
}