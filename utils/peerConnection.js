const setMediaBitrates = require('./limitBandwidth');

const offerOptions = {
  offerToReceiveAudio: 1,
  offerToReceiveVideo: 1
};

function createAnswer(pc, successSignal) {
  pc.createAnswer(offerOptions)
    .then((desc) => {
      onCreateOfferSuccess(pc, desc, successSignal)
    }).catch(errorHandler)
}

function createOffer(pc, successSignal, offerOptions) {
  pc.createOffer(offerOptions)
    .then((desc) => {
      onCreateOfferSuccess(pc, desc, successSignal)
    }).catch(errorHandler)
}

function onCreateOfferSuccess (pc, description, signal) {
  console.log('got description');

  pc.setLocalDescription(description).then(function () {
    pc.localDescription.sdp = setMediaBitrates(pc.localDescription.sdp);
    signal();
  }).catch(errorHandler);
}

function iceCandidate(event, cb) {
  console.log('ice')
  if (event.candidate) {
    console.log('candidate');
    cb()
  }
}

function errorHandler(error) {
  console.log(error);
}

module.exports = {
  createAnswer,
  createOffer,
  onCreateOfferSuccess,
  iceCandidate
}