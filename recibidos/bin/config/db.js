'use strict'

const Sequelize = require('sequelize')
let sequelize = null
const config = {
  database: process.env.DB_NAME || 'alejandria',
  username: process.env.DB_USER || 'alejandria',
  password: process.env.DB_PASS || '123456',
  host: process.env.DB_HOST || '35.171.186.161',
  dialect: 'postgres'
}

let dataBase = () => {
  if (!sequelize) {
    sequelize = new Sequelize(config.database, config.username, config.password, {
      host: config.host,
      dialect: config.dialect,
      operatorsAliases: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      define: {
        timestamps: false
      }
    })
  }
  return sequelize
}

module.exports = {
  dataBase
}
