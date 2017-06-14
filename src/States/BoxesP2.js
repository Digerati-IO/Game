import Phaser from 'phaser'

export default class extends Phaser.State {

  /**
   *
   */
  init() {

  }

  /**
   *
   */
  preload() {
    this.game.load.image('atari', 'assets/BoxesP2/block.png');
    this.game.load.image('background', 'assets/BoxesP2/background2.png');
    this.game.load.spritesheet('dude', 'assets/BoxesP2/dude.png', 32, 48);

  }

  /**
   *
   */
  create() {
    this.sprite = {};
    this.facing = 'left';
    this.jumpTimer = 0;
    this.yAxis = p2.vec2.fromValues(0, 1);

    this.bg = this.game.add.tileSprite(0, 0, 800, 600, 'background');

    //  Enable p2 physics
    this.game.physics.startSystem(Phaser.Physics.P2JS);

    this.game.physics.p2.gravity.y = 350;
    this.game.physics.p2.world.defaultContactMaterial.friction = 0.3;
    this.game.physics.p2.world.setGlobalStiffness(1e5);

    //  Add a sprite
    this.player = this.game.add.sprite(200, 200, 'dude');
    this.player.animations.add('left', [0, 1, 2, 3], 10, true);
    this.player.animations.add('turn', [4], 20, true);
    this.player.animations.add('right', [5, 6, 7, 8], 10, true);

    //  Enable if for physics. This creates a default rectangular body.
    this.game.physics.p2.enable(this.player);

    this.player.body.fixedRotation = true;
    this.player.body.damping = 0.5;

    this.spriteMaterial = game.physics.p2.createMaterial('spriteMaterial', this.player.body);
    this.worldMaterial = game.physics.p2.createMaterial('worldMaterial');
    this.boxMaterial = game.physics.p2.createMaterial('worldMaterial');

    //  4 trues = the 4 faces of the world in left, right, top, bottom order
    this.game.physics.p2.setWorldMaterial(this.worldMaterial, true, true, true, true);

    //  A stack of boxes - you'll stick to these
    for (var i = 1; i < 4; i++) {
      var box = this.game.add.sprite(300, 645 - (95 * i), 'atari');
      this.game.physics.p2.enable(box);
      box.body.mass = 6;
      // this.box.body.static = true;
      box.body.setMaterial(this.boxMaterial);
    }

    //  Here is the contact material. It's a combination of 2 materials, so whenever shapes with
    //  those 2 materials collide it uses the following settings.

    this.groundPlayerCM = this.game.physics.p2.createContactMaterial(this.spriteMaterial, this.worldMaterial, {friction: 0.0});
    this.groundBoxesCM = this.game.physics.p2.createContactMaterial(this.worldMaterial, this.boxMaterial, {friction: 0.6});

    //  Here are some more options you can set:

    // this.contactMaterial.friction = 0.0;     // Friction to use in the contact of these two materials.
    // this.contactMaterial.restitution = 0.0;  // Restitution (i.e. how bouncy it is!) to use in the contact of these two materials.
    // this.contactMaterial.stiffness = 1e3;    // Stiffness of the resulting ContactEquation that this ContactMaterial generate.
    // this.contactMaterial.relaxation = 0;     // Relaxation of the resulting ContactEquation that this ContactMaterial generate.
    // this.contactMaterial.frictionStiffness = 1e7;    // Stiffness of the resulting FrictionEquation that this ContactMaterial generate.
    // this.contactMaterial.frictionRelaxation = 3;     // Relaxation of the resulting FrictionEquation that this ContactMaterial generate.
    // this.contactMaterial.surfaceVelocity = 0.0;        // Will add surface velocity to this material. If bodyA rests on top if bodyB, and the surface velocity is positive, bodyA will slide to the right.

    this.text = this.game.add.text(20, 20, 'move with arrow, space to jump', {fill: '#ffffff'});

    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.body.moveLeft(200);

      if (this.facing !== 'left') {
        this.player.animations.play('left');
        this.facing = 'left';
      }
    } else if (this.cursors.right.isDown) {
      this.player.body.moveRight(200);

      if (this.facing !== 'right') {
        this.player.animations.play('right');
        this.facing = 'right';
      }
    } else {
      this.player.body.velocity.x = 0;

      if (this.facing !== 'idle') {
        this.player.animations.stop();

        if (this.facing === 'left') {
          this.player.frame = 0;
        } else {
          this.player.frame = 5;
        }

        this.facing = 'idle';
      }
    }

    if (this.jumpButton.isDown && this.game.time.now > this.jumpTimer && this.checkIfCanJump()) {
      this.player.body.moveUp(300);
      this.jumpTimer = this.game.time.now + 750;
    }

  }

  checkIfCanJump() {
    let result = false;

    for (let i = 0; i < this.game.physics.p2.world.narrowphase.contactEquations.length; i++) {
      let c = this.game.physics.p2.world.narrowphase.contactEquations[i];
      if (c.bodyA === this.player.body.data || c.bodyB === this.player.body.data) {
        let d = p2.vec2.dot(c.normalA, this.yAxis);
        if (c.bodyA === this.player.body.data) {
          d *= -1;
        }
        if (d > 0.5) {
          result = true;
        }
      }
    }

    return result;

  }
}