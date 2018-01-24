'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const config = require('./config.json');

const PORT = process.env.PORT || 5600;

const app = express();
const server = require('http').createServer(app);
const io = socketIO.listen(server)

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, './public')));
app.get('/', function (req, res) {
  res.render('index');
});

server.listen(PORT, function () {
  console.log('[server] listening at port %d', PORT);
});

io.sockets.on('connection', function(socket) {
  let token = socket.handshake.query.token || socket.id

  socket.join(token)

  socket.on('message', (data) => {
    socket.broadcast.to(token).emit('message', data)
  })
  socket.on('disconnect', function() {
    socket.leave(token)
  })

  io.of(token).clients((error, clients) => {
    if (error) throw error
    if (clients.length >= 2) {
      io.of(token).emit('message', 'ready')
    }
  })
})