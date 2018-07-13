'use strict'

const express = require('express')
const app = express()

// Services
const ReceivedRoute = require('./bin/routes/received-routes')

// Service CONFIG
const SERVICE = {}
SERVICE.name = 'service_received'
SERVICE.port = process.env.port || 4000

// API

app.use('/api', ReceivedRoute)
// API DEFAULT

app.listen(SERVICE.port, () => console.log('API running:', SERVICE))
