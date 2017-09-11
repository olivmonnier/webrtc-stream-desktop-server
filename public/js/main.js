
const io = require('socket.io-client');
const getQueryStringValue = require('./getQueryStringValue');
const SimpleWebRTC = require('simplewebrtc');
const webrtc = new SimpleWebRTC({
  url: window.location.protocol + "//" + window.location.host,
  socketio: io,
  debug: true,
  remoteVideosEl: 'remoteVideos'
});
const room = getQueryStringValue('room');

webrtc.on('connectionReady', function() {
  webrtc.joinRoom(room)
});