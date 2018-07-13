'use strict'

const Sequelize = require('sequelize')
const setup = require('../config/db')

module.exports = function setupEntityModel () {
  let sequelize = setup.dataBase()
  return sequelize.define('al_entidad', {
    codigo_entidad: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    },
    nombre_entidad: {
      type: Sequelize.STRING,
      allowNull: false
    },
    usuario: {
      type: Sequelize.STRING,
      allowNull: false
    },
    contrasena: {
      type: Sequelize.STRING,
      allowNull: false
    },
    fecha_registro: {
      type: Sequelize.STRING,
      allowNull: false
    },
    estado: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    freezeTableName: true
  })
}
