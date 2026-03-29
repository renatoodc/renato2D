import Phaser from 'phaser';

export default class WelcomeScene extends Phaser.Scene {
  public hasReadRules: boolean = false;
  private skyLayer!: Phaser.GameObjects.Graphics;
  private seaLayer!: Phaser.GameObjects.Graphics;
  private sandLayer!: Phaser.GameObjects.Graphics;
  private sunLayer!: Phaser.GameObjects.Container;
  private birdLayer!: Phaser.GameObjects.Container;
  private tideLayer!: Phaser.GameObjects.Graphics;
  private wetSandLayer!: Phaser.GameObjects.Graphics;
  private glossLayer!: Phaser.GameObjects.Graphics;
  private birds: (Phaser.GameObjects.Graphics & { speed: number, lift: number, phase: number, baseYSine: number })[] = [];
  private targetParallaxX = 0;
  private targetParallaxY = 0;
  private currentParallaxX = 0;
  private currentParallaxY = 0;
  private gameButton!: Phaser.GameObjects.Container;
  private modalContainer: Phaser.GameObjects.Container | null = null;
  private domModal: Phaser.GameObjects.DOMElement | null = null;

  private ICON_DATA: any = {
    'welcome_rules': {
      title: 'Regras da Casa',
      content: `1. Silêncio e Convivência:

Lei do Silêncio: Respeitar o silêncio entre 22h e 08h. O edifício é estritamente residencial e familiar. Multas aplicadas pelo condomínio por excesso de barulho serão de responsabilidade do hóspede.

Proibido Festas/Eventos: Não é permitida a realização de grandes eventos ou reuniões com pessoas que não constem na reserva.


2. Ocupação e Visitas:

Limite de Hóspedes: A capacidade máxima é de 8 pessoas. Apenas hóspedes registrados podem pernoitar.

Visitas: Consultar o anfitrião no chat do Airbnb sobre visitas diurnas.


3. Energia e Ventilação:

Consumo Consciente: Ao sair, certifique-se de desligar todas as luzes e ventiladores. Como o apartamento é bem ventilado, manter as janelas abertas durante o dia ajuda a manter o frescor.


4. Cuidados com o Imóvel:

Fumo: É estritamente proibido fumar dentro do imóvel. O fumo é permitido na área externa do condomínio.

Areia de Praia: Como não possuímos chuveiro no prédio, pedimos a gentileza de retirar o excesso de areia ainda na rua/praia. Isso ajuda a manter a limpeza e o bom funcionamento dos ralos.

Lixo: Por gentileza, o descarte deve ser feito preferencialmete diariamente ou ao final de sua reserva, nos coletores do condomínio, localizados à direita do portão da garagem.


5. Check-out e Chaves:

Horário: O horário de check-out deve ser respeitado para que nossa equipe de limpeza possa preparar o imóvel para o próximo hóspede.`
    },
    'welcome_game': {
      title: '🎮 GAME PARA CASHBACK',
      content: 'Aproveite nosso jogo exclusivo para ganhar cashback na sua próxima estadia!...'
    },
    'welcome_wifi': {
      title: '📶 WI-FI',
      content: 'Conecte-se e aproveite sua estadia!\n\nRede: Loga 201\nSenha: miguel10'
    },
    'welcome_visit': {
      title: '📍 GUIA LOCAL',
      content: 'Clique para abrir nosso Guia Local exclusivo com as melhores praias...'
    },
    'welcome_bakery': {
      title: '🥐 PADARIAS E CAFÉS',
      content: 'Confira as melhores opções de café da manhã próximas a você.'
    },
    'pharmacy': {
      title: '💊 FARMÁCIAS',
      content: 'Em caso de necessidade:\n- Farmácia Pague Menos (24h)\n- Drogaria São Paulo'
    },
    'restaurant': {
      title: '🍽️ RESTAURANTES',
      content: 'Sabores da região:\n- Cantina Italiana\n- Peixaria do Porto'
    },
    'check_in_out': {
      title: '🔑 CHECK-OUT',
      content: 'Check-in: A partir das 14:00.\nCheck-out: Até às 11:00.'
    },
    'contact': {
      title: '📱 CONTATO',
      content: 'Anfitrião: Renato\nWhatsApp: (27) 99999-9999'
    }
  };

