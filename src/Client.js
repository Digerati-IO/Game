export default class Client {

  /**
   * @param {Phaser.State} state
   */
  constructor(state) {
    this.socket = io.connect(); // By default to localhost?
    this.state = state;

    this.socket.on('newplayer', (data) => {
      this.state.addNewPlayer(data);
    });

    this.socket.on('allplayers', (data) => {
      for (let i = 0; i < data.length; i++) {
        this.state.addNewPlayer(data[i]);
      }
    });

    this.socket.on('update', (data) => {
      this.state.updatePlayer(data);
    });

    this.socket.on('remove', (data) => {
      this.state.removePlayer(data);
    });
  }

  update() {
    if (this.game.player.speed > 0) {
      this.isActive = true;
      this.socket.emit('newPlayerPosition', {
        x: this.game.player.sprite.x,
        y: this.game.player.sprite.y,
        angle: this.game.player.sprite.angle,
        speed: this.game.player.speed
      });
    } else if (this.isActive === true) {
      this.isActive = false;
      this.socket.emit('newPlayerPosition', {
        x: this.game.player.sprite.x,
        y: this.game.player.sprite.y,
        angle: this.game.player.sprite.angle,
        speed: this.game.player.speed
      });
    }
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

  /**
   *
   * @param {string} direction
   */
  sendUpdate(direction) {
    this.socket.emit('update', direction);
  }

}