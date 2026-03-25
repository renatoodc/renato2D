import Phaser from 'phaser';

export default class WelcomeScene extends Phaser.Scene {
  private hasReadRules: boolean = false;
  private gameButton!: Phaser.GameObjects.Container;

  constructor() {
    super('WelcomeScene');
  }

  create() {
    const { width, height } = this.scale;
    
    // Background - Red/Pink tone from image
    this.add.rectangle(0, 0, width, height, 0xe64d5d).setOrigin(0);

    // Header text
    this.add.text(width / 2, height * 0.08, 'CARO HÓSPEDE', {
      fontFamily: 'Arial', fontSize: '36px', color: '#ffffff', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.16, 'Bem-vindo!', {
      fontFamily: 'Arial', fontSize: '72px', color: '#ffffff', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.24, 'CLIQUE NOS ÍCONES', {
      fontFamily: 'Arial', fontSize: '28px', color: '#ffffff', fontStyle: 'bold'
    }).setOrigin(0.5);

    // Icons Grid configuration - 10 icons in 2 rows of 5
    const cols = 5;
    const spacingX = width * 0.18;
    const spacingY = height * 0.22;
    const startX = width / 2 - (spacingX * 2);
    const startY = height * 0.48;

    const items = [
      { label: 'REGRAS DA CASA', texture: 'welcome_rules', callback: () => this.unlockGame() },
      { label: 'GAME PARA CASHBACK', texture: 'welcome_game', callback: () => this.startGame(), locked: true },
      { label: 'Wi-Fi', texture: 'welcome_wifi' },
      { label: 'LUGARES PARA VISITAR', texture: 'welcome_visit' },
      { label: 'SUPERMERCADOS', emoji: '🛒' },
      { label: 'FARMÁCIAS', emoji: '💊' },
      { label: 'RESTAURANTES', emoji: '🍴' },
      { label: 'PADARIAS E CAFÉS', texture: 'welcome_bakery' },
      { label: 'CHECK IN/OUT', emoji: '🔑' },
      { label: 'CONTATO', emoji: '📱' }
    ];

    items.forEach((item: any, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = startX + col * spacingX;
      const y = startY + row * spacingY;

      const container = this.createIcon(x, y, item.label, item.locked, item.texture, item.emoji);
      
      if (item.texture === 'welcome_game') this.gameButton = container;

      // Always set interactive, check state in callback
      container.setInteractive(new Phaser.Geom.Rectangle(-60, -60, 120, 160), Phaser.Geom.Rectangle.Contains);
      container.on('pointerdown', () => {
        if (item.locked && !this.hasReadRules) {
            this.showInfo('Bloqueado! Leia as Regras da Casa primeiro para liberar o game.');
            // Jiggle effect
            this.tweens.add({ targets: container, x: x + 5, yoyo: true, duration: 50, repeat: 3 });
            return;
        }
        if (item.callback) item.callback();
        else this.showInfo(item.label);
      });
    });
  }

  private createIcon(x: number, y: number, label: string, isLocked: boolean = false, texture?: string, emoji?: string) {
    const container = this.add.container(x, y);
    
    // Always draw the white circle background
    const circle = this.add.graphics();
    circle.lineStyle(3, 0xffffff);
    circle.strokeCircle(0, 0, 50);
    circle.fillStyle(0xffffff, 0.4); // Lighter background as requested
    circle.fillCircle(0, 0, 48);
    container.add(circle);

    if (texture && this.textures.exists(texture)) {
        const icon = this.add.image(0, 0, texture).setDisplaySize(96, 96);
        
        // Apply a circular mask to hide the pink square background of the generated assets
        const maskGraphics = this.make.graphics({ x, y });
        maskGraphics.fillStyle(0xffffff);
        maskGraphics.fillCircle(0, 0, 48);
        const mask = maskGraphics.createGeometryMask();
        icon.setMask(mask);
        
        container.add(icon);
    } else {
        const iconText = this.add.text(0, 0, emoji || '🏠', { fontSize: '40px' }).setOrigin(0.5);
        container.add(iconText);
    }

    const labelText = this.add.text(0, 70, label, {
      fontFamily: 'Arial', fontSize: '18px', color: '#ffffff', align: 'center', wordWrap: { width: 140 }
    }).setOrigin(0.5);

    container.add(labelText);

    if (isLocked) {
        // Keep visible as per user request, but logic handles the block
    }

    // Hover effect
    container.on('pointerover', () => {
        if (!isLocked || this.hasReadRules) this.tweens.add({ targets: container, scale: 1.1, duration: 100 });
    });
    container.on('pointerout', () => {
        this.tweens.add({ targets: container, scale: 1.0, duration: 100 });
    });

    return container;
  }

  private unlockGame() {
    if (this.hasReadRules) return;
    this.hasReadRules = true;
    this.gameButton.setAlpha(1);
    
    this.showInfo('Regras da Casa: Lidas!');
    
    // Visual feedback for unlock
    this.tweens.add({
      targets: this.gameButton,
      scale: 1.2,
      yoyo: true,
      duration: 300
    });
  }

  private startGame() {
    this.scene.start('CharacterSelect');
  }

  private showInfo(msg: string) {
    const { width, height } = this.scale;
    
    // Create a toast message container
    const toast = this.add.container(width / 2, height * 0.9);
    
    const bg = this.add.graphics();
    bg.fillStyle(0x000000, 0.7);
    const padding = 20;
    
    const text = this.add.text(0, 0, msg, {
        fontFamily: 'Arial', fontSize: '24px', color: '#ffffff', align: 'center', backgroundColor: 'transparent'
    }).setOrigin(0.5);
    
    bg.fillRoundedRect(-text.width / 2 - padding, -text.height / 2 - 10, text.width + padding * 2, text.height + 20, 10);
    
    toast.add([bg, text]);
    toast.setAlpha(0);
    
    // Fade in and out
    this.tweens.add({
        targets: toast,
        alpha: 1,
        y: height * 0.85,
        duration: 300,
        ease: 'Power2',
        onComplete: () => {
            this.time.delayedCall(2000, () => {
                this.tweens.add({
                    targets: toast,
                    alpha: 0,
                    y: height * 0.8,
                    duration: 300,
                    onComplete: () => toast.destroy()
                });
            });
        }
    });
  }
}
