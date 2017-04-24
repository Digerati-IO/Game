var express = require('express'),
  app = express(),
  server = require('http').Server(app),
  io = require('socket.io').listen(server),
  heroes = ['Male','Female', 'Skeleton'];

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
      asset: heroes[Math.floor(Math.random() * (3 - 0) + 0)] + 'Hero',
      direction: 'Right',
      moving: false,
      id: server.lastPlayerID++,
      x: randomInt(200, 500),
      y: randomInt(200, 500)
    };
    socket.broadcast.emit('newplayer', socket.player);
    socket.emit('allplayers', getAllPlayers());
  });

  socket.on('click', function (data) {
    socket.player.x = data.x;
    socket.player.y = data.y;
    socket.player.moving = true;
    io.emit('update', socket.player);
  });

  socket.on('update', function (direction) {
    socket.player.direction = direction;
    socket.player.moving = true;
    switch(socket.player.direction) {
      case 'Left':
        socket.player.x -=5;
        break;
      case 'Right':
        socket.player.x += 5;
        break;
      case 'Up':
        socket.player.y -= 5;
        break;
      case 'Down':
        socket.player.y += 5;
        break;
    }
    io.emit('update', socket.player);
  });

  socket.on('disconnect', function () {
    io.emit('remove', socket.player);
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
