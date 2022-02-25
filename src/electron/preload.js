var reducer = 400;
var widthRes= 1680
var heightRes= 1050
const { ipcRenderer } = require('electron')
const io = require('socket.io-client');
var SimplePeer = require('simple-peer')


let socket;

let localStream = null;

let peers = {}


const configuration = {
  "iceServers": [{
          "urls": "stun:stun.l.google.com:19302"
      },
      // https://gist.github.com/sagivo/3a4b2f2c7ac6e1b5267c2f1f59ac6c6b
      {
          url: 'turn:192.158.29.39:3478?transport=udp',
          credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
          username: '28224511:1379330808'
      }
  ]
}

ipcRenderer.on('SET_SOURCE', async (event, sourceId) => {
  console.log(sourceId)
try {
  console.log(navigator.mediaDevices.getDisplayMedia)
  navigator = window.navigator
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      mandatory: {
        chromeMediaSource: 'desktop'
      }
    },
    video: {
      mandatory: {
      chromeMediaSource: 'desktop',
      chromeMediaSourceId: sourceId,
      minWidth: widthRes-reducer,
      maxWidth: widthRes-reducer,
      minHeight: heightRes-(reducer/1.6),
      maxHeight: heightRes-(reducer/1.6),
      minFrameRate: 60,
      maxFrameRate: 60
      }
    }
  })
  console.log(stream)
  handleStream(stream)
} catch (e) {
  handleError(e)
}
})

function handleStream (stream) {

const video = document.querySelector('video')
video.srcObject = stream
video.onloadedmetadata = (e) => video.play()
localStream = stream;
init()
}
function init(){
  socket = io("http://elec_proxy.myplix.eu:3000")
  socket.on('initReceive', socket_id => {
      console.log('INIT RECEIVE ' + socket_id)
      addPeer(socket_id, false)

      socket.emit('initSend', socket_id)
  })

  socket.on('initSend', socket_id => {
      console.log('INIT SEND ' + socket_id)
      addPeer(socket_id, true)
  })

  socket.on('removePeer', socket_id => {
      console.log('removing peer ' + socket_id)
      removePeer(socket_id)
  })

  socket.on('disconnect', () => {
      console.log('GOT DISCONNECTED')
      for (let socket_id in peers) {
          removePeer(socket_id)
      }
  })

  socket.on('signal', data => {
      peers[data.socket_id].signal(data.signal)
  })
}
function handleError (e) {
console.log(e)
}



function removePeer(socket_id) {

  let videoEl = document.getElementById(socket_id)
  if (videoEl) {

      const tracks = videoEl.srcObject.getTracks();

      tracks.forEach(function (track) {
          track.stop()
      })

      videoEl.srcObject = null
      videoEl.parentNode.removeChild(videoEl)
  }
  if (peers[socket_id]) peers[socket_id].destroy()
  delete peers[socket_id]
}


function addPeer(socket_id, am_initiator) {
  peers[socket_id] = new SimplePeer({
      initiator: am_initiator,
      stream: localStream,
      config: configuration
  })

  peers[socket_id].on('signal', data => {
      socket.emit('signal', {
          signal: data,
          socket_id: socket_id
      })
  })

  peers[socket_id].on('stream', stream => {
      let newVid = document.createElement('video')
      newVid.srcObject = stream
      newVid.id = socket_id
      newVid.playsinline = false
      newVid.autoplay = true
      newVid.className = "vid"
      newVid.onclick = () => openPictureMode(newVid)
      newVid.ontouchstart = (e) => openPictureMode(newVid)
      videos.appendChild(newVid)
  })
}
