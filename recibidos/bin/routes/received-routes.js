'use strict'

const express = require('express')
const Middlewares = require('../services/middlewares')
const ReceivedService = require('../services/received-service')
// test
const testRequest = require('../services/test.request')

let api = express.Router()

api.route('/received')
  .post(Middlewares.ensureAuthentication, ReceivedService.saveReceivedService)

api.route('/test/json').post(testRequest.testRequestjson)
api.route('/test/multipart').post(testRequest.testRequestMultipart)

module.exports = api
