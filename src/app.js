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

  const { state, signal } = JSON.parse(data)

  if (state === 'ready') {
    if(peer) {
      peer.destroy()
    }
    peer = new Peer()
    handlerPeer(peer, socket)
  } 
  else if (state === 'connect') {
    peer.signal(signal)
  } 
  else if (state === 'renew') {
    peer = new Peer()
    handlerPeer(peer, socket)
    peer.signal(signal)
  }
}

function handlerPeer(peer, socket) {
  peer.on('signal', function (signal) {
    socket.emit('message', JSON.stringify({
      state: 'connect',
      signal
    }))
  })
  peer.on('stream', function (stream) {
    const video = document.querySelector('#remoteVideos')
    video.src = window.URL.createObjectURL(stream)
    video.play()
  })
  peer.on('close', () => peer.destroy())
}