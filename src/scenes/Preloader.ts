import Phaser from 'phaser';

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('Preloader');
  }

  preload() {
    this.load.image('menu_bg', '/assets/menu_bg.png');
    this.load.image('homem_img', '/assets/Homem.png');
    this.load.image('mulher_img', '/assets/Mulher.png');
    this.load.image('calcadao', '/assets/calcadao.png');
    this.load.image('sand', '/assets/sand_tile.png');
    this.load.image('water', '/assets/water_tile.png');
    
    // Fallback graphics (use unique names)
    const graphics = this.make.graphics({ x: 0, y: 0 });
    graphics.fillStyle(0xe84393).fillRoundedRect(0, 0, 32, 48, 8).generateTexture('f_fb', 32, 48).clear();
    graphics.fillStyle(0x3498db).fillRoundedRect(0, 0, 32, 48, 8).generateTexture('m_fb', 32, 48).clear();
  }

  create() {
    // 1. Male Spritesheet (Homem.png: 4x3)
    if (this.textures.exists('homem_img')) {
      const img = this.textures.get('homem_img').getSourceImage() as HTMLImageElement;
      if (this.textures.exists('male')) this.textures.remove('male');
      this.textures.addSpriteSheet('male', img, { 
        frameWidth: Math.floor(img.width / 4), 
        frameHeight: Math.floor(img.height / 3) 
      });
    } else {
        this.textures.addImage('male', this.textures.get('m_fb').getSourceImage() as any);
    }

    // 2. Female Spritesheet (Mulher.png: 5x4)
    if (this.textures.exists('mulher_img')) {
      const img = this.textures.get('mulher_img').getSourceImage() as HTMLImageElement;
      if (this.textures.exists('female')) this.textures.remove('female');
      this.textures.addSpriteSheet('female', img, { 
        frameWidth: Math.floor(img.width / 5), 
        frameHeight: Math.floor(img.height / 4) 
      });
    } else {
        this.textures.addImage('female', this.textures.get('f_fb').getSourceImage() as any);
    }

    // Animations (using 'male' and 'female' as the final keys)
    this.createAnimations();

    this.scene.start('CharacterSelect');
  }

  private createAnimations() {
    if (!this.anims.exists('male_select')) {
      this.anims.create({
        key: 'male_select',
        frames: this.anims.generateFrameNumbers('male', { start: 0, end: 11 }),
        frameRate: 18,
        repeat: 0,
        yoyo: true
      });
    }

    if (!this.anims.exists('female_select')) {
      this.anims.create({
        key: 'female_select',
        frames: this.anims.generateFrameNumbers('female', { start: 0, end: 11 }),
        frameRate: 15,
        repeat: 0
      });
    }

    if (!this.anims.exists('male_walk')) {
      this.anims.create({
        key: 'male_walk',
        frames: this.anims.generateFrameNumbers('male', { start: 0, end: 11 }),
        frameRate: 12,
        repeat: -1
      });
    }

    if (!this.anims.exists('female_walk')) {
      this.anims.create({
        key: 'female_walk',
        frames: this.anims.generateFrameNumbers('female', { start: 0, end: 11 }),
        frameRate: 12,
        repeat: -1
      });
    }
  }
}
