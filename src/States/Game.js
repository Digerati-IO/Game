import Phaser from 'phaser'
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
    this.game.load.atlasJSONHash('SkeletonHero', 'assets/lpc/skeleton.png', 'assets/lpc/hero_atlas.json');

    this.game.load.atlasJSONHash('MaleHero', 'assets/lpc/tanned_male.png', 'assets/lpc/hero_atlas.json');
    this.game.load.atlasJSONHash('MaleHair', 'assets/lpc/hair/male/bedhead/blonde2.png', 'assets/lpc/hero_atlas.json');
    this.game.load.atlasJSONHash('MaleShirt', 'assets/lpc/torso/shirts/longsleeve/male/white_longsleeve.png', 'assets/lpc/hero_atlas.json');
    this.game.load.atlasJSONHash('MalePants', 'assets/lpc/legs/pants/male/teal_pants_male.png', 'assets/lpc/hero_atlas.json');
    this.game.load.atlasJSONHash('MaleShoes', 'assets/lpc/feet/shoes/male/brown_shoes_male.png', 'assets/lpc/hero_atlas.json');

    this.game.load.atlasJSONHash('FemaleHero', 'assets/lpc/tanned_female.png', 'assets/lpc/hero_atlas.json');
    this.game.load.atlasJSONHash('FemaleHair', 'assets/lpc/hair/female/long/blonde2.png', 'assets/lpc/hero_atlas.json');
    this.game.load.atlasJSONHash('FemaleShirt', 'assets/lpc/torso/corset_female/corset_black.png', 'assets/lpc/hero_atlas.json');
    this.game.load.atlasJSONHash('FemalePants', 'assets/lpc/legs/pants/female/teal_pants_female.png', 'assets/lpc/hero_atlas.json');
    this.game.load.atlasJSONHash('FemaleShoes', 'assets/lpc/feet/slippers_female/brown.png', 'assets/lpc/hero_atlas.json');
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
    this.game.world.setBounds(-2048, -2048, 4096, 4096);
    this.worldGroup = this.game.add.group();
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    this.map = this.add.tilemap('Terrain', 32, 32, 100, 100);
    this.map.addTilesetImage('Terrain', 'Terrain');
    this.background = this.map.createLayer('Background');
    this.ground = this.map.createLayer('Ground');
    this.ground.inputEnabled = true;
    this.ground.resizeWorld();
    this.worldGroup.add(this.background);
    this.worldGroup.add(this.ground);

    this.initClient();
  }

  /**
   *
   */
  update() {
    if (this.cursors.up.isDown) {
      this.game.client.sendUpdate('Up', this.cursors.up.shiftKey);
    } else if (this.cursors.down.isDown) {
      this.game.client.sendUpdate('Down', this.cursors.down.shiftKey);
    } else if (this.cursors.left.isDown) {
      this.game.client.sendUpdate('Left', this.cursors.left.shiftKey);
    } else if (this.cursors.right.isDown) {
      this.game.client.sendUpdate('Right', this.cursors.right.shiftKey);
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

  /**
   *
   * @param {Object} player
   */
  addNewPlayer(player) {
    let playerObj = new Hero({game: this.game, player: player});
    this.worldGroup.add(playerObj.group);

    return playerObj;
  }

  /**
   *
   * @param {Object} player
   * @param {boolean} shift
   */
  updatePlayer(player, shift) {
    let playerObj = this.game.playerMap[player.id];
    switch (player.direction) {
      case 'Left':
        if (shift) {
          playerObj.group.rotation -= 0.05;
        } else {
          playerObj.group.position.x -= 4 * Math.cos(playerObj.group.rotation);
          playerObj.group.position.y -= 4 * Math.sin(playerObj.group.rotation);
        }
        break;
      case 'Right':
        if (shift) {
          playerObj.group.rotation += 0.05;
        } else {
          playerObj.group.position.x += 4 * Math.cos(playerObj.group.rotation);
          playerObj.group.position.y += 4 * Math.sin(playerObj.group.rotation);
        }
        break;
      case 'Up':
        playerObj.group.position.y -= 4 * Math.cos(playerObj.group.rotation);
        playerObj.group.position.x += 4 * Math.sin(playerObj.group.rotation);
        break;
      case 'Down':
        playerObj.group.position.y += 4 * Math.cos(playerObj.group.rotation);
        playerObj.group.position.x -= 4 * Math.sin(playerObj.group.rotation);
        break;
    }
    playerObj.group.rotation += this.game.input.activePointer.movementX * 0.01;
    playerObj.group.callAll('animations.play', 'animations', 'Walk' + player.direction, 9, true);

    this.game.input.activePointer.resetMovement();

    this.worldGroup.rotation = -1 * playerObj.group.rotation;
    this.worldGroup.rotation = -1 * playerObj.group.rotation;
    this.worldGroup.pivot.x = playerObj.group.position.x;
    this.worldGroup.pivot.y = playerObj.group.position.y;
    this.worldGroup.x = this.worldGroup.pivot.x;
    this.worldGroup.y = this.worldGroup.pivot.y;
    this.game.camera.focusOnXY(playerObj.group.position.x, playerObj.group.position.y + playerObj.torso.height - this.camera.view.halfHeight);
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
