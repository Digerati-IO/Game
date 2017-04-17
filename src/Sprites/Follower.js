import Phaser from 'phaser'

export default class extends Phaser.Sprite {

  /**
   *
   * @param game
   * @param x
   * @param y
   * @param asset
   * @param frame
   * @param target
   */
  constructor({game, x, y, asset, frame, target}) {
    super(game, x, y, asset, frame);

    this.target = target;
    this.anchor.setTo(0.5, 0.5);
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    // Each Follower will record its position history in
    // an array of point objects (objects with x,y members)
    // This will be used to make each Follower follow the
    // same track as its target
    this.history = [];
    this.HISTORY_LENGTH = 5;
    // Define constants that affect motion
    this.MAX_SPEED = 250; // pixels/second
    this.MIN_DISTANCE = 32; // pixels
  }

  /**
   *  Get the target x and y position.
   *  This algorithm will follow targets that may or may not have a position history.
   *  The targetMoving flag tells this object when its target is moving
   *  so that it knows when to move and when to stop.
   */
  update() {
    let t = {},
      targetMoving = false;
    if (this.target.history !== undefined && this.target.history.length) {
      // This target has a history so go towards that
      t = this.target.history[0];
      if (this.target.body.velocity.x !== 0 || this.target.body.velocity.y !== 0) {
        targetMoving = true;
      }
    } else {
      // This target doesn't have a history defined so just
      // follow its current x and y position
      t.x = this.target.x;
      t.y = this.target.y;

      // Calculate distance to target
      // If the position is far enough way then consider it "moving"
      // so that we can get this Follower to move.
      if (this.game.math.distance(this.x, this.y, t.x, t.y) > this.MIN_DISTANCE) {
        targetMoving = true;
      }
    }

    // If the distance > MIN_DISTANCE then move
    if (targetMoving) {
      // Add current position to the end of the history array
      this.history.push({x: this.x, y: this.y});

      // If the length of the history array is over a certain size
      // then remove the oldest (first) element
      if (this.history.length > this.HISTORY_LENGTH) {
        this.history.shift();
      }

      // Calculate the angle to the target
      let rotation = this.game.math.angleBetween(this.x, this.y, t.x, t.y);

      // Calculate velocity vector based on rotation and this.MAX_SPEED
      this.body.velocity.x = Math.cos(rotation) * this.MAX_SPEED;
      this.body.velocity.y = Math.sin(rotation) * this.MAX_SPEED;
    } else {
      this.body.velocity.setTo(0, 0);
    }
  }

}
