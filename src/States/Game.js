import Phaser from 'phaser'
import Follower from '../Sprites/Follower'
import Hero from '../Sprites/Hero'

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
    // this.load.image('background', 'assets/images/starfield.jpg');
    this.load.atlasJSONHash('hero', 'assets/lpc/hero_sheet.png', 'assets/lpc/hero_atlas.json');
  }

  /**
   *
   */
  create() {
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.p2.gravity.y = 0;
    this.numberOfFollowers = 10;
    this.bounds = {width: 5000, height: this.game.height};

    this.game.world.setBounds(0, 0, this.bounds.width, this.bounds.height);
    // this.game.add.tileSprite(0, 0, this.bounds.width, this.game.height, 'background');
    this.player = new Hero({id: 0, game: this.game, x: 100, y: 100, asset: 'hero'});

    this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_TOPDOWN);
    this.game.physics.p2.setBoundsToWorld(true, true, true, true, false);

    this.cursors = this.game.input.keyboard.createCursorKeys();

    this.player.animations.play('walkLeft');
    // this.followers();
  }

  /**
   *
   */
  update() {

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
      // this.game.debug.spriteInfo(this.player, 32, 32);
      // this.game.debug.bodyInfo(this.player, 32, 32);
    }
  }
}
