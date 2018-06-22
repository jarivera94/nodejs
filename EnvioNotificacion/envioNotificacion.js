'use strict';
const express = require('express'),
      app = express(),db = require('./app/config/data.config.js'),
      bodyParser = require('body-parser');

// MicroService CONFIG
global.MS = {}
MS.name = 'ms_notificaciones'
MS.port = process.env.port || 8084


require('./app/route/documento.route.js')(app);


// iniciar el servidor
app.listen( MS.port , ()=> console.log(MS) )	