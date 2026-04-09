import Phaser from 'phaser';

export default class WelcomeScene extends Phaser.Scene {
  public hasReadRules: boolean = false;
  private background!: Phaser.GameObjects.Image;
  private vignetteLayer!: Phaser.GameObjects.Graphics;
  private mistParticles!: Phaser.GameObjects.Particles.ParticleEmitter;
  private birdLayer!: Phaser.GameObjects.Container;
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
    const { width, height } = this.scale;
    const isPortrait = height > width;

    // 1. Photorealistic Background Integration
    if (this.textures.exists('serrano_bg')) {
        this.background = this.add.image(width / 2, height / 2, 'serrano_bg');
        // Mobile-first scaling: Fill and Center
        const scaleX = width / this.background.width;
        const scaleY = height / this.background.height;
        const scale = Math.max(scaleX, scaleY);
        this.background.setScale(scale);
    } else {
        // Fallback procedural background
        this.createFallbackMountainBackground(width, height);
    }

    // 2. Canyon Vignette & Lighting
    this.vignetteLayer = this.add.graphics();
    // Stronger vignette at the bottom for river reflections and text contrast
    this.vignetteLayer.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0.3, 0.3, 0.7, 0.7);
    this.vignetteLayer.fillRect(0, 0, width, height);
    this.vignetteLayer.setDepth(1);

    // 3. Mist & Interactive Waterfall (Cachoeira) Effect
    this.createMistEffect(width, height);
    this.createWaterfallEffect(width, height);

    this.birdLayer = this.add.container(0, 0).setDepth(10);
    
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
      const logo = this.add.image(width / 2, logoY, 'logo_stayverse').setDepth(20);
      const targetWidth = width * (isPortrait ? (isSmallScreen ? 0.38 : 0.45) : 0.18);
      const responsiveScale = logo.width > 0 ? targetWidth / logo.width : (isPortrait ? 0.3 : 0.4);
      logo.setScale(responsiveScale);
      
      this.tweens.add({
        targets: logo,
        y: logoY - 4,
        duration: 3000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      headerYOffset += isPortrait ? (isSmallScreen ? 0.06 : 0.08) : 0.09;
    }

    const titlePadding = headerYOffset;
    
    // Header 1: EXPERIÊNCIA NA MONTANHA
    this.add.text(width / 2, height * titlePadding, 'EXPERIÊNCIA NA MONTANHA', {
      fontFamily: 'Cinzel', fontSize: isPortrait ? (isSmallScreen ? '10px' : '12px') : '16px', color: '#FDF5E6', fontStyle: 'bold', letterSpacing: isSmallScreen ? 3 : 5
    }).setOrigin(0.5).setAlpha(1).setDepth(20).setStroke('#000000', 3); // Contorno preto para leitura total

    // Header 2: Refúgio Serrano
    const mainTitle = this.add.text(width / 2, height * (titlePadding + 0.07), 'Refúgio Serrano', {
      fontFamily: 'Dancing Script', fontSize: isPortrait ? (isSmallScreen ? '42px' : '52px') : '68px', color: '#FDF5E6', fontStyle: 'bold', letterSpacing: 2
    }).setOrigin(0.5).setDepth(20);
    mainTitle.setStroke('#000000', 6); // Contorno preto forte
    mainTitle.setShadow(2, 4, 'rgba(0,0,0,0.8)', 10);

    // 4. Icons & River Reflections
    const items = [
      { label: 'REGRAS\nDA CASA', emoji: '📜', id: 'welcome_rules', callback: () => this.transitionTo('RulesScene') },
      { label: 'WI-FI\nE STREAMING', emoji: '📶', id: 'welcome_wifi', callback: () => this.transitionTo('WifiScene') },
      { label: 'CHECK-IN / OUT', emoji: '🔑', id: 'check_in_out', callback: () => this.transitionTo('CheckoutScene') },
      { label: 'TRILHAS\n& NATUREZA', emoji: '🌲', id: 'welcome_visit', callback: () => this.transitionTo('LocalGuideScene') },
      { label: 'CAFÉ\n& LAREIRA', emoji: '☕', id: 'welcome_bakery', callback: () => this.transitionTo('BakeryScene') },
      { label: 'GASTRONOMIA\nLOCAL', emoji: '🫕', id: 'restaurant', callback: () => this.transitionTo('RestaurantScene') },
      { label: 'O SEGREDO\nDO CHALÉ', emoji: '🗝️', id: 'welcome_game', callback: () => this.startGame(), locked: true },
      { label: 'EMPÓRIO\n& VINHOS', emoji: '🍷', id: 'welcome_market', callback: () => this.transitionTo('MarketScene') },
      { label: 'CONTATO', emoji: '📞', id: 'welcome_host', callback: () => this.transitionTo('ContactScene') },
    ];

    const cols = isPortrait ? 3 : 5;
    const startY = isPortrait ? (isSmallScreen ? height * 0.30 : height * 0.36) : height * 0.38; 
    const spacingY = isPortrait ? (isSmallScreen ? height * 0.20 : height * 0.22) : height * 0.22; 
    
    items.forEach((item, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      
      const marginX = isPortrait ? (isSmallScreen ? width * 0.12 : width * 0.15) : width * 0.10;
      const availableWidth = width - (marginX * 2);
      const x = marginX + (col * (availableWidth / (cols - 1)));
      const y = startY + row * spacingY;
      
      const wrapWidth = (availableWidth / cols) * 1.1;

      const isGame = item.id === 'welcome_game';
      const isContact = item.id === 'welcome_host';
      const visualLocked = (item.locked && !this.hasReadRules) || (isGame && this.game.registry.get('justUnlocked'));

      // Lógica Híbrida: Tenta buscar a imagem, se não existir usa o emoji
      const textureKey = `icon_${item.id.replace('welcome_', '')}`;
      
      // Ajustes padronizados: Todos levemente maiores (~125px) conforme solicitado
      let customSize = 125;
      let customY = -10;
      let customX = 0; // Inicializar para evitar erro de tela preta

      // O "Segredo do Chalé" fica como estava (não aumenta)
      if (item.id === 'welcome_game') {
          customSize = 120; 
          customY = -12;    
      } else if (item.id === 'welcome_bakery') {
          customSize = 200; // Aumentar ainda mais para visibilidade total
          customY = -25;    
          customX = -5;     // Ajustado de -15 para -5 para centralizar melhor
      }
      
      // Ajustes finos de posição para os que foram pedidos "mais para baixo" antes
      if (item.id === 'welcome_visit' || item.id === 'restaurant') {
          customY = -5; 
      }

      const container = this.createProfessionalIcon(x, y, item.label, !!visualLocked, item.emoji, textureKey, wrapWidth, isGame, isContact, customSize, customY, customX);
      container.setScale(isPortrait && isSmallScreen ? 0.85 : 1);
      if (isGame) this.gameIcon = container;

      // 🌊 Subtile River Reflection for last row icons
      if (row === Math.floor((items.length - 1) / cols)) {
          this.addReflection(container, x, y);
      }

      container.setInteractive(new Phaser.Geom.Circle(0, 0, 50), Phaser.Geom.Circle.Contains);
      container.on('pointerdown', () => {
        if (item.locked && !this.hasReadRules) {
          this.showToast('Leia as Regras da Casa para Desbloquear!');
          const lockIcon = container.getByName('lock_icon');
          if (lockIcon) {
            // Tremor específico no cadeado conforme solicitado (Feedback visual claro)
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

    this.createBirds(width, height);
  }

  private addReflection(parent: Phaser.GameObjects.Container, x: number, y: number) {
      // Create a simplified mirror of the base
      const reflection = this.add.graphics();
      reflection.fillStyle(0xffffff, 0.15);
      reflection.fillEllipse(x, y + 60, 40, 15);
      reflection.setDepth(2);
      
      this.tweens.add({
          targets: reflection,
          scaleX: 1.1,
          alpha: 0.05,
          duration: 2000,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
      });
  }

  private createMistEffect(width: number, height: number) {
      // Create a particle emitter for the mist at the bottom (River mist)
      if (!this.textures.exists('white_pixel')) {
          const graphics = this.make.graphics({ x: 0, y: 0, add: false });
          graphics.fillStyle(0xffffff).fillRect(0, 0, 1, 1);
          graphics.generateTexture('white_pixel', 1, 1);
      }

      this.mistParticles = this.add.particles(0, 0, 'white_pixel', {
          x: { min: 0, max: width },
          y: { min: height * 0.6, max: height },
          scale: { start: 2, end: 15 },
          alpha: { start: 0, end: 0.15, steps: 10 },
          lifespan: 8000,
          speedY: { min: -10, max: -30 },
          speedX: { min: -5, max: 5 },
          frequency: 50,
          blendMode: 'ADD',
          tint: 0xD4AF37 // Golden mist
      });
      this.mistParticles.setDepth(2);
  }

  private createWaterfallEffect(width: number, height: number) {
      if (!this.textures.exists('white_pixel')) {
          const graphics = this.make.graphics({ x: 0, y: 0, add: false });
          graphics.fillStyle(0xffffff).fillRect(0, 0, 1, 1);
          graphics.generateTexture('white_pixel', 1, 1);
      }

      const isPortrait = height > width;
      // Posicionar a cachoeira no centro da tela (onde a imagem da montanha a desenhou)
      const waterfallX = isPortrait ? width * 0.48 : width * 0.5;
      const waterfallWidth = isPortrait ? width * 0.18 : width * 0.12;
      const waterfallStartY = height * 0.18; // Longe do topo (onde fica o logo/títulos)
      const waterfallEndY = height * 0.65; // Base da montanha

      // 🛡️ MÁSCARA CIRÚRGICA (Clip Masking)
      // Criar uma forma geométrica exata apenas no local da cachoeira
      const maskShape = this.make.graphics({ x: 0, y: 0, add: false });
      maskShape.fillStyle(0xffffff, 1);
      // Desenhando o 'Corte Máscara' contido
      maskShape.beginPath();
      maskShape.moveTo(waterfallX - waterfallWidth / 2, waterfallStartY);
      maskShape.lineTo(waterfallX + waterfallWidth / 2, waterfallStartY);
      maskShape.lineTo(waterfallX + waterfallWidth, waterfallEndY);
      maskShape.lineTo(waterfallX - waterfallWidth, waterfallEndY);
      maskShape.closePath();
      maskShape.fillPath();

      const geometryMask = maskShape.createGeometryMask();

      // ⚡ MATRIX CASCADE PARTICLES (Fotorealismo Premium Kinetic)
      const emitter = this.add.particles(0, 0, 'white_pixel', {
          x: { min: waterfallX - waterfallWidth / 1.5, max: waterfallX + waterfallWidth / 1.5 },
          y: { min: waterfallStartY, max: waterfallEndY },
          scale: { start: 1.5, end: 4 }, 
          alpha: { start: 0.8, end: 0, steps: 15 },
          lifespan: 1800,
          speedY: { min: 500, max: 900 }, // Queda densa contida
          speedX: { min: -5, max: 5 },
          frequency: 5, // Denso!
          blendMode: 'ADD',
          tint: [0xcbeef5, 0xaaddee, 0xffffff, 0x88ccff] // Frios, prata e azul-claro
      });
      
      // Contenção do efeito estritamente na queda e preservação Z-Depth
      emitter.setDepth(1); // Escondida atrás da neblina e abaixo do UI (que é 5 e 20)
      emitter.setMask(geometryMask); 

      // Área interativa da cachoeira restrita à coluna de água
      const interactZone = this.add.zone(waterfallX, waterfallStartY, waterfallWidth * 2, waterfallEndY - waterfallStartY).setInteractive();
      interactZone.on('pointermove', (pointer: Phaser.Input.Pointer) => {
          // Vento interativo gerado ao passar o mouse ou dedo
          const wind = (pointer.x - waterfallX) * 2.5;
          emitter.setParticleSpeed(wind, 500);
      });
      interactZone.on('pointerout', () => {
          emitter.setParticleSpeed(0, 500); // Volta ao eixo central
      });
  }

  private transitionTo(sceneName: string) {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start(sceneName));
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

    const factor = 20; 
    if (this.background) {
        this.background.setPosition((this.scale.width / 2) + this.currentParallaxX * factor, (this.scale.height / 2) + this.currentParallaxY * factor);
    }

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
        bird.clear().lineStyle(1.6, 0xD4AF37, 0.4).beginPath();
        bird.moveTo(-14, 0 + (wingVal * 1.5)).lineTo(-7, (10 * wingVal) - 1).lineTo(0, 3).lineTo(7, (10 * wingVal) - 1).lineTo(14, 0 + (wingVal * 1.5)).strokePath();
    });
  }

  private createFallbackMountainBackground(width: number, height: number) {
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0B1A13, 0x0B1A13, 0x1B4332, 0x1B4332, 1);
    bg.fillRect(0, 0, width, height);
  }

  private createBirds(width: number, height: number) {
    this.birds = [];
    for (let i = 0; i < 3; i++) {
        const x = Math.random() * width;
        const y = height * (0.15 + Math.random() * 0.2);
        const bird = this.add.graphics() as any;
        bird.setPosition(x, y);
        bird.speed = 0.2 + Math.random() * 0.2; 
        bird.phase = Math.random() * Math.PI * 2; 
        bird.baseYSine = y;
        this.birds.push(bird);
        this.birdLayer.add(bird);
    }
  }

  private createProfessionalIcon(x: number, y: number, label: string, isLocked: boolean, emoji: string, textureKey: string, wrapWidth: number, isGame: boolean = false, isContact: boolean = false, iconSize: number = 95, offsetY: number = -10, offsetX: number = 0) {
    const container = this.add.container(x, y).setDepth(5);
    const shadow = this.add.graphics().fillStyle(0x000000, 0.4).fillCircle(1, 4, 38);
    container.add(shadow);
    
    const base = this.add.graphics();
    const bgColor = isGame ? 0xffffff : 0x07110c; 
    const bgAlpha = isGame ? 0.35 : 0.85;
    const strokeColor = isGame ? 0xffd700 : 0xB8860B; 

    base.fillStyle(bgColor, bgAlpha).fillCircle(0, 0, 40);
    base.lineStyle(2.5, strokeColor, 0.9).strokeCircle(0, 0, 40); 
    container.add(base);

    // ⚡ Lógica Híbrida Inteligente com Efeito 3D Pop-out
    if (this.textures.exists(textureKey)) {
        // Aumentamos o tamanho para ele "sair" do círculo (Círculo tem ~80px)
        const iconImage = this.add.image(offsetX, offsetY, textureKey).setOrigin(0.5); 
        const iconScale = Math.min(iconSize / iconImage.width, iconSize / iconImage.height);
        iconImage.setScale(iconScale);
        
        // Sombra própria do item para profundidade 3D
        const iconShadow = this.add.image(offsetX, offsetY + 4, textureKey).setOrigin(0.5).setTint(0x000000).setAlpha(0.3).setScale(iconScale);
        container.add(iconShadow);
        container.add(iconImage);
        
        if (isContact) iconImage.setTint(0xffffff);
    } else {
        // Fallback: Se não houver imagem, mantemos o Emoji original
        const iconText = this.add.text(0, 0, emoji, { fontSize: '40px' }).setOrigin(0.5);
        if (isContact) {
            iconText.setShadow(0, 0, '#B8860B', 15);
        } else {
            iconText.setShadow(0, 0, '#000', 8);
        }
        container.add(iconText);
    }

    const isSmallScreen = this.scale.height < 680;
    const labelText = this.add.text(0, isSmallScreen ? 46 : 56, label.toUpperCase(), {
      fontFamily: 'Outfit', fontSize: isSmallScreen ? '13px' : '15px', color: isLocked ? '#7da2a9' : '#ffffff', fontStyle: '900', letterSpacing: 1, align: 'center', wordWrap: { width: wrapWidth, useAdvancedWrap: true }, lineSpacing: -2
    }).setOrigin(0.5, 0);
    labelText.setStroke('#000', 3).setShadow(2, 2, 'rgba(0,0,0,0.8)', 4);
    container.add(labelText);

    if (isLocked) {
      const lock = this.add.text(28, 28, '🔒', { fontSize: '18px' }).setOrigin(0.5).setName('lock_icon');
      lock.setShadow(2, 2, 'rgba(0,0,0,0.8)', 4);
      container.add(lock);
    }

    // Cinemagraph UI Interaction: Micro-rotation & Glow Pulse
    container.on('pointerover', () => {
        this.tweens.add({ 
            targets: container, 
            scale: 1.15, 
            angle: 2, // Micro-rotação de 2 graus
            duration: 250, 
            ease: 'Back.easeOut' 
        });
        this.tweens.add({
            targets: base,
            alpha: bgAlpha + 0.15, // Pulso de luz (glow) no anel de bronze
            duration: 150,
            yoyo: true,
            repeat: 1
        });
    });

    container.on('pointerout', () => {
        this.tweens.add({ 
            targets: container, 
            scale: 1.0, 
            angle: 0, 
            duration: 200, 
            ease: 'Cubic.easeOut' 
        });
        base.setAlpha(bgAlpha);
    });

    return container;
  }

  private showToast(msg: string) {
    const { width, height } = this.scale;
    const toast = this.add.container(width / 2, height + 60).setDepth(100);
    const bg = this.add.graphics().fillStyle(0x07110c, 0.95).lineStyle(1, 0xD4AF37, 0.8).fillRoundedRect(-140, -22, 280, 44, 22).strokeRoundedRect(-140, -22, 280, 44, 22);
    const txt = this.add.text(0, 0, msg, { fontFamily: 'Cinzel', fontSize: '11px', color: '#D4AF37', fontStyle: 'bold' }).setOrigin(0.5);
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

  private animateUnlockSequence() {
    if (!this.gameIcon) return;
    const lock = this.gameIcon.getByName('lock_icon') as Phaser.GameObjects.Text;
    this.tweens.add({
        targets: this.gameIcon, x: this.gameIcon.x + 5, duration: 80, yoyo: true, repeat: 5,
        onComplete: () => {
            this.tweens.add({
                targets: this.gameIcon, scale: 1.4, duration: 400, ease: 'Cubic.easeOut',
                onComplete: () => {
                    if (lock) lock.destroy();
                    this.tweens.add({ targets: this.gameIcon, scale: 1, duration: 600, ease: 'Elastic.easeOut' });
                }
            });
        }
    });
  }
}
