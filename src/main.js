const { app, BrowserWindow, desktopCapturer } = require('electron')
const fs = require('fs')
const path = require('path')
const express = require('express')
const app_express = express()
const httpolyglot = require('httpolyglot')
const https = require('https')

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 300,
    height: 150,
    webPreferences: {
      preload: path.join(__dirname, 'electron/preload.js')
    }
  })


  mainWindow.loadFile('electron/index.html')
console.log(process.version)
  desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
    for (const source of sources) {
        console.log(source.name)
        var name = source.name;
        if(name.includes(process.argv[2]) ){
            mainWindow.webContents.send('SET_SOURCE', source.id)
            return
        }     
    }
  })

}

const options = {
  key: fs.readFileSync(path.join(__dirname,'..','ssl','key.pem'), 'utf-8'),
  cert: fs.readFileSync(path.join(__dirname,'..','ssl','cert.pem'), 'utf-8')
}

const port = process.env.PORT || 3000



app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {

    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

require('./routes')(app_express)

const httpsServer = httpolyglot.createServer(options, app_express)
const io = require('socket.io')(httpsServer)
require('./socketController')(io)


httpsServer.listen(port, () => {
    console.log(`listening on port ${port}`)
})