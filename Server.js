var express = require('express'),
  app = express(),
  server = require('http').Server(app),
  io = require('socket.io').listen(server);

app.use('/css', express.static(__dirname + '/css'));
app.use('/dist', express.static(__dirname + '/dist'));
app.use('/src', express.static(__dirname + '/src'));
app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

server.lastPlayerID = 0;
server.playersList = [];

server.listen(process.env.PORT || 3000, function () {
  console.log('Listening on ' + server.address().port);
});

io.on('connection', function (socket) {

  socket.on('newplayer', function () {
    socket.player = {
      id: server.lastPlayerID++,
      x: randomInt(100, 400),
      y: randomInt(100, 400)
    };
    socket.emit('allplayers', getAllPlayers());
    socket.broadcast.emit('newplayer', socket.player);
  });

  socket.on('click', function (data) {
    console.log('click to ' + data.x + ', ' + data.y);
    socket.player.x = data.x;
    socket.player.y = data.y;
    io.emit('move', socket.player);
  });

  socket.on('disconnect', function () {
    io.emit('remove', socket.player.id);
  });
});

/**
 *
 * @returns {Array}
 */
function getAllPlayers() {
  let players = [];
  Object.keys(io.sockets.connected).forEach(function (socketID) {
    let player = io.sockets.connected[socketID].player;
    if (player) {
      players.push(player);
    }
  });

  return players;
}

/**
 *
 * @param low
 * @param high
 * @returns {number}
 */
function randomInt(low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}
