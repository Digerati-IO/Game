
import Phaser from 'phaser'

export default class extends Phaser.Sprite {

  /**
   *
   * @param game
   * @param x
   * @param y
   * @param asset
   */
  constructor({game, x, y, asset}) {
    super(game, x, y, asset);
    this.anchor.setTo(0.5);

    // this.inputEnabled = true;
    // this.input.start(0, true);
    // this.input.enableDrag();
  }

  /**
   *
   */
  update() {
    // this.rotation = this.game.physics.arcade.angleBetween(this, this.game.input.activePointer);
  }

}
