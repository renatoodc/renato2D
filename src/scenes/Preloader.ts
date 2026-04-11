import Phaser from 'phaser';

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('Preloader');
  }

  preload() {
    console.log('[Preloader] Preload started');
    const { width, height } = this.scale;
    const loadingText = this.add.text(width / 2, height / 2, 'CARREGANDO...', { 
        fontFamily: 'Arial', fontSize: '24px', color: '#ffffff' 
    }).setOrigin(0.5);

    this.load.on('progress', (value: number) => {
        loadingText.setText(`CARREGANDO... ${Math.round(value * 100)}%`);
    });

    // Icons - Novos ícones Urbanos
    const icons = ['rules', 'wifi', 'game', 'visit', 'bakery', 'restaurant', 'market', 'host', 'check_in_out'];
    icons.forEach(icon => {
        this.load.image(`icon_${icon}`, `/assets/icons/${icon}.png`);
    });

    this.load.image('logo_stayverse', '/assets/logo-stayverse.png..png');
    this.load.video('metropolis_bg', '/assets/metropolis_bg.mp4');
    
    this.load.on('loaderror', (file: any) => {
      console.error(`[PRELOADER] Error loading: ${file.key} from ${file.src}`);
    });

    // Fallbacks
    const g = this.make.graphics({ x: 0, y: 0 });
    g.fillStyle(0x3498db).fillRoundedRect(0, 0, 32, 48, 8).generateTexture('m_fb', 32, 48).clear();
    g.fillStyle(0xe84393).fillRoundedRect(0, 0, 32, 48, 8).generateTexture('f_fb', 32, 48).clear();
    console.log('[Preloader] Preload finished');
  }

  create() {
    this.scene.start('WelcomeScene');
  }
}
