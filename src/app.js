import io from 'socket.io-client'
import Peer from 'simple-peer'
let peer
const wsServer = window.location.origin + '/' + window.location.search
const socket = io(wsServer)

console.log(wsServer)

socket.on('connect', () => console.log('connect', socket))
socket.on('message', onMessage)

function onMessage(data) {
  console.log('data', data)

  if (data === 'ready') {
    if(peer) {
      peer.destroy()
    }
    peer = new Peer()
    peer.on('signal', function(signal) {
      socket.emit('message', JSON.stringify(signal))
    })
    peer.on('stream', function(stream) {
      const video = document.querySelector('#remoteVideos')
      video.src = window.URL.createObjectURL(stream)
      video.play()
    })
    peer.on('close', () => peer.destroy())
  } else {
    console.log('peer', peer)
    peer.signal(JSON.parse(data))
  }
}