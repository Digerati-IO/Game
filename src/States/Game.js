import Phaser from 'phaser'
import Mushroom from '../Sprites/Mushroom'
import Follower from '../Sprites/Follower'
import Veggie from '../Sprites/Veggie'

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
    // load your assets
    this.load.image('mushroom', 'assets/images/mushroom2.png');
    this.load.spritesheet('veggies', 'assets/sprites/fruitnveg32wh37.png', 32, 32);
    this.load.image('background', 'assets/images/starfield.jpg');
    // this.load.tilemap('map', 'assets/maps/treasureHunter.json', null, Phaser.Tilemap.TILED_JSON);
  }

  /**
   *
   */
  create() {
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.p2.gravity.y = 200;
    this.numberOfFollowers = 10;
    this.bounds = {width: 5000, height: this.game.height};

    this.game.world.setBounds(0, 0, this.bounds.width, this.bounds.height);
    this.game.add.tileSprite(0, 0, this.bounds.width, this.game.height, 'background');


    this.mushroom = new Mushroom({game: this, x: 100, y: 100, asset: 'mushroom'});
    this.veggie = new Mushroom({game: this, x: 150, y: 150, asset: 'mushroom'});
    this.veggie.tint = Math.random() * 0xffffff;

    this.game.add.existing(this.mushroom);
    this.game.add.existing(this.veggie);
    this.game.physics.p2.enable(this.mushroom);
    this.game.physics.p2.enable(this.veggie);
    this.game.physics.p2.setBoundsToWorld(true, true, true, true, false);

    //  So they don't collide with each other
    // this.mushroom.body.clearCollision(true, true);
    // this.veggie.body.clearCollision(true, true);

    this.game.physics.p2.createRevoluteConstraint(this.veggie, [ 50, 100 ], this.mushroom, [ 0, 0 ]);

    this.game.camera.follow(this.mushroom, Phaser.Camera.FOLLOW_TOPDOWN);

    // function hitMush(player, enemy) {
    //     enemy.sprite.alpha -= 0.1;
    // }

    // this.mushroom.body.createBodyCallback(this.mushroom, hitMush, this);
    // this.game.physics.p2.setImpactEvents(true);

    // this.group = this.game.add.physicsGroup(Phaser.Physics.P2JS);
    // for (let i = 0; i < 100; i++) {
    //   let c = this.group.create(this.game.rnd.between(100, this.bounds.width), this.game.rnd.between(0, this.game.height), 'veggies', this.game.rnd.between(0, 35));
    //   this.game.physics.p2.enable(c, Phaser.Physics.P2JS);
    //   c.body.collideWorldBounds = true;
    // }
    // for (let i = 0; i < 20; i++) {
    //   let c = this.group.create(this.game.rnd.between(100, this.bounds.width), this.game.rnd.between(0, this.game.height), 'veggies', 17);
    //   this.game.physics.p2.enable(c, Phaser.Physics.P2JS);
    //   c.body.collideWorldBounds = true;
    // }

    this.cursors = this.game.input.keyboard.createCursorKeys();

    // this.followers();
  }

  /**
   *
   */
  update() {
    if (this.cursors.up.isDown) {
      this.mushroom.body.y -= 4;
    } else if (this.cursors.down.isDown) {
      this.mushroom.body.y += 4;
    }

    if (this.cursors.left.isDown) {
      this.mushroom.body.x -= 4;
      this.veggie.body.rotateLeft(50);
    } else if (this.cursors.right.isDown) {
      this.mushroom.body.x += 4;
      this.veggie.body.rotateRight(50);
    }

    /**
     * First collision action?
     *
     * @param player
     * @param veg
     * @returns {boolean}
     */
    function processHandler(player, veg) {
      return true;
    }

    /**
     * Second collision action?
     *
     * @param player
     * @param veg
     */
    function collisionHandler(player, veg) {
      if (veg.frame === 17) {
        veg.kill();
        player.body.applyImpulse(0, 100);
      }
    }
  }

  /**
   *
   */
  followers() {
    // Create 5 followers, each one following the one ahead of it
    // The first one will follow the mouse pointer
    for (let i = 0; i < this.numberOfFollowers; i++) {
      let f = this.game.add.existing(
        new Follower({
          game: this.game,
          x: this.game.width / 2 + i * 32,
          y: this.game.height / 2,
          asset: 'veggies',
          frame: this.game.rnd.between(0, 35),
          target: f || this.mushroom /* the previous follower or pointer */
        })
      );
    }

    // Create a target for the second group and
    // move it around the perimeter of the stage.
    let flag = this.game.add.sprite(32, 32, 'veggies', this.game.rnd.between(0, 35));
    this.game.add.tween(flag)
      .to({x: this.bounds.width - 50, y: 50}, 20000, Phaser.Easing.Sinusoidal.InOut)
      .to({x: this.bounds.width - 50, y: this.game.height - 50}, 12000, Phaser.Easing.Sinusoidal.InOut)
      .to({x: 50, y: this.game.height - 50}, 20000, Phaser.Easing.Sinusoidal.InOut)
      .to({x: 50, y: 50}, 12000, Phaser.Easing.Sinusoidal.InOut)
      .start()
      .loop();

    // Create 5 more followers, each one following the one ahead of it
    // The first one will follow the target
    for (let i = 0; i < this.numberOfFollowers; i++) {
      let f2 = this.game.add.existing(
        new Follower({
          game: this.game,
          x: this.game.width / 2 + i * 32,
          y: this.game.height / 2,
          asset: 'veggies',
          frame: this.game.rnd.between(0, 35),
          target: f2 || flag /* the previous follower or the flag */
        })
      );
    }
  }

  /**
   *
   */
  render() {
    if (__DEV__) {
      // this.game.debug.spriteInfo(this.mushroom, 32, 32);
      this.game.debug.bodyInfo(this.mushroom, 32, 32);
    }
  }
}
