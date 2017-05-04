import 'pixi'
import 'p2'
import Phaser from 'phaser'
import BootState from './States/Boot'
import DragsState from './States/Drags'
import GameState from './States/Game'
import SplashState from './States/Splash'
import config from './config'

class Game extends Phaser.Game {

  /**
   *
   */
  constructor() {
    const docElement = document.documentElement;
    const width = docElement.clientWidth > config.gameWidth ? config.gameWidth : docElement.clientWidth;
    const height = docElement.clientHeight > config.gameHeight ? config.gameHeight : docElement.clientHeight;

    super(width, height, Phaser.CANVAS, 'content');
    // super(width, height, Phaser.WEBGL, 'content');

    this.state.add('Drags', DragsState, false);
    this.state.add('Boot', BootState, false);
    this.state.add('Game', GameState, false);
    this.state.add('Splash', SplashState, false);

    this.state.start('Boot');
  }

}

window.game = new Game();

