import Phaser from 'phaser'
import Mushroom from '../Sprites/Mushroom'
import Follower from '../Sprites/Follower'
import Veggie from '../Sprites/Veggie'
import Client from '../Client'

export default class extends Phaser.State {

  /**
   *
   */
  init() {
    this.game.stage.disableVisibilityChange = true;
  }

  /**
   *
   */
  preload() {
    this.game.load.tilemap('map', 'assets/map/example_map.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.spritesheet('tileset', 'assets/map/tilesheet.png', 32, 32);
    this.game.load.image('sprite', 'assets/sprites/sprite.png');
    this.load.image('mushroom', 'assets/images/mushroom2.png');
    this.load.spritesheet('veggies', 'assets/sprites/fruitnveg32wh37.png', 32, 32);
  }

  /**
   *
   */
  create() {
    this.client = new Client(this);
    this.playerMap = {};
    this.testKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    this.testKey.onDown.add(this.client.sendTest, this);
    this.map = this.game.add.tilemap('map');
    this.map.addTilesetImage('tilesheet', 'tileset'); // tilesheet is the key of the tileset in map's JSON file
    for (let i = 0; i < this.map.layers.length; i++) {
      this.layer = this.map.createLayer(i);
    }
    this.layer.inputEnabled = true; // Allows clicking on the map ; it's enough to do it on the last layer
    this.layer.events.onInputUp.add(this.getCoordinates, this);
    this.client.askNewPlayer();

    this.mushroom = new Mushroom({game: this, x: 100, y: 100, asset: 'mushroom'});

    this.game.add.existing(this.mushroom);
  }

  /**
   *
   * @param {Phaser.TilemapLayer} layer
   * @param {Phaser.Pointer} pointer
   */
  getCoordinates(layer, pointer) {
    this.client.sendClick(pointer.worldX, pointer.worldY);
  }

  /**
   *
   * @param {number} id
   * @param {number} x
   * @param {number} y
   */
  addNewPlayer(id, x, y) {
    this.playerMap[id] = this.game.add.sprite(x, y, 'sprite');
  }

  /**
   *
   * @param {number} id
   * @param {number} x
   * @param {number} y
   */
  movePlayer(id, x, y) {
    let player = this.playerMap[id],
      distance = Phaser.Math.distance(player.x, player.y, x, y),
      tween = this.game.add.tween(player),
      duration = distance * 10;
    tween.to({x: x, y: y}, duration);
    tween.start();
  }

  /**
   *
   * @param {number} id
   */
  removePlayer(id) {
    this.playerMap[id].destroy();
    delete this.playerMap[id];
  }
}