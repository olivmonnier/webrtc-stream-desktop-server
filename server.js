'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 5600;

const app = express();
const server = require('http').createServer(app);

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, './public')));
app.get('/', function (req, res) {
  res.render('index');
});

const io = socketIO(server);

server.listen(PORT, function () {
  console.log('[server] listening at port %d', PORT);
});

io.on('connection', (socket) => {
  const params = socket.handshake.query;

  if(params.room) {
    socket.join(params.room);
    socket.broadcast.to(params.room).emit('newUser');
  } else {
    socket.join(socket.id);
    socket.to(socket.id).emit('message', 'Room: ' + socket.id + ' created')
  }

  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));

  socket.on('message', (message) => {
    socket.broadcast.to(params.room || socket.id).emit('message', message);
  });
});