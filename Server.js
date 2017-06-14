var express = require('express'),
  app = express(),
  server = require('http').Server(app),
  io = require('socket.io').listen(server),
  heroes = ['Male','Female', 'Skeleton'];

app.use('/css', express.static(__dirname + '/css'));
app.use('/dist', express.static(__dirname + '/dist'));
app.use('/src', express.static(__dirname + '/src'));
app.use('/assets', express.static(__dirname + '/assets'));
app.use('/test', express.static(__dirname + '/test'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/test', function (req, res) {
  res.sendFile(__dirname + '/test/index.html');
});

server.lastPlayerID = 0;
server.playersList = [];

server.listen(process.env.PORT || 3000, function () {
  console.log('Listening on ' + server.address().port);
});

/** *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *
 *  *   *   * Some useful stuff you can do with Socket.io   *   *   *   *
 *  *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *
 *
 *  socket.on('event_name', function(optionalData){ ... );  - Adds an event listener to this socket.
 *  io.emit('event_name', optionalData);                    - Sends an event to all sockets.
 *  socket.emit('event_name', optionalData);                - Sends an event to this socket.
 *  socket.broadcast.emit('event_name', optionalData);      - Sends an event to all sockets except this one.
 *  io.in('room-name').emit('event_name', optionalData);    - Sends an event to all sockets that are in the specified room.
 *  socket.join('room-name');                               - Adds a socket to a room.
 *  socket.leave('room-name');                              - Removes a socket from a room.
*/

// A 'socket' it just an object that manages a client's connection to the server. For each client that connects to
// this server, they will get their own socket object. These socket objects are stored internally on the io object,
// and can be accessed manually with 'io.sockets' to get a list of the connected sockets, but you shouldn't really need to.

// The first time a connection is made with a new socket (a client), the 'connection' event is triggered
// on io (the Socket.io server object), and it runs the 'connection' callback function (the 'function(socket){ ... }' part).
// The socket object for the client that connected is sent to the callback, and this allows us to do stuff with that
// socket, such as adding event listeners to that socket, which is what is done below.
//
io.on('connection', function (socket) {

  console.log("* * * A new connection has been made.");
  // Each socket object (one for each connected client) has an 'id' property,
  // which can be used to uniquely identify each socket connection.
  // Check the command line that was used to start the server to see
  // the id of each socket that connects being printed.
  console.log("* ID of new socket object: " + socket.id);

  // Using the socket object that was passed in, events can be sent to the
  // client that socket belongs to using .emit(...)
  // The socket object on the client (see Boot.js in /client/js) should have event
  // listeners of the event name that you are sending to it, or it won't pick them up.

  // So if the server emits 'super_event', then the client must also be listening
  // for 'super_event', and vice versa for when the client sends events to the server.


  socket.on('newplayer', function () {
    let sex = heroes[Math.floor(Math.random() * (3 - 0) + 0)];
    socket.player = {
      sex: sex,
      asset: sex + 'Hero',
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

  socket.on('update', function (direction, shift) {
    socket.player.direction = direction;
    socket.player.moving = true;
    io.emit('update', socket.player, shift);
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
