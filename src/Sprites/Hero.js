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
    this.anchor.setTo(0.5);
    this.id = id;

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

    this.cursors = this.game.input.keyboard.createCursorKeys();

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

    this.walkRight = Phaser.Animation.generateFrameNames('walkRight', 1, 9);
    this.walkLeft = Phaser.Animation.generateFrameNames('walkLeft', 1, 9);
    this.animations.add('walkRight', this.walkRight, 10, true);
    this.animations.add('walkLeft', this.walkLeft, 10, true);

    this.game.add.existing(this);
    this.game.physics.p2.enable(this);

  }

  /**
   *
   */
  update() {

  }

}
