import Phaser from 'phaser';

export default class WelcomeScene extends Phaser.Scene {
  public hasReadRules: boolean = false;
  private skyLayer!: Phaser.GameObjects.Image;
  private sunLayer!: Phaser.GameObjects.Container;
  private seaLayer!: Phaser.GameObjects.Image;
  private sandLayer!: Phaser.GameObjects.Image;
  private wetSandLayer!: Phaser.GameObjects.Image;
  private glossLayer!: Phaser.GameObjects.Image;
  private tideLayer!: Phaser.GameObjects.Image;
  private birdLayer!: Phaser.GameObjects.Container;
  private vesselLayer!: Phaser.GameObjects.Image;
  private birds: (Phaser.GameObjects.Graphics & { speed: number, lift: number, phase: number, baseYSine: number })[] = [];
  private targetParallaxX = 0;
  private targetParallaxY = 0;
  private currentParallaxX = 0;
  private currentParallaxY = 0;
  private gameIcon!: Phaser.GameObjects.Container;

  constructor() {
    super('WelcomeScene');
  }

  create() {
    console.log('[WelcomeScene] Create started');
    const { width, height } = this.scale;
    const isPortrait = height > width;

    this.birdLayer = this.add.container(0, 0).setDepth(10);

    // 1. Dynamic Beach Background Integration
    this.createDynamicBeachBackground(width, height);

    // 2. Canyon Vignette & Lighting (REMOVIDO para evitar aspecto escuro)
    /*
    const vignetteLayer = this.add.graphics();
    vignetteLayer.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0.3, 0.3, 0.7, 0.7);
    vignetteLayer.fillRect(0, 0, width, height);
    vignetteLayer.setDepth(1);
    */
    
    this.scale.on('resize', () => {
        if (this.scene.isActive()) this.scene.restart();
    });

    const hScale = Math.min(1, height / 800);
    this.registry.set('globalScale', hScale); 
    const isSmallScreen = height < 680;
    
    // 🎨 UI Expert: Stayverse Branding
    let headerYOffset = isPortrait ? (isSmallScreen ? 0.03 : 0.05) : 0.04;
    if (this.textures.exists('logo_stayverse')) {
      const logoY = height * headerYOffset;
      const capsuleW = width * (isPortrait ? 0.5 : 0.22);
      const capsuleH = isSmallScreen ? 50 : 60;
      const capsule = this.add.graphics().setDepth(19);
      capsule.fillStyle(0x000000, 0.6);
      capsule.fillRoundedRect(width / 2 - capsuleW / 2, logoY - capsuleH / 2, capsuleW, capsuleH, capsuleH / 2);
      capsule.lineStyle(1.5, 0xffffff, 0.3);
      capsule.strokeRoundedRect(width / 2 - capsuleW / 2, logoY - capsuleH / 2, capsuleW, capsuleH, capsuleH / 2);

      const logo = this.add.image(width / 2, logoY, 'logo_stayverse').setDepth(20);
      logo.setInteractive({ useHandCursor: true });
      logo.on('pointerdown', () => {
        window.open('https://www.instagram.com/stayverse.br/', '_blank');
      });
      logo.setTintFill(0xffffff);
      const targetWidth = width * (isPortrait ? (isSmallScreen ? 0.38 : 0.45) : 0.18);
      const responsiveScale = logo.width > 0 ? targetWidth / logo.width : (isPortrait ? 0.3 : 0.4);
      logo.setScale(responsiveScale);
      
      this.tweens.add({
        targets: [logo, capsule],
        y: "-=4",
        duration: 3000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      headerYOffset += isPortrait ? (isSmallScreen ? 0.06 : 0.08) : 0.09;
    }

    const titlePadding = headerYOffset;
    
    // Header 1 (Top): ITAIPAVA 201
    this.add.text(width / 2, height * (titlePadding + 0.01), 'ITAIPAVA 201', {
      fontFamily: 'Montserrat', fontSize: isPortrait ? (isSmallScreen ? '14px' : '16px') : '18px', color: '#ffaa00', fontStyle: 'bold', letterSpacing: 2
    }).setOrigin(0.5).setShadow(1, 2, 'rgba(0,0,0,0.3)', 2).setAlpha(1).setDepth(20);

    // Header 2 (Middle/Main): TEMPORADA NA PRAIA (Premium Bronze Script)
    const mainTitle = this.add.text(width / 2, height * (titlePadding + 0.05), 'Temporada na Praia', {
      fontFamily: '"Dancing Script", "Pacifico", "Brush Script MT", cursive', 
      fontSize: isPortrait ? (isSmallScreen ? '38px' : '44px') : '56px', 
      color: '#f0c48e',
      fontStyle: 'normal'
    }).setOrigin(0.5).setDepth(20);
    
    mainTitle.setStroke('#8b4513', 3); 
    mainTitle.setShadow(2, 4, 'rgba(0,0,0,0.6)', 8);

    // Header 3 (Bottom): CENTRAL DO HÓSPEDE
    this.add.text(width / 2, height * (titlePadding + 0.115), 'CENTRAL DO HÓSPEDE', {
      fontFamily: 'Montserrat', 
      fontSize: isPortrait ? (isSmallScreen ? '18px' : '23px') : '28px', 
      color: '#E0E6ED', 
      fontStyle: 'light', 
      letterSpacing: 5
    }).setOrigin(0.5).setStroke('#000000', 3).setShadow(2, 2, 'rgba(0,0,0,0.5)', 4).setDepth(20);

    // 4. Icons
    const items = [
      { label: 'REGRAS\nDA CASA', icon: 'welcome_rules', callback: () => {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('RulesScene'));
      }},
      { label: 'WI-FI\nE STREAMING', icon: 'welcome_wifi', callback: () => {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('WifiScene'));
      }},
      { label: 'CHECK-IN / OUT', icon: 'welcome_check_in_out', callback: () => {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('CheckoutScene'));
      }},
      { label: 'GUIA\nTURÍSTICO', icon: 'welcome_visit', callback: () => {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('LocalGuideScene'));
      }},
      { label: 'PADARIAS\n& CAFÉS', icon: 'welcome_bakery', callback: () => {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('BakeryScene'));
      }},
      { label: 'BARES &\nRESTAURANTES', icon: 'welcome_restaurant', callback: () => {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('RestaurantScene'));
      }},
      { label: 'BENEFÍCIO\nVIP', icon: 'welcome_game', callback: () => this.startGame(), locked: true },
      { label: 'MERCADOS', icon: 'welcome_market', callback: () => {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('MarketScene'));
      }},
      { label: 'CONTATO', icon: 'welcome_host', callback: () => {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('ContactScene'));
      }},
    ];

    const cols = isPortrait ? 3 : 5;
    const startY = isPortrait ? (isSmallScreen ? height * 0.30 : height * 0.36) : height * 0.38;
    const spacingY = isPortrait ? (isSmallScreen ? height * 0.20 : height * 0.22) : height * 0.22;
    const marginX = isPortrait ? (isSmallScreen ? width * 0.12 : width * 0.15) : width * 0.10;
    const availableWidth = width - (marginX * 2);

    items.forEach((item, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      
      const x = marginX + (col * (availableWidth / (cols - 1)));
      const y = startY + row * spacingY;
      
      const wrapWidth = 140;

      const isGame = item.icon === 'welcome_game';
      const isJustUnlocked = isGame && this.game.registry.get('justUnlocked');
      const startLocked = item.locked && !this.hasReadRules;
      const visualLocked = startLocked || isJustUnlocked;

      const container = this.createProfessionalIcon(x, y, item.label, !!visualLocked, item.icon, wrapWidth, isGame);
      if (isGame) this.gameIcon = container;

      container.setInteractive(new Phaser.Geom.Circle(0, 0, 50), Phaser.Geom.Circle.Contains);
      container.on('pointerdown', () => {
        if (item.locked && !this.hasReadRules) {
          this.showToast('Leia as Regras da Casa para Desbloquear!');
          const lockIcon = container.getByName('lock_icon');
          if (lockIcon) {
            this.tweens.add({ targets: lockIcon, angle: { from: -20, to: 20 }, duration: 50, yoyo: true, repeat: 4 });
          }
          this.tweens.add({ targets: container, x: x + 4, yoyo: true, duration: 60, repeat: 2 });
          return;
        }
        item.callback();
      });

      container.setAlpha(0).setY(y + 30);
      this.time.delayedCall(index * 60, () => {
        this.tweens.add({ targets: container, alpha: 1, y: y, duration: 400, ease: 'Back.easeOut' });
      });
    });

    if (this.game.registry.get('justUnlocked')) {
        this.game.registry.set('justUnlocked', false);
        this.time.delayedCall(1200, () => this.animateUnlockSequence());
    }
  }

  update() {
    const midX = this.scale.width / 2;
    const midY = this.scale.height / 2;
    const pointer = this.input.activePointer;

    if (pointer && pointer.active) {
        this.targetParallaxX = (pointer.x - midX) / midX;
        this.targetParallaxY = (pointer.y - midY) / midY;
    }

    this.currentParallaxX += (this.targetParallaxX - this.currentParallaxX) * 0.05;
    this.currentParallaxY += (this.targetParallaxY - this.currentParallaxY) * 0.05;

    const factor = 40; 
    if (this.skyLayer) {
        const parallaxOffsetX = this.currentParallaxX * factor * 0.5;
        const parallaxOffsetY = this.currentParallaxY * factor * 0.5;
        this.skyLayer.setPosition(midX + parallaxOffsetX, midY + parallaxOffsetY);
    }
    if (this.sunLayer) this.sunLayer.setPosition((this.scale.width * 0.05) + (this.currentParallaxX * factor * 0.8), (this.scale.height * 0.05) + (this.currentParallaxY * factor * 0.8));
    if (this.seaLayer) this.seaLayer.setPosition(this.currentParallaxX * factor * -1.2, this.currentParallaxY * factor * -1.2);
    if (this.sandLayer) this.sandLayer.setPosition(this.currentParallaxX * factor * 0.2, this.currentParallaxY * factor * 0.2);
    if (this.wetSandLayer) this.wetSandLayer.setPosition(this.currentParallaxX * factor * 0.2, this.currentParallaxY * factor * 0.2);
    if (this.glossLayer) this.glossLayer.setPosition(this.currentParallaxX * factor * -0.3, this.currentParallaxY * factor * -0.3);
    if (this.tideLayer) this.tideLayer.setPosition(this.currentParallaxX * factor * -1.2, this.currentParallaxY * factor * -1.2);
    if (this.birdLayer) this.birdLayer.setPosition(this.currentParallaxX * factor * -1.5, this.currentParallaxY * factor * -1.5);
    if (this.vesselLayer) this.vesselLayer.setPosition(this.currentParallaxX * factor * -1.0, this.currentParallaxY * factor * -1.0);

    const time = Date.now();
    this.birds.forEach(bird => {
        bird.x += bird.speed;
        if (bird.x > this.scale.width + 100) {
            bird.x = -100;
            bird.y = this.scale.height * (0.1 + Math.random() * 0.2); 
            bird.baseYSine = bird.y;
        }
        bird.y = bird.baseYSine + (Math.sin(time * 0.0006 * bird.speed + bird.phase) * 12);
        const wingVal = Math.sin(time * 0.005 * bird.speed + bird.phase);
        const wingSpan = 10 * wingVal;
        
        bird.clear();
        bird.lineStyle(1.6, 0xffffff, 0.6); 
        bird.beginPath();
        bird.moveTo(-14, 0 + (wingVal * 1.5));
        bird.lineTo(-7, wingSpan - 1);
        bird.lineTo(0, 3);
        bird.lineTo(7, wingSpan - 1);
        bird.lineTo(14, 0 + (wingVal * 1.5));
        bird.strokePath();
    });
  }

  private createDynamicBeachBackground(width: number, height: number) {
    const bg = this.add.image(width / 2, height / 2, 'praia_bg');
    const scale = Math.max(width / bg.width, height / bg.height) * 1.1;
    bg.setScale(scale).setScrollFactor(0);
    this.skyLayer = bg;
    this.createSun(width, height);
    this.createBirds(width, height);
  }

  private createSun(width: number, height: number) {
    this.sunLayer = this.add.container(width * 0.05, height * 0.05).setDepth(1);
    const rays = this.add.graphics();
    rays.fillStyle(0xffe082, 0.3);
    const numRays = 12;
    for (let i = 0; i < numRays; i++) {
        const angle = (i / numRays) * Math.PI * 2;
        const length = 110;
        rays.beginPath();
        rays.moveTo(Math.cos(angle) * 30, Math.sin(angle) * 30);
        rays.lineTo(Math.cos(angle - 0.08) * length, Math.sin(angle - 0.08) * length);
        rays.lineTo(Math.cos(angle + 0.08) * length, Math.sin(angle + 0.08) * length);
        rays.closePath();
        rays.fillPath();
    }
    const glow = this.add.graphics();
    glow.fillGradientStyle(0xffe082, 0xffe082, 0xffe082, 0xffe082, 0.2, 0.2, 0, 0);
    glow.fillCircle(0, 0, 80);
    const core = this.add.graphics();
    core.fillStyle(0xfff9c4, 0.8);
    core.fillCircle(0, 0, 35);
    this.sunLayer.add([rays, glow, core]);
    this.tweens.add({ targets: [glow, core, rays], scale: 1.1, alpha: 0.9, duration: 4000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.tweens.add({ targets: rays, angle: 360, duration: 30000, repeat: -1, ease: 'Linear' });
  }

  private createBirds(width: number, height: number) {
    this.birds = [];
    for (let i = 0; i < 3; i++) {
        const x = Math.random() * width;
        const y = height * (0.15 + Math.random() * 0.2);
        const bird = this.add.graphics() as any;
        bird.setPosition(x, y);
        bird.speed = 0.35 + Math.random() * 0.3;
        bird.lift = 8 + Math.random() * 8;      
        bird.phase = Math.random() * Math.PI * 2; 
        bird.baseYSine = y;
        this.birds.push(bird);
        this.birdLayer.add(bird);
    }
  }
  private createProfessionalIcon(x: number, y: number, label: string, isLocked: boolean, iconKey: string, wrapWidth: number, isGame: boolean = false) {
    const container = this.add.container(x, y);
    const baseGraphics = this.add.graphics();
    baseGraphics.fillStyle(0x000000, 0.4).fillCircle(1, 4, 38);
    if (isGame) {
      baseGraphics.fillStyle(0x111115, 0.3).fillCircle(0, 0, 40);
      baseGraphics.lineStyle(2, 0xffaa00, 0.8).strokeCircle(0, 0, 40);
    } else {
      baseGraphics.fillStyle(0xffffff, 0.15).fillCircle(0, 0, 40);
      baseGraphics.lineStyle(2, 0xffffff, 0.5).strokeCircle(0, 0, 40);
    }
    container.add(baseGraphics);
    let size = 115;
    let offsetY = -8;
    switch (iconKey) {
      case 'welcome_rules':
      case 'welcome_check_in_out':
      case 'welcome_wifi': size = 115; offsetY = -8; break;
      case 'welcome_market': size = 125; offsetY = -8; break;
      case 'welcome_game': size = 130; offsetY = -15; break;
      case 'welcome_visit': size = 148; offsetY = -10; break;
      case 'welcome_restaurant': size = 155; offsetY = -10; break;
      case 'welcome_bakery': size = 160; offsetY = -12; break;
      case 'welcome_host': size = 160; offsetY = -15; break;
    }
    const iconImg = this.add.image(0, offsetY, iconKey).setOrigin(0.5);
    const scale = Math.min(size / iconImg.width, size / iconImg.height);
    iconImg.setScale(scale);
    const iconShadow = this.add.image(0, offsetY + 4, iconKey).setOrigin(0.5).setScale(scale).setTintFill(0x000000).setAlpha(0.3);
    container.add(iconShadow);
    container.add(iconImg);
    const isSmallScreen = this.scale.height < 680;
    const labelY = isSmallScreen ? 46 : 56;
    const labelText = this.add.text(0, labelY, label.toUpperCase(), { 
      fontFamily: 'Outfit', fontSize: isSmallScreen ? '11px' : '12px', color: '#ffffff', fontStyle: '900', letterSpacing: 1, align: 'center', wordWrap: { width: wrapWidth, useAdvancedWrap: true }, lineSpacing: -3
    }).setOrigin(0.5, 0);
    labelText.setStroke('#000000', 3).setShadow(2, 2, 'rgba(0,0,0,0.8)', 4);
    container.add(labelText);
    if (isLocked) {
      const lockOverlay = this.add.graphics().fillStyle(0x000000, 0.2).fillCircle(0, 0, 40);
      lockOverlay.setName('lock_overlay');
      container.add(lockOverlay);
      const lock = this.add.text(28, 28, '🔒', { fontSize: '14px' }).setOrigin(0.5).setName('lock_icon');
      container.add(lock);
    }
    container.on('pointerover', () => {
        if (isLocked && !this.hasReadRules) return;
        this.tweens.add({ targets: container, scale: 1.15, angle: 2, duration: 250, ease: 'Back.easeOut' });
        this.tweens.add({ targets: baseGraphics, alpha: 0.35, duration: 150, yoyo: true, repeat: 0 });
    });
    container.on('pointerout', () => {
        this.tweens.add({ targets: container, scale: 1.0, angle: 0, duration: 200, ease: 'Cubic.easeOut' });
    });
    return container;
  }

  private animateUnlockSequence() {
    if (!this.gameIcon) return;
    const lock = this.gameIcon.getByName('lock_icon') as Phaser.GameObjects.Text;
    const overlay = this.gameIcon.getByName('lock_overlay') as Phaser.GameObjects.Graphics;
    this.tweens.add({
        targets: this.gameIcon, x: this.gameIcon.x + 8, duration: 80, yoyo: true, repeat: 4,
        onComplete: () => {
            this.tweens.add({
                targets: this.gameIcon, scale: 1.4, duration: 450, ease: 'Cubic.easeOut',
                onStart: () => {
                    if (lock) this.tweens.add({ targets: lock, alpha: 0, y: lock.y - 60, scale: 3, rotation: 0.5, duration: 700, ease: 'Power2.easeIn', onComplete: () => lock.destroy() });
                    if (overlay) this.tweens.add({ targets: overlay, alpha: 0, scale: 2, duration: 600, onComplete: () => overlay.destroy() });
                },
                onComplete: () => {
                    this.tweens.add({ targets: this.gameIcon, scale: 1.15, duration: 800, ease: 'Elastic.easeOut' });
                    const flash = this.add.graphics({ x: this.gameIcon.x, y: this.gameIcon.y }).fillStyle(0xffd700, 0.6) .fillCircle(0, 0, 60);
                    this.tweens.add({ targets: flash, alpha: 0, scale: 2.5, duration: 1000, onComplete: () => flash.destroy() });
                }
            });
        }
    });
  }

  private showToast(msg: string) {
    const { width, height } = this.scale;
    const toast = this.add.container(width / 2, height + 60).setDepth(100);
    const bg = this.add.graphics().fillStyle(0x07110c, 0.95).lineStyle(1, 0xD4AF37, 0.8).fillRoundedRect(-140, -22, 280, 44, 22).strokeRoundedRect(-140, -22, 280, 44, 22);
    const txt = this.add.text(0, 0, msg, { fontFamily: 'Cinzel', fontSize: '11px', color: '#D4AF37', fontStyle: 'bold' }).setOrigin(0.5);
    toast.add([bg, txt]);
    this.tweens.add({ targets: toast, y: height - 100, duration: 500, ease: 'Back.easeOut', onComplete: () => this.time.delayedCall(2200, () => { this.tweens.add({ targets: toast, alpha: 0, duration: 400, onComplete: () => toast.destroy() }); }) });
  }

  private startGame() {
    this.cameras.main.fadeOut(600, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('CharacterSelect'));
  }
}
