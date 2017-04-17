import 'pixi'
import 'p2'
import Phaser from 'phaser'
import BootState from './States/Boot'
import GameState from './States/Game'
import MMO from './States/MMO'
import PewPew from './States/PewPew'
import SplashState from './States/Splash'
import TileMap from './States/TileMap'
import config from './config'

class Game extends Phaser.Game {

  /**
   *
   */
  constructor() {
    const docElement = document.documentElement;
    const width = docElement.clientWidth > config.gameWidth ? config.gameWidth : docElement.clientWidth;
    const height = docElement.clientHeight > config.gameHeight ? config.gameHeight : docElement.clientHeight;

    super(width, height, Phaser.CANVAS, 'content', null);

    this.state.add('Boot', BootState, false);
    this.state.add('Game', GameState, false);
    this.state.add('MMO', MMO, false);
    this.state.add('PewPew', PewPew, false);
    this.state.add('Splash', SplashState, false);
    this.state.add('TileMap', TileMap, false);

    this.state.start('Boot');
  }

}

window.game = new Game();

