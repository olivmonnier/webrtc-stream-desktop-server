'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const sockets = require('signal-master/sockets');
const config = require('./config.json');

const PORT = process.env.PORT || 5600;

const app = express();
const server = require('http').createServer(app);

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, './public')));
app.get('/', function (req, res) {
  res.render('index');
});

server.listen(PORT, function () {
  console.log('[server] listening at port %d', PORT);
});

sockets(server, config);