import Phaser from 'phaser'
import Mushroom from '../Sprites/Mushroom'
import Follower from '../Sprites/Follower'
import Veggie from '../Sprites/Veggie'

export default class extends Phaser.State {

    preload() {
        this.game.load.tilemap('map', './assets/collision_test.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('ground_1x1', './assets/ground_1x1.png');
        this.game.load.image('phaz0r', './assets/phaz0r.png');
        this.game.load.image('player', './assets/player.png');

    }

    create() {
        this.tileHits = [];
        this.line = new Phaser.Line();
        this.map = this.game.add.tilemap('map');
        this.map.addTilesetImage('ground_1x1');
        this.layer = this.map.createLayer('Tile Layer 1');
        this.layer.resizeWorld();
        this.map.setCollisionBetween(1, 12);
        this.layer.debug = true;

        this.player = this.game.add.sprite(260, 70, 'player');
        this.player.anchor.x = 0.5;
        this.player.anchor.y = 0.5;
        this.game.physics.arcade.enable(this.player);
        this.game.camera.follow(this.player);

        this.cursors = this.game.input.keyboard.createCursorKeys();

        this.weapon = this.game.add.weapon(30, 'phaz0r');
        this.weapon.bulletSpeed = 600;
        this.weapon.fireRate = 100;
        this.weapon.trackSprite(this.player, 0, 0, true);

        this.help = this.game.add.text(10, 10, 'AWSD: movement, fire and steer with mouse', {
            font: '16px Arial',
            fill: '#ffffff'
        });
        this.help.fixedToCamera = true;
    }

    update() {
        this.player.rotation = this.game.physics.arcade.angleToPointer(this.player);
        if (this.game.input.activePointer.leftButton.isDown) {
            this.checkBeforeFiring(this.game.input.activePointer);
        }
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
            this.player.x += 1;
        }
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
            this.player.x -= 1;
        }
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.S)) {
            this.player.y += 2;
        }
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.W)) {
            this.player.y -= 2;
        }

        this.game.physics.arcade.collide(this.player, this.layer);
    }

    render() {
        this.game.debug.geom(this.line);
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
}