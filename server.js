'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const config = require('./config.json');

const PORT = process.env.PORT || 5600;

const app = express();
const server = require('http').createServer(app);
const io = socketIO(server)
const sockets = []

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, './public')));
app.get('/', function (req, res) {
  res.render('index');
});

server.listen(PORT, function () {
  console.log('[server] listening at port %d', PORT);
});

io.on('connection', function(socket) {
  sockets.push(socket)
  socket.on('message', onMessage)
  socket.on('close', function() {
    sockets.splice(sockets.indexOf(socket), 1)
  })

  function onMessage(data) {
    sockets
      .filter(s => s !== socket)
      .forEach(socket => socket.emit('message', data))
  }

  if (sockets.length === 2) {
    sockets.forEach(socket => socket.emit('message', 'ready'))
  }
})