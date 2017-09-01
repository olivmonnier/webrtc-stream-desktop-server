
const io = require('socket.io-client');

let serverConnection;
let peerConnection;
let uuid;
let remoteVideo;

const getQueryStringValue = require('./getQueryStringValue');
const generateUuid = require('../../utils/uuid');
const iceServers = require('../../utils/iceServersAdress');
const setMediaBitrates = require('../../utils/limitBandwidth');
const { createAnswer, createOffer, iceCandidate } = require('../../utils/peerConnection');

const peerConnectionConfig = {
  'iceServers': iceServers
};

pageReady(); 

window.onbeforeunload = function () {
  if (peerConnection) peerConnection.close();
  if (serverConnection) serverConnection.close();
}

function pageReady() {
  const room = getQueryStringValue('room');

  uuid = generateUuid(); 
  remoteVideo = document.getElementById('remoteVideo');

  if (room) {
    serverConnection = io.connect(window.location.protocol + "//" + window.location.host, { 
      query: { room }
    });
    serverConnection.on('message', onMessageFromServer);
  }
}

function start() {
  peerConnection = new RTCPeerConnection(peerConnectionConfig);
  peerConnection.onaddstream = gotRemoteStream;
  peerConnection.onicecandidate = onIceCandidate;
}

function onIceCandidate(event) {
  iceCandidate(event, () => 
    serverConnection.emit('message', JSON.stringify({ 'ice': event.candidate, 'uuid': uuid }))
  )
}

function onMessageFromServer(message) {
  console.log('message', message)
  if (!peerConnection) start();

  const signal = JSON.parse(message);
  const signalState = peerConnection.signalingState;
  const iceState = peerConnection.iceConnectionState;

  // Ignore messages from ourself
  if (signal.uuid == uuid) return;

  if (signal.sdp && signalState !== 'have-remote-offer') {
    peerConnection.setRemoteDescription(signal.sdp).then(function () {
      // Only create answers in response to offers
      if (signal.sdp.type == 'offer') {
        console.log('offer')
        createAnswer(peerConnection, () => 
          serverConnection.emit('message', JSON.stringify({ 'sdp': peerConnection.localDescription, 'uuid': uuid }))
        )
      }
    }).catch(errorHandler);
  } else if (signal.ice && iceState !== 'completed') {
    peerConnection.addIceCandidate(new RTCIceCandidate(signal.ice)).catch(errorHandler);
  }
}

function gotRemoteStream(event) {
  console.log('got remote stream');
  remoteVideo.src = window.URL.createObjectURL(event.stream);
  remoteVideo.play();
}

function errorHandler(error) {
  console.log('error', error);
}