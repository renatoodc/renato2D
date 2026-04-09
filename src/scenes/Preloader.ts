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

    // Icons
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

  private createAnimations() {
    if (!this.anims.exists('male_walk') && this.textures.exists('male')) {
      this.anims.create({
        key: 'male_walk',
        frames: this.anims.generateFrameNumbers('male', { start: 0, end: 11 }),
        frameRate: 12,
        repeat: -1
      });
    }
    if (!this.anims.exists('male_walk_side') && this.textures.exists('male_side')) {
      this.anims.create({
        key: 'male_walk_side',
        frames: this.anims.generateFrameNumbers('male_side', { start: 0, end: 48 }),
        frameRate: 12,
        repeat: -1
      });
    }
    if (!this.anims.exists('male_walk_up') && this.textures.exists('male_up')) {
      this.anims.create({
        key: 'male_walk_up',
        frames: this.anims.generateFrameNumbers('male_up', { start: 0, end: 63 }),
        frameRate: 12,
        repeat: -1
      });
    }
    if (!this.anims.exists('male_walk_down') && this.textures.exists('male_down')) {
      this.anims.create({
        key: 'male_walk_down',
        frames: this.anims.generateFrameNumbers('male_down', { start: 0, end: 63 }),
        frameRate: 12,
        repeat: -1
      });
    }
    if (!this.anims.exists('male_idle_anim') && this.textures.exists('male_idle')) {
      this.anims.create({
        key: 'male_idle_anim',
        frames: this.anims.generateFrameNumbers('male_idle', { start: 0, end: 63 }),
        frameRate: 12,
        repeat: -1
      });
    }
    if (!this.anims.exists('female_walk') && this.textures.exists('female')) {
      this.anims.create({
        key: 'female_walk',
        frames: this.anims.generateFrameNumbers('female', { start: 0, end: 11 }),
        frameRate: 15,
        repeat: -1
      });
    }
    if (!this.anims.exists('palio_drive') && this.textures.exists('palio')) {
      this.anims.create({
        key: 'palio_drive',
        frames: this.anims.generateFrameNumbers('palio', { start: 0, end: 99 }),
        frameRate: 24,
        repeat: -1
      });
    }
  }
}
