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
      fontSize: isPortrait ? (isSmallScreen ? '24px' : '30px') : '36px', 
      color: '#E0E6ED', 
      fontStyle: 'light', 
      letterSpacing: 5
    }).setOrigin(0.5).setStroke('#000000', 3).setShadow(2, 2, 'rgba(0,0,0,0.5)', 4).setDepth(20);

    // 4. Icons (DOM Integrated)
    this.setupDOMGrid();
  }

  private setupDOMGrid() {
    const overlay = document.getElementById('welcome-overlay');
    if (!overlay) return;

    overlay.style.display = 'flex';
    // Trigger CSS animation
    setTimeout(() => overlay.classList.add('visible'), 50);

    const actions: Record<string, () => void> = {
      rules: () => {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          overlay.style.display = 'none';
          overlay.classList.remove('visible');
          this.scene.start('RulesScene');
        });
      },
      wifi: () => {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          overlay.style.display = 'none';
          overlay.classList.remove('visible');
          this.scene.start('WifiScene');
        });
      },
      checkout: () => {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          overlay.style.display = 'none';
          overlay.classList.remove('visible');
          this.scene.start('CheckoutScene');
        });
      },
      visit: () => {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          overlay.style.display = 'none';
          overlay.classList.remove('visible');
          this.scene.start('LocalGuideScene');
        });
      },
      bakery: () => {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          overlay.style.display = 'none';
          overlay.classList.remove('visible');
          this.scene.start('BakeryScene');
        });
      },
      restaurant: () => {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          overlay.style.display = 'none';
          overlay.classList.remove('visible');
          this.scene.start('RestaurantScene');
        });
      },
      game: () => {
        if (!this.hasReadRules) {
          this.showToast('Leia as Regras da Casa para Desbloquear!');
          const btnVip = document.getElementById('btn-game');
          if (btnVip) {
            btnVip.style.animation = 'none';
            void btnVip.offsetHeight; // trigger reflow
            btnVip.style.animation = 'shake 0.4s ease';
          }
          return;
        }
        this.startGame();
      },
      market: () => {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          overlay.style.display = 'none';
          overlay.classList.remove('visible');
          this.scene.start('MarketScene');
        });
      },
      host: () => {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          overlay.style.display = 'none';
          overlay.classList.remove('visible');
          this.scene.start('ContactScene');
        });
      }
    };

    // VIP Visibility state
    const btnVip = document.getElementById('btn-game');
    if (btnVip) {
      const img = btnVip.querySelector('img');
      if (img) img.style.opacity = this.hasReadRules ? '1' : '0.4';
    }

    document.querySelectorAll('.grid-item').forEach(el => {
      const actionKey = el.getAttribute('data-action');
      if (actionKey && actions[actionKey]) {
        el.onclick = () => actions[actionKey]();
      }
    });


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
    if (this.birdLayer) this.birdLayer.setPosition(this.currentParallaxX * factor * -1.5, this.currentParallaxY * factor * -1.5);

    const time = Date.now();
    this.birds.forEach(bird => {
        bird.x += bird.speed;
        if (bird.x > this.scale.width + 100) {
            bird.x = -100;
            bird.y = this.scale.height * (0.08 + Math.random() * 0.14); 
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
        const y = height * (0.08 + Math.random() * 0.14);
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

  private animateUnlockSequence() {
    const btnVip = document.getElementById('btn-game');
    if (btnVip) {
      const img = btnVip.querySelector('img');
      if (img) {
        this.tweens.addCounter({
          from: 0.4, to: 1, duration: 1000,
          onUpdate: tween => { img.style.opacity = tween.getValue().toString(); }
        });
      }
      btnVip.style.animation = 'shake 0.8s ease infinite';
      setTimeout(() => { btnVip.style.animation = 'none'; }, 3000);
    }
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
    this.cameras.main.once('camerafadeoutcomplete', () => {
      const overlay = document.getElementById('welcome-overlay');
      if (overlay) {
        overlay.style.display = 'none';
        overlay.classList.remove('visible');
      }
      this.scene.start('CharacterSelect');
    });
  }
}
