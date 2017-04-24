import Phaser from 'phaser'

/*
 Animation sequence information:
 Bow animation:
 1-9 Raise bow and aim
 10 Loose arrow
 11-13 Grab new arrow
 5-9 Aim new arrow
 10 Loose new arrow

 Thrust animation:
 1-4 Raise staff
 5-8 Thrust loop.

 Skeleton (and male) walk animation:
 1 Stand/idle
 2-9 Walkcycle

 Sprite order information:
 The best order to place sprites in top to bottom is visible in the xcf files:
 1. WEAPON
 2. HANDS
 3. HEAD
 4. BELT
 5. TORSO
 6. LEGS
 7. FEET
 8. BODY
 9. BEHIND
 */

export default class extends Phaser.Sprite {



  /**
   *
   * @param {Phaser.Game} game
   * @param {Object} player
   */
  constructor({game, player}) {
    super(game, player.x, player.y, player.asset);
    this.anchor.setTo(0.5);
    this.id = player.id;

    this.text = this.game.add.text(0, 0, this.id, {
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


    this.animations.add('CastRight', Phaser.Animation.generateFrameNames('CastRight', 2, 7), 10, true);
    this.animations.add('CastLeft', Phaser.Animation.generateFrameNames('CastLeft', 2, 7), 10, true);
    this.animations.add('CastUp', Phaser.Animation.generateFrameNames('CastUp', 2, 7), 10, true);
    this.animations.add('CastDown', Phaser.Animation.generateFrameNames('CastDown', 2, 7), 10, true);

    this.animations.add('ThrustRight', Phaser.Animation.generateFrameNames('ThrustRight', 2, 7), 10, true);
    this.animations.add('ThrustLeft', Phaser.Animation.generateFrameNames('ThrustLeft', 2, 7), 10, true);
    this.animations.add('ThrustUp', Phaser.Animation.generateFrameNames('ThrustUp', 2, 7), 10, true);
    this.animations.add('ThrustDown', Phaser.Animation.generateFrameNames('ThrustDown', 2, 7), 10, true);

    this.animations.add('IdleRight', ['WalkRight1'], 10, true);
    this.animations.add('WalkRight', Phaser.Animation.generateFrameNames('WalkRight', 2, 9), 10, true);
    this.animations.add('IdleLeft', ['WalkLeft1'], 10, true);
    this.animations.add('WalkLeft', Phaser.Animation.generateFrameNames('WalkLeft', 2, 9), 10, true);
    this.animations.add('IdleUp', ['WalkUp1'], 10, true);
    this.animations.add('WalkUp', Phaser.Animation.generateFrameNames('WalkUp', 2, 9), 10, true);
    this.animations.add('IdleDown', ['WalkDown1'], 10, true);
    this.animations.add('WalkDown', Phaser.Animation.generateFrameNames('WalkDown', 2, 9), 10, true);

    this.animations.add('SlashRight', Phaser.Animation.generateFrameNames('SlashRight', 2, 9), 10, true);
    this.animations.add('SlashLeft', Phaser.Animation.generateFrameNames('SlashLeft', 2, 9), 10, true);
    this.animations.add('SlashUp', Phaser.Animation.generateFrameNames('SlashUp', 2, 9), 10, true);
    this.animations.add('SlashDown', Phaser.Animation.generateFrameNames('SlashDown', 2, 9), 10, true);

    this.game.camera.follow(this);
    this.game.physics.enable(this, Phaser.Physics.ARCADE);

    this.setupEvents();
  }

  /**
   *
   */
  setupEvents() {
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
