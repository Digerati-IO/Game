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
    //
    // this.events.onDragStart.add((sprite, pointer) => {
    //   sprite.body.velocity.setTo(0, 0);
    //   sprite.oldX = pointer.worldX;
    //   sprite.oldY = pointer.worldY;
    // });
    //
    // this.events.onDragUpdate.add((sprite, pointer, dragX, dragY, snapPoint) => {
    //   sprite.game.physics.arcade.moveToPointer(sprite, 60, pointer, 500);
    // });
    //
    // this.events.onDragStop.add((sprite, pointer) => {
    //   sprite.body.velocity.setTo((sprite.oldX - sprite.x) * 3, (sprite.oldY - sprite.y) * 3);
    // });

  }

  /**
   *
   */
  update() {
    // this.rotation = this.game.physics.arcade.angleBetween(this, this.game.input.activePointer);
  }

}
