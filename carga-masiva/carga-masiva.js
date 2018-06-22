'use strict';

const express= require("express");
const app = express();

//Config
global.SERVICE={};
SERVICE.name="carga-masiva";
SERVICE.port=process.env.SERVICE_PORT || 8085;

app.set('etag',false);

require("./app/route/carga.js")(app);

app.listen(SERVICE.port, ()=>console.log(SERVICE));