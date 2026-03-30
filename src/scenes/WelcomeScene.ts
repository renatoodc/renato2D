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
  private vesselLayer!: Phaser.GameObjects.Container;
  private vessels: (Phaser.GameObjects.Graphics & { speed: number, type: 'ship' | 'boat', phase: number, baseY: number })[] = [];
  private gameIcon!: Phaser.GameObjects.Container;

  constructor() {
    super('WelcomeScene');
  }

  create() {
    const { width, height } = this.scale;
    const isPortrait = height > width;

    this.birdLayer = this.add.container(0, 0).setDepth(10);
    this.vesselLayer = this.add.container(0, 0).setDepth(5);
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
      fontFamily: 'Montserrat', fontSize: isPortrait ? '14px' : '18px', color: '#ffaa00', fontStyle: 'bold', letterSpacing: 2
    }).setOrigin(0.5).setShadow(2, 2, 'rgba(0,0,0,0.3)', 2).setAlpha(1);

    // Header 3: Bem-vindo!
    const mainTitle = this.add.text(width / 2, height * (titlePadding + 0.12), 'BEM-VINDO!', {
      fontFamily: 'Montserrat', fontSize: isPortrait ? '42px' : '58px', color: '#ffffff', fontStyle: '900', letterSpacing: 2
    }).setOrigin(0.5);
    mainTitle.setShadow(2, 4, 'rgba(0,0,0,0.35)', 10);

    // Header 4: Refúgio em Itapuã (New)
    this.add.text(width / 2, height * (titlePadding + 0.17), 'REFÚGIO EM ITAPUÃ', {
      fontFamily: 'Montserrat', fontSize: isPortrait ? '16px' : '20px', color: '#ffaa00', fontStyle: 'bold', letterSpacing: 2
    }).setOrigin(0.5).setShadow(1, 2, 'rgba(0,0,0,0.3)', 2).setAlpha(1);

    // 4. Icons
    const items = [
      { label: 'REGRAS\nDA CASA', emoji: '📜', id: 'welcome_rules', callback: () => {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('RulesScene'));
      }},
      { label: 'WI-FI\nE STREAMING', emoji: '📶', id: 'welcome_wifi', callback: () => {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('WifiScene'));
      }},
      { label: 'CHECK-IN / OUT', emoji: '🔑', id: 'check_in_out', callback: () => {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('CheckoutScene'));
      }},
      { label: 'GUIA LOCAL', emoji: '📍', id: 'welcome_visit', callback: () => {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('LocalGuideScene'));
      }},
      { label: 'PADARIAS\nE CAFÉS', emoji: '🥐', id: 'welcome_bakery', callback: () => {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('BakeryScene'));
      }},
      { label: 'RESTAURANTES\nE BARES', emoji: '🍽️', id: 'restaurant', callback: () => {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('RestaurantScene'));
      }},
      { label: 'GAME PARA\nPRÊMIOS', emoji: '🎮', id: 'welcome_game', callback: () => this.startGame(), locked: true },
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
    const startY = isPortrait ? height * 0.35 : height * 0.38; 
    const spacingY = isPortrait ? height * 0.25 : height * 0.24; 
    
    items.forEach((item, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      
      // 🕵️ UI Expert: Horizontal Spread Optimization (Reduced margins to 15%)
      const marginX = isPortrait ? width * 0.15 : width * 0.10;
      const availableWidth = width - (marginX * 2);
      const x = marginX + (col * (availableWidth / (cols - 1)));
      const y = startY + row * spacingY;
      
      const wrapWidth = (availableWidth / cols) * 1.1;

      const isGame = item.id === 'welcome_game';
      // Inicia como bloqueado visualmente SE o usuário nunca leu as regras OU se acabou de ler (para podermos mostrar a transição)
      const isJustUnlocked = isGame && this.game.registry.get('justUnlocked');
      const startLocked = item.locked && !this.hasReadRules;
      const visualLocked = startLocked || isJustUnlocked;

      const container = this.createProfessionalIcon(x, y, item.label, !!visualLocked, item.emoji, wrapWidth, isGame);
      if (isGame) this.gameIcon = container;

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

    // 🕵️ UI Expert: JOGO/PREMIOS Unlock Animation
    if (this.game.registry.get('justUnlocked')) {
        this.game.registry.set('justUnlocked', false);
        this.time.delayedCall(1200, () => this.animateUnlockSequence());
    }
  }

  private animateUnlockSequence() {
    if (!this.gameIcon) return;
    const lock = this.gameIcon.getByName('lock_icon') as Phaser.GameObjects.Text;
    
    // 1. Shake the whole icon (it's "resisting" or "preparing")
    this.tweens.add({
        targets: this.gameIcon,
        x: this.gameIcon.x + 5,
        duration: 80,
        yoyo: true,
        repeat: 5,
        onComplete: () => {
            // 2. Expand & Flash
            this.tweens.add({
                targets: this.gameIcon,
                scale: 1.4,
                duration: 400,
                ease: 'Cubic.easeOut',
                onStart: () => {
                    if (lock) {
                        this.tweens.add({
                            targets: lock,
                            alpha: 0,
                            y: lock.y - 40,
                            scale: 2,
                            duration: 600,
                            onComplete: () => lock.destroy()
                        });
                    }
                },
                onComplete: () => {
                    // 3. Settling and Celebration
                    this.tweens.add({
                        targets: this.gameIcon,
                        scale: 1,
                        duration: 600,
                        ease: 'Elastic.easeOut'
                    });
                    
                    // Add some particles or glow? (Simple flash for now)
                    const flash = this.add.graphics().fillStyle(0xffffff, 0.8).fillCircle(this.gameIcon.x, this.gameIcon.y, 40);
                    this.tweens.add({ targets: flash, alpha: 0, scale: 2, duration: 800, onComplete: () => flash.destroy() });
                }
            });
        }
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

    // 🚢 Vessel Migration & Bobbing
    this.vessels.forEach(vessel => {
        vessel.x += vessel.speed;
        if (vessel.x > this.scale.width + 100) vessel.x = -100;

        if (vessel.type === 'boat') {
            vessel.y = vessel.baseY + Math.sin(time * 0.002 + vessel.phase) * 4;
            vessel.rotation = Math.sin(time * 0.0015 + vessel.phase) * 0.1;
        }
    });

    if (this.vesselLayer) {
        this.vesselLayer.setPosition(this.currentParallaxX * factor * -0.07, this.currentParallaxY * factor * -0.07);
    }
  }

  private createDynamicBeachBackground(width: number, height: number) {
    const seaY = height * 0.52;
    const sandY = height * 0.82;

    // 🕵️ UI Expert: Overscan Engineering (width+100 starting at -50)
    this.skyLayer = this.add.graphics();
    this.skyLayer.fillGradientStyle(0x00d2ff, 0x00d2ff, 0x3a7bd5, 0x3a7bd5, 1);
    this.skyLayer.fillRect(-50, -50, width + 100, height + 100);

    this.createCartoonSun(width * 0.05, height * 0.05);

    // 3. SEAMLESS SEA (Deep Unified Blue)
    this.seaLayer = this.add.graphics();
    // Unified Solid Blue (0x3a7bd5) as requested
    this.seaLayer.fillStyle(0x3a7bd5, 0.95);
    this.seaLayer.fillRect(-50, seaY - 100, width + 100, (sandY - seaY) + 140); 

    // 4. SEAMLESS SAND (Flipped Gradient: Darker at shore, Lighter at bottom)
    this.sandLayer = this.add.graphics();
    this.sandLayer.fillGradientStyle(0xd2b48c, 0xd2b48c, 0xfff9e6, 0xfff9e6, 1, 1, 1, 1);
    this.sandLayer.fillRect(-50, sandY - 20, width + 100, (height - sandY) + 120);

    // 4.1 HIGH-FIDELITY WET SAND (Flipped: Darkest at the very edge)
    this.wetSandLayer = this.add.graphics();
    // Darker Moisture (0x8b7355) at the shore edge, fading to Toast (0xd2b48c)
    this.wetSandLayer.fillGradientStyle(0x8b7355, 0x8b7355, 0xd2b48c, 0xd2b48c, 0.45, 0.45, 0, 0);
    this.wetSandLayer.fillRect(-50, sandY, width + 100, 80); // Moisture Zone
    
    // Spectral Gloss (Ultra-subtle wet sheen)
    this.glossLayer = this.add.graphics();
    this.glossLayer.fillGradientStyle(0xffffff, 0xffffff, 0xffffff, 0xffffff, 0.12, 0.12, 0, 0);
    this.glossLayer.fillRect(-50, sandY, width + 100, 15);
    this.glossLayer.setAlpha(0.6);
    
    if (!this.textures.exists('sand_grain')) {
        const grainCtx = this.add.graphics();
        for(let i=0; i<400; i++) {
            const gx = Math.random() * 32;
            const gy = Math.random() * 32;
            grainCtx.fillRect(gx, gy, 1, 1);
        }
        grainCtx.generateTexture('sand_grain', 32, 32);
        grainCtx.destroy();
    }
    this.add.tileSprite(width/2, (height + sandY)/2, width + 100, height - sandY + 20, 'sand_grain').setAlpha(0.4);

    this.createBirds(width, height);
    this.createVessels(width, height, seaY);
    this.createCoastalSurge(width, seaY, sandY);
    
    this.wetSandLayer = this.add.graphics();
    this.wetSandLayer.fillGradientStyle(0x8b7355, 0x8b7355, 0xd2b48c, 0xd2b48c, 0.45, 0.45, 0, 0);
    this.wetSandLayer.fillRect(-50, sandY, width + 100, 80);
    
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

  private createVessels(width: number, height: number, seaY: number) {
    // 🚢 UI Expert: Cargo Ships on Horizon
    const shipConfigs = [
        { x: width * 0.2, y: seaY - 35, speed: 0.04 },
        { x: width * 0.8, y: seaY - 40, speed: 0.03 }
    ];

    shipConfigs.forEach(conf => {
        const ship = this.add.graphics() as any;
        ship.fillStyle(0x001a33, 0.4);
        // Hull
        ship.fillRect(-15, 0, 35, 4);
        // Bridge
        ship.fillRect(0, -3, 8, 4);
        ship.setPosition(conf.x, conf.y);
        ship.speed = conf.speed;
        ship.type = 'ship';
        this.vessels.push(ship);
        this.vesselLayer.add(ship);
    });

    // 🚣 UI Expert: Fishing Boats (Proportional to Sea Area)
    const sandY = height * 0.82;
    const seaDepth = sandY - seaY;
    
    for (let i = 0; i < 4; i++) {
        const boat = this.add.graphics() as any;
        const bx = Math.random() * width;
        const by = seaY + (seaDepth * 0.40) + (Math.random() * (seaDepth * 0.25));
        
        boat.fillStyle(0x001a33, 0.6);
        // Simple Hull
        boat.beginPath();
        boat.moveTo(-6, 0);
        boat.lineTo(6, 0);
        boat.lineTo(4, 3);
        boat.lineTo(-4, 3);
        boat.closePath();
        boat.fillPath();
        // Mast
        boat.lineStyle(1.5, 0x001a33, 0.6);
        boat.lineBetween(0, 0, 0, -6);
        
        boat.setPosition(bx, by);
        boat.speed = 0.08 + Math.random() * 0.08;
        boat.phase = Math.random() * Math.PI * 2;
        boat.baseY = by;
        boat.type = 'boat';
        this.vessels.push(boat);
        this.vesselLayer.add(boat);
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
            // sinVal from -1 to 1. Advanced peak at 1, Retreat peak at -1.
            const sinVal = Math.sin(val);
            const surgeAlpha = 0.4 + (sinVal * 0.15); 
            this.tideLayer.fillStyle(0x3a7bd5, surgeAlpha); 
            
            this.tideLayer.beginPath();
            this.tideLayer.moveTo(-overscan/2, topLimitY);
            this.tideLayer.lineTo(width + overscan, topLimitY);
            
            for (let i = segments; i >= 0; i--) {
                const waveY = waveFrontY + Math.sin(val + (i * 0.8)) * 12;
                this.tideLayer.lineTo(i * step, waveY);
            }
            this.tideLayer.closePath();
            this.tideLayer.fillPath();

            // 2. PREMIUM FOAM BORDER (Conditional Alpha by Sand Contact)
            // Foam only exists as it interacts with the sand. 
            // When waveFrontY is above sandY, it's "in the sea" and foam disappears.
            const sandContactDepth = Math.max(0, waveFrontY - sandY);
            const foamAlpha = (surgeAlpha * 1.8) * Phaser.Math.Clamp(sandContactDepth / 12, 0, 1);
            
            this.tideLayer.lineStyle(4, 0xffffff, foamAlpha);
            this.tideLayer.beginPath();
            this.tideLayer.moveTo(-overscan/2, waveFrontY + Math.sin(val) * 12);
            for (let i = 0; i <= segments; i++) {
                // Subtle horizontal wiggle for the foam edge
                const dx = Math.sin(val * 2 + i) * 2; 
                const waveY = waveFrontY + Math.sin(val + (i * 0.8)) * 12;
                this.tideLayer.lineTo((i * step) + dx, waveY);
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
      fontSize: '12.5px', 
      color: '#ffffff', 
      fontStyle: '900', 
      letterSpacing: 0.8, 
      align: 'center', 
      wordWrap: { width: wrapWidth, useAdvancedWrap: true },
      lineSpacing: -1
    }).setOrigin(0.5, 0);
    labelText.setStroke('#000000', 4);
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
}
