
let socket;

let localStream = null;

let peers = {}

let socket_id_globally

let server = ""

if(location.href.substr(0,5) !== 'https') 
    location.href = 'https' + location.href.substr(4, location.href.length - 4)


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


let constraints = {
    audio: true,
    video: {
        width: {
            max: 300
        },
        height: {
            max: 300
        }
    }
}


constraints.video.facingMode = {
    ideal: "user"
}

init()



function init() {
    socket = io()
    socket.on('initSend', socket_id => {
        addPeer(socket_id, true)
        socket_id_globally = socket_id
    })
    socket.on('removePeer', socket_id => {
        removePeer(socket_id)
    })
    socket.on('disconnect', () => {
        for (let socket_id in peers) {
            removePeer(socket_id)
        }
    })

    socket.on('signal', data => {
        peers[data.socket_id].signal(data.signal)
    })
}

function VideoPlay(){
    var videos = document.querySelectorAll('video'); 

   for(video of videos) {
          video.play(); 
          video.addEventListener('mousemove', mousemovemethod, false);
          video.addEventListener('click', mouseClickmethod, false);
          document.getElementById("waiting_for_stream").style.display = "none";
          initMouseRecognition(video)
     }
}
function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();

    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();

      }
    }

    setTimeout(VideoPlay,1000)


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
        videos.appendChild(newVid)
    })
}




function toggleMute() {
    for (let index in localStream.getAudioTracks()) {
        localStream.getAudioTracks()[index].enabled = !localStream.getAudioTracks()[index].enabled
        muteButton.innerText = localStream.getAudioTracks()[index].enabled ? "Unmuted" : "Muted"
    }
}

function toggleVid() {
    for (let index in localStream.getVideoTracks()) {
        localStream.getVideoTracks()[index].enabled = !localStream.getVideoTracks()[index].enabled
        vidButton.innerText = localStream.getVideoTracks()[index].enabled ? "Video Enabled" : "Video Disabled"
    }
}


function updateButtons() {
    for (let index in localStream.getVideoTracks()) {
        vidButton.innerText = localStream.getVideoTracks()[index].enabled ? "Video Enabled" : "Video Disabled"
    }
    for (let index in localStream.getAudioTracks()) {
        muteButton.innerText = localStream.getAudioTracks()[index].enabled ? "Unmuted" : "Muted"
    }
}


function sendPing(){
    socket.emit('pingSingal', socket.id)
}

let result =0
let start
var ENV = {
    "ping":0,
    "jitter":0
}
function calcPing(){
     result =0
     start = new Date().getTime()
    sendPing()
}
socket.on('pingSend', socket_id => {
    let end = new Date().getTime()
    console.log("ping received")
    result =  end - start
    ENV.ping = result
 })
