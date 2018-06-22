'use strict';
var ldap = require('ldapjs');
var ssha = require('node-ssha256');
const ldapConfiration = require("../config/ldap.conf.js");

var crete_user_ldap = (newDN,newUser, callback)=> {
    let client = ldap.createClient({
    url: 'ldap://18.208.228.154:389/cn=admin,dc=alejandria,dc=com'
    });

  client.bind(ldapConfiration.dn,ldapConfiration.password,function(err){
    client.add(newDN, newUser,callback);
  });
}
module.exports={
    create_user_ldap:(user_to_create)=>{
        let p = new Promise(function (resolve,reject){
            
            let newDN = "cn="+user_to_create["tipo_documento"]+":"+user_to_create["no_documento"]+",ou=users,dc=alejandria,dc=com";
            let newUser = {
                cn: user_to_create["tipo_documento"]+":"+user_to_create["no_documento"],
                objectClass: 'inetOrgPerson',
                givenName:user_to_create["nombres"],
                sn: user_to_create["apellidos"],
                uid: user_to_create["tipo_documento"]+":"+user_to_create["no_documento"],
                homePostalAddress:user_to_create["direccion"],
                homePhone:user_to_create["no_telefono"],
                mobile:user_to_create["no_celular"],
                description:"departamento:"+user_to_create["departamento"]+",municipio"+user_to_create["municipio"]
                +", vigencia_documento:"+user_to_create["vigencia_documento"]+",firma."+user_to_create["firmado"]+",email:"+user_to_create["email"],
                userPassword: '123456'
            }
            
            crete_user_ldap(newDN,newUser,function(err) {
                if(err== null) resolve(201);
                else resolve(500);
            });
        });
        return p;
    }
};