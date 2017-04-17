export default class Client {

  /**
   * @param {Phaser.State} state
   */
  constructor(state) {
    this.socket = io.connect(); // By default to localhost?
    this.state = state;

    this.socket.on('newplayer', (data) => {
      this.state.addNewPlayer(data.id, data.x, data.y);
    });

    this.socket.on('allplayers', (data) => {
      for (let i = 0; i < data.length; i++) {
        let player = this.state.addNewPlayer(data[i].id, data[i].x, data[i].y);
        this.state.game.camera.follow(player);
      }
    });

    this.socket.on('move', (data) => {
      this.state.movePlayer(data.id, data.x, data.y);
    });

    this.socket.on('remove', (id) => {
      this.state.removePlayer(id);
    });
  }

  /**
   *
   */
  sendTest() {
    console.log("test sent");
    this.socket.emit('test');
  }

  /**
   *
   */
  askNewPlayer() {
    this.socket.emit('newplayer');
  }

  /**
   *
   * @param {number} x
   * @param {number} y
   */
  sendClick(x, y) {
    this.socket.emit('click', {x: x, y: y});
  }

}