import Phaser from 'phaser';

import Preloader from './scenes/Preloader';
import CharacterSelect from './scenes/CharacterSelect';
import GameScene from './scenes/GameScene';
import UIScene from './scenes/UIScene';
import WelcomeScene from './scenes/WelcomeScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: 'game-container',
  transparent: true,
  dom: {
    createContainer: true
  },
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false
    }
  },
  scene: [Preloader, WelcomeScene, CharacterSelect, GameScene, UIScene]
};

export default new Phaser.Game(config);
