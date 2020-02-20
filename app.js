const express = require('express')
const app = express()
const http = require('http').createServer(app)
const cors = require('cors')

app.use(cors())
 
module.exports = http