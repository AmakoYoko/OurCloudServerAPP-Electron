const fs = require('fs')
const path = require('path')
const express = require('express')
const app = express()
const httpolyglot = require('httpolyglot')
const https = require('https')

//////// CONFIGURATION ///////////

// insert your own ssl certificate and keys

////////////////////////////

require('./routes')(app)

const httpsServer = httpolyglot.createServer(options, app)
const io = require('socket.io')(httpsServer)
require('./socketController')(io)


httpsServer.listen(port, () => {
    console.log(`listening on port ${port}`)
})





