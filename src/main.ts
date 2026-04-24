import Phaser from 'phaser';

import Preloader from './scenes/Preloader';
import StoryScene from './scenes/StoryScene';
import CharacterSelect from './scenes/CharacterSelect';
import GameScene from './scenes/GameScene';
import UIScene from './scenes/UIScene';
import WelcomeScene from './scenes/WelcomeScene';
import { LocalGuideScene } from './scenes/LocalGuideScene';
import { CheckoutScene } from './scenes/CheckoutScene';
import { RulesScene } from './scenes/RulesScene';
import { WifiScene } from './scenes/WifiScene';
import { ContactScene } from './scenes/ContactScene';
import { MarketScene } from './scenes/MarketScene';
import { RestaurantScene } from './scenes/RestaurantScene';
import { BakeryScene } from './scenes/BakeryScene';
import { BookingScene } from './scenes/BookingScene';

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
  scene: [Preloader, WelcomeScene, CharacterSelect, StoryScene, GameScene, UIScene, LocalGuideScene, CheckoutScene, RulesScene, WifiScene, ContactScene, MarketScene, RestaurantScene, BakeryScene, BookingScene]
};

export default new Phaser.Game(config);
