import Phaser from 'phaser'

export default class extends Phaser.State {

  preload() {
    this.game.load.spritesheet('balls', 'assets/sprites/balls.png', 17, 17);
  }

  create() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.leftEmitter = this.game.add.emitter(50, this.game.world.centerY - 200);
    this.leftEmitter.bounce.setTo(0.5, 0.5);
    this.leftEmitter.setXSpeed(100, 200);
    this.leftEmitter.setYSpeed(-50, 50);
    this.leftEmitter.makeParticles('balls', 0, 250, true, true);

    this.rightEmitter = this.game.add.emitter(this.game.world.width - 50, this.game.world.centerY - 200);
    this.rightEmitter.bounce.setTo(0.5, 0.5);
    this.rightEmitter.setXSpeed(-100, -200);
    this.rightEmitter.setYSpeed(-50, 50);
    this.rightEmitter.makeParticles('balls', 1, 250, true, true);

    // explode, lifespan, frequency, quantity
    this.leftEmitter.start(false, 5000, 20);
    this.rightEmitter.start(false, 5000, 20);
  }

  update() {
    this.game.physics.arcade.collide(this.leftEmitter, this.rightEmitter, this.change, null, this);
  }

  change(a, b) {
    a.frame = 3;
    b.frame = 3;
  }

}