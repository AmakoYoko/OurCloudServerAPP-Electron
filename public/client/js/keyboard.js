let MouseNetwork = false
let KeyNetwork = false
document.addEventListener('keydown', (event) => {
    const nomTouche = event.key;
    if(event.key == "Control"){
        VideoPlay()
    }
    if(KeyNetwork) socket.emit('keySend', socket_id_globally, nomTouche)

})

function KeyBoardToggle(){
if(KeyNetwork){
    KeyNetwork = false
}else{
    KeyNetwork = true
}
}
function MouseToggle(){
if(MouseNetwork){
    MouseNetwork = false
}else{
   MouseNetwork = true
}
}


var direction = "";
var modifierHeight
var modifierWidth
var videoHeight
var videoWidth
function map(x, in_min, in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }

function initMouseRecognition(vid){
     modifierHeight = 1050 / vid.offsetHeight;
     modifierWidth = 1680 / vid.offsetWidth;
        videoHeight = vid.offsetHeight;
        videoWidth = vid.offsetWidth;
    
}

mouseClickmethod = function (e) {    
  if(MouseNetwork) socket.emit('mouseSendBtn', socket_id_globally, e.button)     
}

mousemovemethod = function (e) {
    if(MouseNetwork) socket.emit('mouseSend', socket_id_globally, (e.layerX*modifierWidth),e.layerY*modifierHeight)
   
}