  constructor() {
    super('WelcomeScene');
  }

  create() {
    const { width, height } = this.scale;
    const isPortrait = height > width;

    // 1. Procedural Dynamic Beach Backdrop
    this.createDynamicBeachBackground(width, height);

    // 2. Subtle Ocean Vignette
    const vignette = this.add.graphics();
    vignette.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0.4, 0.4, 0.0, 0.0);
    vignette.fillRect(0, 0, width, height * 0.3);

    // 3. Header Section (Perfected Typography)
    const titlePadding = isPortrait ? 0.08 : 0.05;
    
    // Header 1: CENTRAL DO HÓSPEDE
    this.add.text(width / 2, height * titlePadding, 'CENTRAL DO HÓSPEDE', {
      fontFamily: 'Montserrat', fontSize: isPortrait ? '12px' : '16px', color: '#ffffff', fontStyle: 'bold', letterSpacing: 5
    }).setOrigin(0.5).setAlpha(0.85);

    // Header 2: ITAIPAVA 201 (New)
    this.add.text(width / 2, height * (titlePadding + 0.035), 'ITAIPAVA 201', {
      fontFamily: 'Montserrat', fontSize: isPortrait ? '14px' : '18px', color: '#ffd700', fontStyle: 'bold', letterSpacing: 2
    }).setOrigin(0.5).setShadow(2, 2, 'rgba(0,0,0,0.3)', 2);

    // Header 3: Bem-vindo!
    const mainTitle = this.add.text(width / 2, height * (titlePadding + 0.12), 'Bem-vindo!', {
      fontFamily: 'Montserrat', fontSize: isPortrait ? '48px' : '64px', color: '#ffffff', fontStyle: 'bold'
    }).setOrigin(0.5);
    mainTitle.setShadow(2, 4, 'rgba(0,0,0,0.35)', 10);

    // Header 4: Refúgio em Itapuã (New)
    this.add.text(width / 2, height * (titlePadding + 0.185), 'Refúgio em Itapuã', {
      fontFamily: 'Montserrat', fontSize: isPortrait ? '18px' : '22px', color: '#ffffff', fontStyle: 'normal', letterSpacing: 1
    }).setOrigin(0.5).setShadow(1, 2, 'rgba(0,0,0,0.3)', 2).setAlpha(0.9);

