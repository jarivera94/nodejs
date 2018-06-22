var carga_controller = require("../controller/carga.js");
module.exports= function (app){

    app.post("/upload/users",carga_controller.create_users);
    
};