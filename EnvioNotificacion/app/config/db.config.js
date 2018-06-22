const config = require('./data.config.js');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(config.database,config.username,config.password,{
    host:config.host,
    dialect:config.dialect,
    port:config.port,
    pool:config.pool,
    define:config.define
});

const db ={};
db.Sequelize = Sequelize;
db.sequelize= Sequelize;

//Modelos incluidos
db.documento = require("../model/documento.model.js")(sequelize,Sequelize);

module.exports= db;

