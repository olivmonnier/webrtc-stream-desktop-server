import io from 'socket.io-client'
import Peer from 'simple-peer'
let peer
const socket = io(window.location.origin)

socket.on('message', onMessage)

function onMessage(data) {
  console.log('data', data)

  if (data === 'ready') {
    if(peer) return
    peer = new Peer()
    peer.on('signal', function(signal) {
      socket.emit('message', JSON.stringify(signal))
    })
  } else {
    peer.signal(JSON.parse(data))
  }
}