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
    player.torso = this;
    player.id = player.id;
    player.sex = (player.sex !== 'Female') ? 'Male' : player.sex;
    player.group = this.game.add.group();
    player.hair = new Phaser.Sprite(this.game, player.torso.x, player.torso.y, player.sex + 'Hair', null, player.group);
    player.shirt = new Phaser.Sprite(this.game, player.torso.x, player.torso.y, player.sex + 'Shirt', null, player.group);
    player.pants = new Phaser.Sprite(this.game, player.torso.x, player.torso.y, player.sex + 'Pants', null, player.group);
    player.shoes = new Phaser.Sprite(this.game, player.torso.x, player.torso.y, player.sex + 'Shoes', null, player.group);

    player.group.add(player.torso);
    player.group.add(player.hair);
    player.group.add(player.shirt);
    player.group.add(player.pants);
    player.group.add(player.shoes);

    player.group.callAll('animations.add', 'animations', 'IdleRight', ['WalkRight1'], 10, true);
    player.group.callAll('animations.add', 'animations', 'WalkRight', Phaser.Animation.generateFrameNames('WalkRight', 2, 9), 10, true);
    player.group.callAll('animations.add', 'animations', 'IdleLeft', ['WalkLeft1'], 10, true);
    player.group.callAll('animations.add', 'animations', 'WalkLeft', Phaser.Animation.generateFrameNames('WalkLeft', 2, 9), 10, true);
    player.group.callAll('animations.add', 'animations', 'IdleUp', ['WalkUp1'], 10, true);
    player.group.callAll('animations.add', 'animations', 'WalkUp', Phaser.Animation.generateFrameNames('WalkUp', 2, 9), 10, true);
    player.group.callAll('animations.add', 'animations', 'IdleDown', ['WalkDown1'], 10, true);
    player.group.callAll('animations.add', 'animations', 'WalkDown', Phaser.Animation.generateFrameNames('WalkDown', 2, 9), 10, true);
    player.group.callAll('animations.add', 'animations', 'CastRight', Phaser.Animation.generateFrameNames('CastRight', 2, 7), 10, true);
    player.group.callAll('animations.add', 'animations', 'CastLeft', Phaser.Animation.generateFrameNames('CastLeft', 2, 7), 10, true);
    player.group.callAll('animations.add', 'animations', 'CastUp', Phaser.Animation.generateFrameNames('CastUp', 2, 7), 10, true);
    player.group.callAll('animations.add', 'animations', 'CastDown', Phaser.Animation.generateFrameNames('CastDown', 2, 7), 10, true);
    player.group.callAll('animations.add', 'animations', 'ThrustRight', Phaser.Animation.generateFrameNames('ThrustRight', 2, 7), 10, true);
    player.group.callAll('animations.add', 'animations', 'ThrustLeft', Phaser.Animation.generateFrameNames('ThrustLeft', 2, 7), 10, true);
    player.group.callAll('animations.add', 'animations', 'ThrustUp', Phaser.Animation.generateFrameNames('ThrustUp', 2, 7), 10, true);
    player.group.callAll('animations.add', 'animations', 'ThrustDown', Phaser.Animation.generateFrameNames('ThrustDown', 2, 7), 10, true);
    player.group.callAll('animations.add', 'animations', 'SlashRight', Phaser.Animation.generateFrameNames('SlashRight', 2, 9), 10, true);
    player.group.callAll('animations.add', 'animations', 'SlashLeft', Phaser.Animation.generateFrameNames('SlashLeft', 2, 9), 10, true);
    player.group.callAll('animations.add', 'animations', 'SlashUp', Phaser.Animation.generateFrameNames('SlashUp', 2, 9), 10, true);
    player.group.callAll('animations.add', 'animations', 'SlashDown', Phaser.Animation.generateFrameNames('SlashDown', 2, 9), 10, true);

    this.game.playerMap[player.id] = player;
    // this.game.camera.follow(player.group);
    this.game.camera.focusOnXY(player.group.position.x, player.group.position.y + player.torso.height - this.game.camera.view.halfHeight);
    this.game.physics.enable(player.group, Phaser.Physics.ARCADE);

    this.setupEvents();

    return player;
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
