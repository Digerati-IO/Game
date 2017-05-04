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
  // preload() {
    // this.game.load.tilemap('Terrain', 'assets/lpc/game.json', null, Phaser.Tilemap.TILED_JSON);
    // this.game.load.image('Terrain', 'assets/lpc/terrain_atlas.png');
    // this.game.load.atlasJSONHash('MaleHero', 'assets/lpc/tanned_male.png', 'assets/lpc/hero_atlas.json');
    // this.game.load.atlasJSONHash('FemaleHero', 'assets/lpc/tanned_female.png', 'assets/lpc/hero_atlas.json');
    // this.game.load.atlasJSONHash('SkeletonHero', 'assets/lpc/skeleton.png', 'assets/lpc/hero_atlas.json');
    // this.game.load.atlasJSONHash('FemaleShoes', 'assets/lpc/feet/slippers_female/brown.png', 'assets/lpc/hero_atlas.json');
    // this.game.load.atlasJSONHash('MaleShoes', 'assets/lpc/feet/shoes/male/brown_shoes_male.png', 'assets/lpc/hero_atlas.json');
    // this.game.load.atlasJSONHash('FemaleHair', 'assets/lpc/hair/female/long/blonde2.png', 'assets/lpc/hero_atlas.json');
    // this.game.load.atlasJSONHash('MaleHair', 'assets/lpc/hair/male/bedhead/blonde2.png', 'assets/lpc/hero_atlas.json');
    // this.game.load.atlasJSONHash('FemalePants', 'assets/lpc/legs/pants/male/teal_pants_male.png', 'assets/lpc/hero_atlas.json');
    // this.game.load.atlasJSONHash('MalePants', 'assets/lpc/legs/pants/female/teal_pants_female.png', 'assets/lpc/hero_atlas.json');
    // this.game.load.atlasJSONHash('FemaleShirt', 'assets/lpc/torso/corset_female/corset_black.png', 'assets/lpc/hero_atlas.json');
    // this.game.load.atlasJSONHash('MaleShirt', 'assets/lpc/torso/shirts/longsleeve/male/white_longsleeve.png', 'assets/lpc/hero_atlas.json');
  // }

  preload() {

    // No allowed on JSFiddle with Phaser
    this.game.load.image('targetSprite', 'assets/target.png');
    this.game.load.image('draggableSprite', 'assets/draggable.png');
  }

  create() {
    this.gl = this.game.renderer.gl;
    this.line = new Phaser.Line();

    this.game.stage.backgroundColor = "#cccccc";

    this.rows = Math.floor(Math.random() * 3) + 1;
    this.rowHeight = this.game.height / this.rows;

    // Place some semi-random target sprites in the scene
    for (let i = 0; i < this.rows; i++) {
      this.rowCount = Math.floor(Math.random() * 4) + 1;
      this.targetSpacing = (this.game.width - 300) / this.rowCount;

      for (let w = 0; w < this.rowCount; w++) {
        var y_pos = (this.rowHeight * w) + (this.rowHeight / 2);
        var x_pos = this.targetSpacing * (w + 1);
        var sprite = this.game.add.sprite(x_pos, y_pos, 'targetSprite');
        sprite.anchor.setTo(0.5);
        sprite.scale.setTo(0.5);
        sprite["target_custom_id"] = "a_specific_id_" + w; // This ID is important and will need to be reported on hover of the draggable
      }
    }

    var draggable = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'draggableSprite');
    draggable.anchor.setTo(0.5);
    draggable.scale.setTo(0.5);
    draggable['draggable_custom_id'] = "another_specific_id"; // There will be multiple 'draggables' with unique ID's
    this.game.physics.arcade.enable(draggable);
    draggable.inputEnabled = true;
    draggable.input.enableDrag();
    draggable.events.onDragStart.add(this.onDragStart, this);
    draggable.events.onDragUpdate.add(this.onDragUpdate, this);
    draggable.events.onDragStop.add(this.onDragStop, this);

  }

  update() {
  }

  onDragStart(sprite, pointer) {
    console.log("Dragging " + sprite["draggable_custom_id"]);
  }

  onDragUpdate(sprite, pointer, dragX, dragY, snapPoint) {
    this.raycastCheck(sprite, pointer);
    this.pixelCheck(sprite, pointer);

  }

  onDragStop(sprite, pointer) {
    console.log("Dropped " + sprite["draggable_custom_id"] + " at " + pointer.x + "," + pointer.y);
  }

  raycastCheck(sprite, pointer) {
    this.line.start.set(pointer.x, pointer.y);

    this.newX = pointer.x;
    this.newY = pointer.y;
    this.deltaX = this.newX - this.oldX;
    this.deltaY = this.newY - this.oldY;

    this.oldX = this.newX;
    this.oldY = this.newY;

    this.line.end.set(sprite.x + this.deltaX * 20, sprite.y + this.deltaY * 20);

  }

  pixelCheck(sprite, pointer) {
    //create buffers to store pixel data into , Left right up an down buffer
    var bufR = new Uint8Array(4);
    var bufL = new Uint8Array(4);
    var bufU = new Uint8Array(4);
    var bufD = new Uint8Array(4);
    //read in the pixel with 26 pixel offset
    var offset = 26;
    //console.log(sprite.x+" "+sprite.y);
    this.gl.readPixels(sprite.x + offset, sprite.y, 1, 1, this.gl.RGBA, this.gl.UNSIGNED_BYTE, bufR);//right from red block
    this.gl.readPixels(sprite.x - offset, sprite.y, 1, 1, this.gl.RGBA, this.gl.UNSIGNED_BYTE, bufL);//left from red block
    this.gl.readPixels(sprite.x, sprite.y - offset, 1, 1, this.gl.RGBA, this.gl.UNSIGNED_BYTE, bufU);//above red block
    this.gl.readPixels(sprite.x, sprite.y + offset, 1, 1, this.gl.RGBA, this.gl.UNSIGNED_BYTE, bufD);//below red block

    console.log(bufR);
    console.log(bufL);
    console.log(bufD);
    console.log(bufU);

    //If one of buffers is white, scale. checking for alpha is an easier way out
    if (((bufR[0] && bufR[1] && bufR[2]) == 255) || (bufL[0] && bufL[1] && bufL[2] == 255) || (bufU[0] && bufU[1] && bufU[2] == 255) || (bufD[0] && bufD[1] && bufD[2] == 255)) {
      //console.log("scale");
      sprite.scale.setTo(0.2);
    } else {
      sprite.scale.setTo(0.5);
    }

    //gl.flush();

  }

  render() {
    this.game.debug.geom(this.line);
  }
}