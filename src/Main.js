import 'pixi'
import 'p2'
import config from './config'
import Phaser from 'phaser'
import Splash from './States/Splash'
import Boot from './States/Boot'
import GameState from './States/Game'
import BoxesP2 from './States/BoxesP2'
import Particles from './States/Particles'
import Drags from './States/Drags'

class Game extends Phaser.Game {

  /**
   *
   */
  constructor() {
    const docElement = document.documentElement;
    const width = docElement.clientWidth > config.gameWidth ? config.gameWidth : docElement.clientWidth;
    const height = docElement.clientHeight > config.gameHeight ? config.gameHeight : docElement.clientHeight;

    super(width, height, Phaser.AUTO, 'content');

    this.state.add('Drags', Drags, false);
    this.state.add('Boot', Boot, false);
    this.state.add('BoxesP2', BoxesP2, false);
    this.state.add('Particles', Particles, false);
    this.state.add('Game', GameState, false);
    this.state.add('Splash', Splash, false);

    this.state.start('Boot');
  }

}

window.game = new Game();

