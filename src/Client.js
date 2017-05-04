export default class Client {

  /**
   * @param {Game} game
   */
  constructor(game) {
    this.socket = io.connect();

    this.socket.on('newplayer', (player) => {
      game.addNewPlayer(player);
    });

    this.socket.on('allplayers', (player) => {
      for (let i = 0; i < player.length; i++) {
        game.addNewPlayer(player[i]);
      }
    });

    this.socket.on('update', (direction, shift) => {
      game.updatePlayer(direction, shift);
    });

    this.socket.on('remove', (player) => {
      game.removePlayer(player);
    });
  }

  update() {
    // if (this.game.player.speed > 0) {
    //   this.isActive = true;
    //   this.socket.emit('newPlayerPosition', {
    //     x: this.game.player.sprite.x,
    //     y: this.game.player.sprite.y,
    //     angle: this.game.player.sprite.angle,
    //     speed: this.game.player.speed
    //   });
    // } else if (this.isActive === true) {
    //   this.isActive = false;
    //   this.socket.emit('newPlayerPosition', {
    //     x: this.game.player.sprite.x,
    //     y: this.game.player.sprite.y,
    //     angle: this.game.player.sprite.angle,
    //     speed: this.game.player.speed
    //   });
    // }
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
   * @param {boolean} shift
   */
  sendUpdate(direction, shift) {
    this.socket.emit('update', direction, shift);
  }

}