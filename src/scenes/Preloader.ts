import Phaser from 'phaser';

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('Preloader');
  }

  preload() {
    this.load.image('menu_bg', '/assets/menu_bg.png');
    this.load.image('homem_img', '/assets/Homem.png');
    this.load.image('homem_andando_img', '/assets/spritesheet/homem-andando.png');
    this.load.image('homem_subindo_img', '/assets/spritesheet/homem-subindo.png');
    this.load.image('homem_descendo_img', '/assets/spritesheet/homem-descendo.png');
    this.load.image('homem_idle_img', '/assets/spritesheet/homem-idle.png');
    this.load.image('mulher_img', '/assets/Mulher.png');
    this.load.image('renatao_img', '/assets/renatao.png');
    
    // Core Tiles restored from Git
    this.load.image('calcadao', '/assets/calcadao.png');
    this.load.image('sand', '/assets/sand_tile.png');
    this.load.image('water', '/assets/water_tile.png');
    
    // Other assets
    this.load.image('orla', '/assets/orla_grande.png');
    this.load.image('rua_melhor', '/assets/nova_rua_reduzida.png');
    this.load.image('predio', '/assets/ilha_muro.png'); // Fallback to ilha_muro
    this.load.image('estacionamento', '/assets/exxtac.png');
    this.load.image('ferrari', '/assets/ferrari_parada.png');
    this.load.image('concha', '/assets/concha.png');
    this.load.image('concha2', '/assets/concha2.png');
    this.load.image('concha3', '/assets/concha3.png');
    this.load.image('concha4', '/assets/concha4.png');
    this.load.image('totem', '/assets/totem.png');
    this.load.image('arvore_canteiro', '/assets/arvore_canteiro.png');
    this.load.image('ilhas_gregas_att', '/assets/ilha_muro.png');
    this.load.image('agua', '/assets/agua.png');
    this.load.image('mar_gif', '/assets/mar.gif');
    this.load.spritesheet('palio', '/assets/palio.png', { frameWidth: 632, frameHeight: 424 });
    
    // Welcome Scene Icons
    this.load.image('welcome_rules', '/assets/welcome_rules.png');
    this.load.image('welcome_game', '/assets/welcome_game.png');
    this.load.image('welcome_visit', '/assets/welcome_visit.png');
    this.load.image('welcome_bakery', '/assets/welcome_bakery.png');
    this.load.image('welcome_wifi', '/assets/welcome_wifi.png');
    this.load.image('logo_stayverse', '/assets/logo-stayverse.png..png');
    
    // Ensure all individual files are loaded as keys based on their names (for spawn command)
    this.load.image('Homem', '/assets/Homem.png');
    this.load.image('Mulher', '/assets/Mulher.png');
    this.load.image('arvore_canteiro_file', '/assets/arvore_canteiro.png');
    this.load.image('exxtac', '/assets/exxtac.png');
    this.load.image('ferrari_parada', '/assets/ferrari_parada.png');
    this.load.image('ilha_muro_file', '/assets/ilha_muro.png');
    this.load.image('nova_rua_reduzida', '/assets/nova_rua_reduzida.png');
    this.load.image('orla_grande', '/assets/orla_grande.png');
    this.load.image('renatao', '/assets/renatao.png');
    this.load.image('sand_tile', '/assets/sand_tile.png');
    this.load.image('water_tile', '/assets/water_tile.png');
    
    this.load.on('loaderror', (file: any) => {
      console.error(`[PRELOADER] Error loading: ${file.key} from ${file.src}`);
    });

    // Fallbacks
    const g = this.make.graphics({ x: 0, y: 0 });
    g.fillStyle(0x3498db).fillRoundedRect(0, 0, 32, 48, 8).generateTexture('m_fb', 32, 48).clear();
    g.fillStyle(0xe84393).fillRoundedRect(0, 0, 32, 48, 8).generateTexture('f_fb', 32, 48).clear();
  }

  create() {
    if (this.textures.exists('homem_img')) {
      const img = this.textures.get('homem_img').getSourceImage() as HTMLImageElement;
      if (this.textures.exists('male')) this.textures.remove('male');
      this.textures.addSpriteSheet('male', img, { 
        frameWidth: Math.floor(img.width / 4), 
        frameHeight: Math.floor(img.height / 3) 
      });
    }

    if (this.textures.exists('homem_andando_img')) {
      const img = this.textures.get('homem_andando_img').getSourceImage() as HTMLImageElement;
      if (this.textures.exists('male_side')) this.textures.remove('male_side');
      this.textures.addSpriteSheet('male_side', img, { 
        frameWidth: Math.floor(img.width / 7), 
        frameHeight: Math.floor(img.height / 7) 
      });
    }

    if (this.textures.exists('homem_subindo_img')) {
      const img = this.textures.get('homem_subindo_img').getSourceImage() as HTMLImageElement;
      if (this.textures.exists('male_up')) this.textures.remove('male_up');
      this.textures.addSpriteSheet('male_up', img, { 
        frameWidth: Math.floor(img.width / 8), 
        frameHeight: Math.floor(img.height / 8) 
      });
    }

    if (this.textures.exists('homem_descendo_img')) {
      const img = this.textures.get('homem_descendo_img').getSourceImage() as HTMLImageElement;
      if (this.textures.exists('male_down')) this.textures.remove('male_down');
      this.textures.addSpriteSheet('male_down', img, { 
        frameWidth: Math.floor(img.width / 8), 
        frameHeight: Math.floor(img.height / 8) 
      });
    }

    if (this.textures.exists('homem_idle_img')) {
      const img = this.textures.get('homem_idle_img').getSourceImage() as HTMLImageElement;
      if (this.textures.exists('male_idle')) this.textures.remove('male_idle');
      this.textures.addSpriteSheet('male_idle', img, { 
        frameWidth: Math.floor(img.width / 8), 
        frameHeight: Math.floor(img.height / 8) 
      });
    }

    if (this.textures.exists('mulher_img')) {
      const img = this.textures.get('mulher_img').getSourceImage() as HTMLImageElement;
      if (this.textures.exists('female')) this.textures.remove('female');
      this.textures.addSpriteSheet('female', img, { 
        frameWidth: Math.floor(img.width / 5), 
        frameHeight: Math.floor(img.height / 4) 
      });
    }

    this.createAnimations();
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
