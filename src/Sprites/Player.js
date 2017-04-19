import Phaser from 'phaser'

export default class extends Phaser.Sprite {

  /**
   *
   * @param {number} id
   * @param {Phaser.Game} game
   * @param {number} x
   * @param {number} y
   * @param asset
   */
  constructor({id, game, x, y, asset}) {
    super(game, x, y, asset);
    this.id = id;
    this.game.physics.p2.enable(this);
    this.body.maxAngular = 500;
    this.body.angularDrag = 50;

    this.anchor.setTo(0.5);
    this.anchor.set(0.5);
    this.text = this.game.add.text(0, 0, id, {
      font: "16px Arial",
      fill: "#000000",
      wordWrap: true,
      wordWrapWidth: this.width,
      align: "center",
      backgroundColor: "#ffffff"
    });
    this.text.anchor.set(2, 2);
    this.text.visible = false;
    this.addChild(this.text);

    this.inputEnabled = true;
    this.input.start(0, true);
    this.input.enableDrag();
    this.cursors = this.game.input.keyboard.createCursorKeys();

    this.events.onDragStart.add((sprite, pointer) => {
      console.log('Drag start pointerX:' + pointer.worldX + ' pointerY:' + pointer.worldY);
    });

    this.events.onDragUpdate.add((sprite, pointer, dragX, dragY, snapPoint) => {
      console.log('Drag update dragX:' + dragX + ' dragY:' + dragY + ' snapPoint:' + snapPoint);
    });

    this.events.onDragStop.add((sprite, pointer) => {
      console.log('Drag end x:' + sprite.x + ' y:' + sprite.y);
      this.game.client.sendClick(pointer.worldX, pointer.worldY);
    });

    this.events.onInputDown.add((sprite, pointer) => {
      console.log('Input down x:' + sprite.x + ' y:' + sprite.y);
    });

    this.events.onInputUp.add((sprite, pointer) => {
      console.log('Input up x:' + sprite.x + ' y:' + sprite.y);
    });

    this.events.onInputOver.add((sprite, pointer) => {
      console.log('Input over x:' + sprite.x + ' y:' + sprite.y);
      // this.text.bringToTop();
      this.text.visible = true;
    });

    this.events.onInputOut.add((sprite, pointer) => {
      console.log('Input out x:' + sprite.x + ' y:' + sprite.y);
      // this.text.sendToBack();
      this.text.visible = false;
    });

  }

  /**
   *
   */
  update() {

  }

}
