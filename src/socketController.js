
peers = {}

module.exports = (io) => {
    var robot = require("robotjs");
    const sound = require('sound-play')
    const path = require("path");

    robot.setKeyboardDelay(1)

    io.on('connect', (socket) => {
        console.log('a client is connected')


        // Initiate the connection process as soon as the client connects

        peers[socket.id] = socket

        // Asking all other clients to setup the peer connection receiver
        for(let id in peers) {
            if(id === socket.id) continue
            console.log('sending init receive to ' + socket.id)
            peers[id].emit('initReceive', socket.id)
        }

        /**
         * relay a peerconnection signal to a specific socket
         */
        socket.on('signal', data => {
           // console.log('sending signal from ' + socket.id + ' to ', data)
            if(!peers[data.socket_id])return
            peers[data.socket_id].emit('signal', {
                socket_id: socket.id,
                signal: data.signal
            })
        })


        /**
         * remove the disconnected peer connection from all other connected clients
         */
        socket.on('disconnect', () => {
            console.log('socket disconnected ' + socket.id)
            socket.broadcast.emit('removePeer', socket.id)
            delete peers[socket.id]
        })

        /**
         * Send message to client to initiate a connection
         * The sender has already setup a peer connection receiver
         */
        socket.on('initSend', init_socket_id => {
            console.log('INIT SEND by ' + socket.id + ' for ' + init_socket_id)
            peers[init_socket_id].emit('initSend', socket.id)
        })
        socket.on('pingSingal', init_socket_id => {
            console.log("ping")
            peers[init_socket_id].emit('pingSend')
        })

 
        socket.on('keySend', (dest_socket_id, keyEventCode) => {
            try {
                robot.keyTap(keyEventCode.toLowerCase());
            } catch (error) {
                console.log(error)
            }
        })
        socket.on('soundTest', (dest_socket_id) => {
            console.log("soundTest")
            const filePath = path.join(__dirname, "stereotest.mp3");
            sound.play(filePath);



        })
        socket.on('mouseSend', (dest_socket_id, x,y) => {
            robot.moveMouse(x,y);
        })
        socket.on('mouseSendBtn', (dest_socket_id, btn) => {
            switch (btn) {
                case 0:
                    robot.mouseClick("left");

                  break;
                case 1:
                    robot.mouseClick("middle");
                  break;
                case 2:
                    robot.mouseClick("right");
                  break;
                default:
                  console.log(`Unknown button code: ${e.button}`)
              }
        })

    })
}