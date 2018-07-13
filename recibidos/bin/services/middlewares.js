'use strict'

const auth = require('basic-auth')
const setupEntityModel = require('../models/entity-model')

let ensureAuthentication = async (req, res, next) => {
  let credentials = auth(req)
  let EntityModel = setupEntityModel()
  EntityModel.findAll({
    where: {
      usuario: credentials.name,
      contrasena: credentials.pass,
      estado: '1'
    }
  }).then((entity) => {
    console.log('EntityModel', entity.length)
    if (!(entity < 0)) {
      next()
    } else {
      res.status(404).send({
        err: 'Not Found',
        message: 'Entity Not Register'
      })
    }
  }).catch(err => res.status(500).send(err))
}

module.exports = {
  ensureAuthentication
}
