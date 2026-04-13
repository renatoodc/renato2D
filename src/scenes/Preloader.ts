import Phaser from 'phaser';

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('Preloader');
  }

  preload() {
    this.load.image('menu_bg', '/assets/menu_bg.png');
    this.load.image('praia_bg', '/assets/praia bg.jpg');
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
    
    // Welcome Scene Icons - Powered by Premium Custom Assets
    this.load.image('welcome_rules', '/assets/icons/rules.png');
    this.load.image('welcome_game', '/assets/icons/game.png');
    this.load.image('welcome_visit', '/assets/icons/visit.png');
    this.load.image('welcome_bakery', '/assets/icons/bakery.png');
    this.load.image('welcome_wifi', '/assets/icons/wifi.png');
    this.load.image('welcome_check_in_out', '/assets/icons/check_in_out.png');
    this.load.image('welcome_restaurant', '/assets/icons/restaurant.png');
    this.load.image('welcome_market', '/assets/icons/market.png');
    this.load.image('welcome_host', '/assets/icons/host.png');

    this.load.image('logo_stayverse', '/assets/logo-stayverse.png.png');
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
