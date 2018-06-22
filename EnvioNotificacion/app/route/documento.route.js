module.exports = function (app){
    const documento =require("../controller/documento.controller.js"),
    passport = require('passport'),
    BasicStrategy = require('passport-http').BasicStrategy;
    app.use(passport.authenticate('basic', { session: false }));

    // Post de creacion del documento
    app.post("/api/notificacion",passport.authenticate('basic', { session: false }),documento.creaNotificacionNuxeo);
    
    // verificar autenticacion
    app.get('/', passport.authenticate('basic', { session: false }), (req, res) => {
        res.send("bienvenido");
    });
    passport.use(new BasicStrategy(
        {
          
          realm: 'Servicio denegado por autenticacion'
        },
        function(username, password, done) {
          
          
          if (username === 'Administrator' && password ==='Administrator') {
            const user = { name: username };
            return done(null, user);
          }
          return done(null, false);
    }));
};