    // 4. Icons
    const items = [
      { label: 'REGRAS DA CASA', emoji: '📜', id: 'welcome_rules', callback: () => {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('RulesScene'));
      }},
      { label: 'WI-FI', emoji: '📶', id: 'welcome_wifi', callback: () => {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('WifiScene'));
      }},
      { label: 'CHECK-OUT', emoji: '🔑', id: 'check_in_out', callback: () => {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('CheckoutScene'));
      }},
      { label: 'GUIA LOCAL', emoji: '📍', id: 'welcome_visit', callback: () => {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('LocalGuideScene'));
      }},
      { label: 'PADARIAS E CAFÉS', emoji: '🥐', id: 'welcome_bakery', callback: () => this.showModal('welcome_bakery') },
      { label: 'ONDE COMER', emoji: '🍽️', id: 'restaurant', callback: () => this.showModal('restaurant') },
      { label: 'GAME PRÊMIOS', emoji: '🎮', id: 'welcome_game', callback: () => this.startGame(), locked: true },
      { label: 'MERCADOS', emoji: '🛒', id: 'welcome_market', callback: () => {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('MarketScene'));
      }},
      { label: 'CONTATO', emoji: '📞', id: 'welcome_host', callback: () => {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('ContactScene'));
      }},
    ];

    const cols = isPortrait ? 3 : 5;
    const spacingX = width / (cols + 1);
    const spacingY = isPortrait ? height * 0.23 : height * 0.24; 
    const startY = isPortrait ? height * 0.35 : height * 0.38; 
    const wrapWidth = spacingX * 1.15;

    items.forEach((item, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = spacingX * (col + 1);
      const y = startY + row * spacingY;

      const isGame = item.id === 'welcome_game';
      const container = this.createProfessionalIcon(x, y, item.label, !!item.locked, item.emoji, wrapWidth, isGame);
      if (isGame) this.gameButton = container;

      container.setInteractive(new Phaser.Geom.Circle(0, 0, 50), Phaser.Geom.Circle.Contains);
      container.on('pointerdown', () => {
        if (item.locked && !this.hasReadRules) {
          this.showToast('Leia as Regras da Casa primeiro!');
          this.tweens.add({ targets: container, x: x + 6, yoyo: true, duration: 60, repeat: 3 });
          return;
        }
        item.callback();
      });

      container.setAlpha(0).setY(y + 30);
      this.time.delayedCall(index * 60, () => {
        this.tweens.add({ targets: container, alpha: 1, y: y, duration: 400, ease: 'Back.easeOut' });
      });
    });
  }

  update() {
    const midX = this.scale.width / 2;
    const midY = this.scale.height / 2;
    const pointer = this.input.activePointer;

    if (pointer) {
        this.targetParallaxX = (pointer.x - midX) / midX;
        this.targetParallaxY = (pointer.y - midY) / midY;
    }

    this.currentParallaxX += (this.targetParallaxX - this.currentParallaxX) * 0.05;
    this.currentParallaxY += (this.targetParallaxY - this.currentParallaxY) * 0.05;

    const factor = 40; 
    if (this.skyLayer) this.skyLayer.setPosition(this.currentParallaxX * factor * 0.01, this.currentParallaxY * factor * 0.01);
    if (this.sunLayer) this.sunLayer.setPosition((this.scale.width * 0.05) + (this.currentParallaxX * factor * 0.03), (this.scale.height * 0.05) + (this.currentParallaxY * factor * 0.03));
    if (this.seaLayer) this.seaLayer.setPosition(this.currentParallaxX * factor * -0.06, this.currentParallaxY * factor * -0.06);
    if (this.sandLayer) this.sandLayer.setPosition(this.currentParallaxX * factor * 0.005, this.currentParallaxY * factor * 0.005);
    if (this.wetSandLayer) this.wetSandLayer.setPosition(this.currentParallaxX * factor * 0.005, this.currentParallaxY * factor * 0.005);
    if (this.glossLayer) this.glossLayer.setPosition(this.currentParallaxX * factor * -0.01, this.currentParallaxY * factor * -0.01);
    if (this.tideLayer) this.tideLayer.setPosition(this.currentParallaxX * factor * -0.06, this.currentParallaxY * factor * -0.06);
    if (this.birdLayer) this.birdLayer.setPosition(this.currentParallaxX * factor * -0.08, this.currentParallaxY * factor * -0.08);

    // 🏆 UI Expert Skill: Avian Horizontal Migration Engine
    const time = Date.now();
    this.birds.forEach(bird => {
        // 1. Horizontal Migration
        bird.x += bird.speed;
        
        // 2. Off-screen Wrap Around (Seamless)
        const margin = 100;
        if (bird.x > this.scale.width + margin) {
            bird.x = -margin;
            bird.y = this.scale.height * (0.1 + Math.random() * 0.2); // Randomize new Y
            bird.baseYSine = bird.y;
        }

        // 3. Vertical Wind Drift (Gliding Feeling - Slower)
        bird.y = bird.baseYSine + (Math.sin(time * 0.0006 * bird.speed + bird.phase) * 12);

        // 4. Synchronized Wing-Beat (Slower & Smoother)
        const wingVal = Math.sin(time * 0.005 * bird.speed + bird.phase);
        const wingSpan = 10 * wingVal;
        
        bird.clear();
        bird.lineStyle(1.6, 0x000000, 0.4); // Softer silhouette
        bird.beginPath();
        // Left Wing (Gull Curve via Segments - Stable)
        bird.moveTo(-14, 0 + (wingVal * 1.5));
        bird.lineTo(-7, wingSpan - 1);
        bird.lineTo(0, 3);
        // Right Wing (Gull Curve via Segments - Stable)
        bird.lineTo(7, wingSpan - 1);
        bird.lineTo(14, 0 + (wingVal * 1.5));
        bird.strokePath();
    });
  }

  private createDynamicBeachBackground(width: number, height: number) {
    const overscan = 100;
    const seaY = height * 0.52;
    const sandY = height * 0.82;

    this.skyLayer = this.add.graphics();
    this.skyLayer.fillGradientStyle(0x00d2ff, 0x00d2ff, 0x3a7bd5, 0x3a7bd5, 1);
    this.skyLayer.fillRect(-overscan/2, -overscan/2, width + overscan, height + overscan);

    this.createCartoonSun(width * 0.05, height * 0.05);

    // 3. SEAMLESS SEA (Deep Unified Blue)
    this.seaLayer = this.add.graphics();
    // Unified Solid Blue (0x3a7bd5) as requested
    this.seaLayer.fillStyle(0x3a7bd5, 0.95);
    this.seaLayer.fillRect(-overscan/2, seaY - 100, width + overscan, (sandY - seaY) + 140); 

    // 4. SEAMLESS SAND (Flipped Gradient: Darker at shore, Lighter at bottom)
    this.sandLayer = this.add.graphics();
    this.sandLayer.fillGradientStyle(0xd2b48c, 0xd2b48c, 0xfff9e6, 0xfff9e6, 1, 1, 1, 1);
    this.sandLayer.fillRect(-overscan/2, sandY - 20, width + overscan, height - sandY + overscan);

    // 4.1 HIGH-FIDELITY WET SAND (Flipped: Darkest at the very edge)
    this.wetSandLayer = this.add.graphics();
    // Darker Moisture (0x8b7355) at the shore edge, fading to Toast (0xd2b48c)
    this.wetSandLayer.fillGradientStyle(0x8b7355, 0x8b7355, 0xd2b48c, 0xd2b48c, 0.45, 0.45, 0, 0);
    this.wetSandLayer.fillRect(-overscan/2, sandY, width + overscan, 80); // Moisture Zone
    
    // Spectral Gloss (Ultra-subtle wet sheen)
    this.glossLayer = this.add.graphics();
    this.glossLayer.fillGradientStyle(0xffffff, 0xffffff, 0xffffff, 0xffffff, 0.12, 0.12, 0, 0);
    this.glossLayer.fillRect(-overscan/2, sandY, width + overscan, 15);
    this.glossLayer.setAlpha(0.6);
    
    if (!this.textures.exists('sand_grain')) {
        const grainCtx = this.add.graphics();
        for(let i=0; i<400; i++) {
            const gx = Math.random() * 32;
            const gy = Math.random() * 32;
            grainCtx.fillStyle(0x000000, 0.05 + Math.random() * 0.08);
            grainCtx.fillRect(gx, gy, 1, 1);
        }
        grainCtx.generateTexture('sand_grain', 32, 32);
        grainCtx.destroy();
    }
    this.add.tileSprite(width/2, (height + sandY)/2, width + overscan, height - sandY + 20, 'sand_grain').setAlpha(0.4);

    this.createBirds(width, height);
    this.createCoastalSurge(width, seaY, sandY);
    
    this.add.graphics().fillStyle(0x000000, 0.08).fillRect(0, sandY, width, 10);
    
    this.add.particles(0, 0, 'white_pixel', {
        x: { min: 0, max: width },
        y: { min: seaY, max: sandY },
        scale: { start: 0.015, end: 0 },
        alpha: { start: 0.35, end: 0 },
        lifespan: 2500,
        frequency: 100,
        blendMode: 'ADD'
    });
  }

  private createCartoonSun(x: number, y: number) {
    this.sunLayer = this.add.container(x, y);
    const sunGlow = this.add.graphics().fillStyle(0xfff59d, 0.2).fillCircle(0, 0, 100);
    const sunCore = this.add.graphics().fillStyle(0xffd700, 1).fillCircle(0, 0, 60);
    
    const rays = this.add.graphics();
    rays.fillStyle(0xffd700, 0.8);
    for (let i = 0; i < 12; i++) {
        const angle = (i * 30) * (Math.PI / 180);
        const rx = Math.cos(angle) * 75;
        const ry = Math.sin(angle) * 75;
        rays.beginPath();
        rays.moveTo(Math.cos(angle - 0.2) * 60, Math.sin(angle - 0.2) * 60);
        rays.lineTo(rx, ry);
        rays.lineTo(Math.cos(angle + 0.2) * 60, Math.sin(angle + 0.2) * 60);
        rays.closePath();
        rays.fillPath();
    }

    this.sunLayer.add([sunGlow, rays, sunCore]);
    this.tweens.add({ targets: this.sunLayer, scale: 1.1, duration: 2500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.tweens.add({ targets: rays, angle: 360, duration: 30000, repeat: -1 });
  }

  private createBirds(width: number, height: number) {
    this.birdLayer = this.add.container(0, 0);
    this.birds = [];

    // Spawn a loose flock of 3 gulls (Reduced by 1/3 for cleaner sky)
    for (let i = 0; i < 3; i++) {
        const x = Math.random() * width;
        const y = height * (0.08 + Math.random() * 0.2);
        
        const bird = this.add.graphics() as any;
        bird.setPosition(x, y);
        
        // Flight physics properties (Slower & Smoother)
        bird.speed = 0.35 + Math.random() * 0.3; // Gentle migration speed
        bird.lift = 8 + Math.random() * 8;      
        bird.phase = Math.random() * Math.PI * 2; 
        bird.baseYSine = y;

        this.birds.push(bird);
        this.birdLayer.add(bird);
    }
  }

  private createCoastalSurge(width: number, seaY: number, sandY: number) {
    this.tideLayer = this.add.graphics();
    const segments = 12;
    const step = width / segments;

    this.tweens.addCounter({
        from: 0,
        to: Math.PI * 2,
        duration: 5500, // Balanced rhythm (5.5s cycle)
        repeat: -1,
        onUpdate: (tween: any) => {
            const val = typeof tween.getValue === 'function' ? tween.getValue() : tween.value;
            this.tideLayer.clear();
            
            // UI Expert Skill: Active Invasion (±28px)
            const tideOffset = Math.sin(val) * 28;
            const waveFrontY = sandY - 20 + tideOffset;
            const topLimitY = seaY; // FLIPPED: Fill UPWARDS to the horizon
            const overscan = 100;

            // 1. DYNAMIC WATER BODY (Deep Unified Blue)
            const surgeAlpha = 0.4 + (Math.sin(val) * 0.15); 
            // Unified Solid Blue (0x3a7bd5) for global ocean continuity
            this.tideLayer.fillStyle(0x3a7bd5, surgeAlpha); 
            
            this.tideLayer.beginPath();
            // Start at the horizon (limitY)
            this.tideLayer.moveTo(-overscan/2, topLimitY);
            this.tideLayer.lineTo(width + overscan, topLimitY);
            
            // Draw the WAVY BOTTOM edge (Inverted from previous logic)
            for (let i = segments; i >= 0; i--) {
                const waveY = waveFrontY + Math.sin(val + (i * 0.8)) * 12;
                this.tideLayer.lineTo(i * step, waveY);
            }
            this.tideLayer.closePath();
            this.tideLayer.fillPath();

            // 2. PREMIUM FOAM BORDER (Conditional visibility)
            // Only show foam when it "touches" the sand (at or below sandY)
            const foamVisibility = (waveFrontY >= sandY - 5) ? 1 : 0;
            const foamAlpha = (surgeAlpha * 1.5) * foamVisibility;
            
            this.tideLayer.lineStyle(4, 0xffffff, foamAlpha);
            this.tideLayer.beginPath();
            this.tideLayer.moveTo(-overscan/2, waveFrontY + Math.sin(val) * 12);
            for (let i = 0; i <= segments; i++) {
                const waveY = waveFrontY + Math.sin(val + (i * 0.8)) * 12;
                this.tideLayer.lineTo(i * step, waveY);
            }
            this.tideLayer.strokePath();
        }
    });
  }

  private createProfessionalIcon(x: number, y: number, label: string, isLocked: boolean, emoji: string, wrapWidth: number, isGame: boolean = false) {
    const container = this.add.container(x, y);
    const shadow = this.add.graphics().fillStyle(0x003366, 0.15).fillCircle(1, 3, 40);
    container.add(shadow);
    
    const base = this.add.graphics();
    const bgColor = isGame ? 0xffffff : 0xe0f7fa; 
    const bgAlpha = isGame ? 0.3 : 0.2;
    const strokeColor = isGame ? 0xffd700 : 0x80deea; 
    const strokeAlpha = isGame ? 0.9 : 0.6;

    base.fillStyle(bgColor, bgAlpha).fillCircle(0, 0, 40);
    base.lineStyle(2.5, strokeColor, strokeAlpha).strokeCircle(0, 0, 40); 
    base.fillStyle(0xffffff, 0.08).fillCircle(-15, -15, 18);
    container.add(base);

    const iconText = this.add.text(0, 0, emoji, { 
      fontSize: isGame ? '44px' : '40px',
      padding: { left: 8, top: 8, right: 8, bottom: 8 }
    }).setOrigin(0.5);
    iconText.setShadow(0, 0, isGame ? '#ffd700' : '#80deea', 12, true, true);
    container.add(iconText);

    const labelText = this.add.text(0, 56, label.toUpperCase(), {
      fontFamily: 'Outfit', 
      fontSize: '11.5px', 
      color: '#ffffff', 
      fontStyle: '900', 
      letterSpacing: 1.2, 
      align: 'center', 
      wordWrap: { width: wrapWidth, useAdvancedWrap: true },
      lineSpacing: 1
    }).setOrigin(0.5, 0);
    labelText.setShadow(2, 2, 'rgba(0,0,0,0.8)', 6);
    container.add(labelText);

    if (isLocked) {
      const lock = this.add.text(28, 28, '🔒', { fontSize: '16px' }).setOrigin(0.5);
      lock.setName('lock_icon');
      container.add(lock);
    }

    container.on('pointerover', () => this.tweens.add({ targets: container, scale: 1.15, duration: 250, ease: 'Cubic.easeOut' }));
    container.on('pointerout', () => this.tweens.add({ targets: container, scale: 1.0, duration: 200, ease: 'Cubic.easeIn' }));

    return container;
  }

  private showToast(msg: string) {
    const { width, height } = this.scale;
    const toast = this.add.container(width / 2, height + 60);
    const bg = this.add.graphics().fillStyle(0x004d40, 0.9).fillRoundedRect(-140, -22, 280, 44, 22);
    const txt = this.add.text(0, 0, msg, { fontFamily: 'Montserrat', fontSize: '12px', color: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5);
    toast.add([bg, txt]);
    this.tweens.add({
      targets: toast, y: height - 100, duration: 500, ease: 'Back.easeOut',
      onComplete: () => this.time.delayedCall(2200, () => {
        this.tweens.add({ targets: toast, alpha: 0, duration: 400, onComplete: () => toast.destroy() });
      })
    });
  }

  private startGame() {
    this.cameras.main.fadeOut(600, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('CharacterSelect'));
  }

  private showModal(key: string) {
    if (this.modalContainer) return;
    const { width, height } = this.scale;
    const data = this.ICON_DATA[key] || { title: 'INFO', content: '...' };

    this.modalContainer = this.add.container(0, 0).setDepth(200);
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.8).setOrigin(0).setInteractive();
    
    const cardW = Math.min(width * 0.9, 440);
    const cardH = Math.min(height * 0.75, 540);
    
    const modalFrame = this.add.container(width / 2, height / 2);
    const cardBg = this.add.graphics();
    cardBg.fillStyle(0x000000, 0.3).fillRoundedRect(-cardW / 2 + 5, -cardH / 2 + 5, cardW, cardH, 32);
    cardBg.fillStyle(0xffffff, 1).fillRoundedRect(-cardW / 2, -cardH / 2, cardW, cardH, 32);
    modalFrame.add(cardBg);

    const domHtml = `
      <div class="welcome-modal-wrapper" style="width: ${cardW - 60}px; height: ${cardH - 60}px;">
        <h1 class="welcome-modal-title">${data.title}</h1>
        <div class="welcome-modal-scroll">
          <p class="welcome-modal-text">${data.content}</p>
        </div>
        <div class="welcome-modal-footer">
          <button class="welcome-modal-btn">ENTENDIDO</button>
        </div>
      </div>
    `;

    this.domModal = this.add.dom(width / 2, height / 2).createFromHTML(domHtml);
    
    const btn = this.domModal.node.querySelector('.welcome-modal-btn') as HTMLElement;
    if (btn) {
      btn.addEventListener('click', () => {
        this.domModal?.destroy();
        this.domModal = null;
        this.modalContainer?.destroy();
        this.modalContainer = null;
        if (key === 'welcome_rules') {
          this.hasReadRules = true;
          this.gameButton.setAlpha(1);
          const lock = this.gameButton.getByName('lock_icon') as Phaser.GameObjects.Text;
          if (lock) {
            this.tweens.add({
              targets: lock,
              scale: 2,
              alpha: 0,
              duration: 400,
              onComplete: () => lock.destroy()
            });
            this.showToast('🎮 Game desbloqueado!');
          }
        }
      });
    }

    const scrollContainer = this.domModal.node.querySelector('.welcome-modal-scroll') as HTMLElement;
    const modalWrapper = this.domModal.node.querySelector('.welcome-modal-wrapper') as HTMLElement;
    if (scrollContainer && modalWrapper) {
        let isDown = false;
        let startPageY: number;
        let sTop: number;

        const start = (e: MouseEvent | TouchEvent) => {
            isDown = true;
            const pageY = e instanceof MouseEvent ? e.pageY : e.touches[0].pageY;
            startPageY = pageY;
            sTop = scrollContainer.scrollTop;
            modalWrapper.style.transition = 'none';
        };

        const end = () => {
            isDown = false;
        };

        const move = (e: MouseEvent | TouchEvent) => {
            if (!isDown) return;
            const pageY = e instanceof MouseEvent ? e.pageY : e.touches[0].pageY;
            const deltaY = pageY - startPageY;

            // 📖 Manual Scroll
            scrollContainer.scrollTop = sTop - deltaY;
            
            // Ensure no accidental dismissal movement
            modalWrapper.style.transform = 'translateY(0)';
        };

        scrollContainer.addEventListener('mousedown', start as any);
        window.addEventListener('mouseup', end);
        scrollContainer.addEventListener('mousemove', move as any);
        scrollContainer.addEventListener('touchstart', start as any, { passive: true });
        scrollContainer.addEventListener('touchend', end);
        scrollContainer.addEventListener('touchmove', move as any, { passive: false });
    }

    this.modalContainer.add([overlay, modalFrame]);
    modalFrame.setScale(0.7).setAlpha(0);
    this.domModal.setScale(0.7).setAlpha(0);
    this.tweens.add({ targets: [modalFrame, this.domModal], scale: 1, alpha: 1, duration: 450, ease: 'Back.easeOut' });
  }
}
