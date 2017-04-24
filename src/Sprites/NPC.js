import Phaser from 'phaser'

export default class extends Phaser.Sprite {

  /**
   *
   * @param game
   * @param x
   * @param y
   * @param asset
   */
  constructor({id, game, x, y, asset}) {
    super(game, x, y, asset);
    this.anchor.setTo(0.5);
    this.id = id;

  }

  /**
   *
   */
  update() {

  }

}
