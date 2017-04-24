import Phaser from 'phaser'
import Follower from '../Sprites/Follower'
import Hero from '../Sprites/Hero'
import Client from '../Client'

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
    this.game.load.tilemap('Terrain', 'assets/lpc/game.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('Terrain', 'assets/lpc/terrain_atlas.png');
    this.game.load.atlasJSONHash('MaleHero', 'assets/lpc/male_hero.png', 'assets/lpc/hero_atlas.json');
    this.game.load.atlasJSONHash('FemaleHero', 'assets/lpc/female_hero.png', 'assets/lpc/hero_atlas.json');
    this.game.load.atlasJSONHash('SkeletonHero', 'assets/lpc/skeleton_hero.png', 'assets/lpc/hero_atlas.json');
  }

  /**
   *
   */
  initClient() {
    this.game.stage.disableVisibilityChange = true;
    this.game.client = new Client(this);
    this.game.playerMap = {};

    this.ground.events.onInputUp.add((layer, pointer) => {
      this.game.client.sendClick(pointer.worldX, pointer.worldY);
    }, this);

    this.game.client.askNewPlayer();
  }

  /**
   *
   */
  create() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
   this. game.physics.arcade.gravity.y = 0;
    this.numberOfFollowers = 10;
    this.bounds = {width: 5000, height: this.game.height};
    this.game.world.setBounds(0, 0, this.bounds.width, this.bounds.height);
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    this.map = this.add.tilemap('Terrain', 32, 32, 100, 20);
    this.map.addTilesetImage('Terrain', 'Terrain');
    this.background = this.map.createLayer('Background');
    this.ground = this.map.createLayer('Ground');
    this.ground.inputEnabled = true;
    this.ground.resizeWorld();

    this.initClient();
    // this.followers();
  }

  /**
   *
   */
  update() {
    if (this.cursors.up.isDown) {
      this.game.client.sendUpdate('Up');
    } else if (this.cursors.down.isDown) {
      this.game.client.sendUpdate('Down');
    } else if (this.cursors.left.isDown) {
      this.game.client.sendUpdate('Left');
    } else if (this.cursors.right.isDown) {
      this.game.client.sendUpdate('Right');
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
      return true;
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

  checkBeforeFiring(pointer) {
    this.line.start.set(this.player.x, this.player.y);
    this.line.end.set(pointer.worldX, pointer.worldY);
    this.tileHits = this.layer.getRayCastTiles(this.line, 4, false, true);
    console.log(this.tileHits.length);
    if (this.tileHits.length > 0) {
      //  Just so we can visually see the tiles
      for (let i = 0; i < this.tileHits.length; i++) {
        this.tileHits[i].debug = true;
      }
      this.layer.dirty = true;

    } else {
      //if there is no obstacle, fire
      this.weapon.fire();
    }

  }

  /**
   *
   * @param {Object} player
   */
  addNewPlayer(player) {
    if (!this.game.playerMap[player.id]) {
      this.game.playerMap[player.id] = new Hero({game: this.game, player: player});
    }
    this.game.add.existing(this.game.playerMap[player.id]);

    this.game.playerMap[player.id].body.collideWorldBounds = true;
    // this.game.playerMap[player.id].body.setSize(32, 32, 5, 16);

    return this.game.playerMap[player.id];
  }

  /**
   *
   * @param {Object} player
   */
  updatePlayer(player) {
    let playerObj = this.game.playerMap[player.id],
      distance = Phaser.Math.distance(playerObj.x, playerObj.y, player.x, player.y);
    playerObj.animations.play('Walk' + player.direction);
    this.game.add.tween(playerObj.body).to({x: player.x, y: player.y}, distance * 10).start();
  }

  /**
   *
   * @param {Object} player
   */
  removePlayer(player) {
    this.game.playerMap[player.id].destroy();
    delete this.game.playerMap[player.id];
  }

}
