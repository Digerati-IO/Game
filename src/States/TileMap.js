import Phaser from 'phaser'
import Client from '../Client'

const terrainArr = [
  "dirt_01.png",
  "dirt_02.png",
  "dirt_03.png",
  "dirt_04.png",
  "dirt_05.png",
  "dirt_06.png",
  "dirt_07.png",
  "dirt_08.png",
  "dirt_09.png",
  "dirt_10.png",
  "dirt_11.png",
  "dirt_12.png",
  "dirt_13.png",
  "dirt_14.png",
  "dirt_15.png",
  "dirt_16.png",
  "dirt_17.png",
  "dirt_18.png",
  "dirt_19.png",
  "grass_01.png",
  "grass_02.png",
  "grass_03.png",
  "grass_04.png",
  "grass_05.png",
  "grass_06.png",
  "grass_07.png",
  "grass_08.png",
  "grass_09.png",
  "grass_10.png",
  "grass_11.png",
  "grass_12.png",
  "grass_13.png",
  "grass_14.png",
  "grass_15.png",
  "grass_16.png",
  "grass_17.png",
  "grass_18.png",
  "grass_19.png",
  "mars_01.png",
  "mars_02.png",
  "mars_03.png",
  "mars_04.png",
  "mars_05.png",
  "mars_06.png",
  "mars_07.png",
  "mars_08.png",
  "mars_09.png",
  "mars_10.png",
  "mars_11.png",
  "mars_12.png",
  "mars_13.png",
  "mars_14.png",
  "mars_15.png",
  "mars_16.png",
  "mars_17.png",
  "mars_18.png",
  "mars_19.png",
  "medieval_archery.png",
  "medieval_archway.png",
  "medieval_blacksmith.png",
  "medieval_cabin.png",
  "medieval_church.png",
  "medieval_farm.png",
  "medieval_house.png",
  "medieval_largeCastle.png",
  "medieval_lumber.png",
  "medieval_mine.png",
  "medieval_openCastle.png",
  "medieval_ruins.png",
  "medieval_smallCastle.png",
  "medieval_tower.png",
  "medieval_windmill.png",
  "military_entrance.png",
  "military_hangar.png",
  "military_rockets.png",
  "military_tanks.png",
  "military_turretLarge.png",
  "military_turretMedium.png",
  "military_turretSmall.png",
  "mill_crane.png",
  "mill_cutter.png",
  "mill_factory.png",
  "mill_stoneWarehouse.png",
  "mill_storage.png",
  "mill_warehouse.png",
  "modern_campsite.png",
  "modern_cornerShop.png",
  "modern_house.png",
  "modern_houseSmall.png",
  "modern_largeBuilding.png",
  "modern_oldBuilding.png",
  "modern_petrol.png",
  "modern_shop.png",
  "modern_skyscraper.png",
  "modern_skyscraperGlass.png",
  "modern_trailerpark.png",
  "modern_villa.png",
  "modern_villageLarge.png",
  "sand_01.png",
  "sand_02.png",
  "sand_03.png",
  "sand_04.png",
  "sand_05.png",
  "sand_06.png",
  "sand_07.png",
  "sand_08.png",
  "sand_09.png",
  "sand_10.png",
  "sand_11.png",
  "sand_12.png",
  "sand_13.png",
  "sand_14.png",
  "sand_15.png",
  "sand_16.png",
  "sand_17.png",
  "sand_18.png",
  "sand_19.png",
  "scifi_base.png",
  "scifi_building.png",
  "scifi_cargo.png",
  "scifi_corner.png",
  "scifi_domes.png",
  "scifi_energy.png",
  "scifi_factory.png",
  "scifi_factoryHangar.png",
  "scifi_factoryHigh.png",
  "scifi_foliage.png",
  "scifi_hangar.png",
  "scifi_headquarters.png",
  "scifi_living.png",
  "scifi_port.png",
  "scifi_silo.png",
  "scifi_skyscraper.png",
  "scifi_tower.png",
  "stone_wall.png",
  "stone_01.png",
  "stone_02.png",
  "stone_03.png",
  "stone_04.png",
  "stone_05.png",
  "stone_06.png",
  "stone_07.png",
  "stone_08.png",
  "stone_09.png",
  "stone_10.png",
  "stone_11.png",
  "stone_12.png",
  "stone_13.png",
  "stone_14.png",
  "stone_15.png",
  "stone_16.png",
  "stone_17.png",
  "stone_18.png",
  "stone_19.png",
  "western_bank.png",
  "western_general.png",
  "western_indians.png",
  "western_saloon.png",
  "western_sheriff.png",
  "western_station.png",
  "western_watertower.png"
];

export default class extends Phaser.State {

  /**
   *
   */
  init() {
    this.biomes = {};
    terrainArr.forEach((value) => {
      if (!this.biomes.hasOwnProperty(value.split('_')[0])) {
        this.biomes[value.split('_')[0]] = [];
      }

      this.biomes[value.split('_')[0]].push(value);
    });

    this.data = '';
    for (let y = 0; y < 12; y++) {
      for (let x = 0; x < 12; x++) {
        this.data += 'sprite' + this.game.rnd.between(0, 21).toString();
        if (x < 11) {
          this.data += ',';
        }
      }
      if (y < 11) {
        this.data += "\n";
      }
    }
  }

  preload() {
    this.game.load.tilemap('Terrain', 'assets/tilemaps/maps/Game.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('Terrain', 'assets/maps/terrain.png');
    this.game.load.image('arrow', 'assets/sprites/arrow.png');
  }

  initClient() {
    this.game.stage.disableVisibilityChange = true;
    this.client = new Client(this);
    this.playerMap = {};

    this.ground.inputEnabled = true; // Allows clicking on the map ; it's enough to do it on the last layer
    this.ground.events.onInputUp.add(this.getCoordinates, this);

    this.client.askNewPlayer();
  }

  create() {
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.stage.backgroundColor = '#01555f';
    this.map = this.game.add.tilemap('Terrain', 32, 32, 100, 20);

    //  Tilesets must always be added first
    this.map.addTilesetImage('Terrain', 'Terrain');

    //  Then create the layers
    this.background = this.map.createLayer('Background');
    this.ground = this.map.createLayer('Ground');
    this.ground.resizeWorld();
    this.initClient();

    this.cursors = this.game.input.keyboard.createCursorKeys();
  }

  update() {
    // this.sprite.body.setZeroVelocity();
    //
    // if (this.cursors.left.isDown) {
    //   this.sprite.body.moveLeft(200);
    // } else if (this.cursors.right.isDown) {
    //   this.sprite.body.moveRight(200);
    // }
    //
    // if (this.cursors.up.isDown) {
    //   this.sprite.body.moveUp(200);
    // } else if (this.cursors.down.isDown) {
    //   this.sprite.body.moveDown(200);
    // }
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
    this.playerMap[id] = this.game.add.sprite(x, y, 'arrow');
    this.playerMap[id].anchor.set(0.5);
    this.game.physics.p2.enable(this.playerMap[id]);
    this.playerMap[id].body.maxAngular = 500;
    this.playerMap[id].body.angularDrag = 50;

    return this.playerMap[id];
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
      tween = this.game.add.tween(player.body),
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