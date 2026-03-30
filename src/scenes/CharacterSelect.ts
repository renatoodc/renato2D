import Phaser from 'phaser';

export default class CharacterSelect extends Phaser.Scene {
  private selectionCards: Phaser.GameObjects.Rectangle[] = [];
  private confirmBtn!: Phaser.GameObjects.Container;
  private selectedChar: string = '';

  constructor() {
    super('CharacterSelect');
  }

  create() {
    const { width, height } = this.cameras.main;
    const isPortrait = height > width;

    // 1. Background Image with Premium Overlay (Restored to User Preference)
    const bg = this.add.image(width / 2, height / 2, 'menu_bg');
    const scale = Math.max(width / bg.width, height / bg.height);
    bg.setScale(scale).setAlpha(0.6);

    // Dark Gradient Overlay for depth (Restored)
    const overlay = this.add.graphics();
    overlay.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0.4, 0.4, 0.8, 0.8);
    overlay.fillRect(0, 0, width, height);

    // 2. Title Section
    const titleY = isPortrait ? height * 0.15 : height * 0.18;
    const title = this.add.text(width / 2, titleY, 'QUEM É VOCÊ?', {
      fontFamily: 'Montserrat',
      fontSize: isPortrait ? '32px' : '48px',
      fontStyle: 'bold',
      color: '#ffffff',
      letterSpacing: 4
    }).setOrigin(0.5);

    this.tweens.add({
      targets: title,
      y: title.y - 10,
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    this.add.text(width / 2, title.y + (isPortrait ? 40 : 60), 'Escolha seu personagem para explorar', {
      fontFamily: 'Inter',
      fontSize: isPortrait ? '14px' : '18px',
      color: 'rgba(255, 255, 255, 0.7)'
    }).setOrigin(0.5);

    // 3. Character Cards
    const cardScale = isPortrait ? 0.9 : 1.1;
    const centerY = isPortrait ? height * 0.52 : height * 0.55;

    this.selectionCards = [];
    // 🕵️ UI Expert: Visual Balance (Renato 1.3, Renata 0.75)
    // Both characters perfectly synchronized in height
    const cardGap = isPortrait ? 110 : 160;
    this.createCharacterCard(width / 2 - cardGap, centerY, 'RENATO', 'male', 'male_walk', cardScale, 1.3);
    this.createCharacterCard(width / 2 + cardGap, centerY, 'RENATA', 'female', 'female_walk', cardScale, 0.75);

    // 4. Confirm Button
    this.createFooterConfirmButton(width, height, isPortrait);

    // 5. Menu Button
    this.createMenuButton();

    // Handle screen resize
    this.scale.on('resize', () => {
      this.scene.restart();
    });
  }

  private createCharacterCard(x: number, y: number, label: string, spriteKey: string, animKey: string, scaleMul: number, customScale: number) {
    const cardW = 180 * scaleMul;
    const cardH = 220 * scaleMul;
    const container = this.add.container(x, y);

    // Premium Glass Card
    const cardBg = this.add.rectangle(0, 0, cardW, cardH, 0xffffff, 0.15).setOrigin(0.5).setInteractive({ cursor: 'pointer' });
    cardBg.setStrokeStyle(2, 0xffffff, 0.4);
    cardBg.setName(spriteKey);
    this.selectionCards.push(cardBg);

    const nameText = this.add.text(0, -cardH / 2 + 25, label, {
      fontFamily: 'Montserrat',
      fontSize: '18px',
      fontStyle: '900',
      color: '#ffffff',
      letterSpacing: 2
    }).setOrigin(0.5);
    nameText.setShadow(0, 2, 'rgba(0,0,0,0.5)', 4);

    // 🕵️ UI Expert: Anchor to Bottom + Visual Scale Balance
    const charSprite = this.add.sprite(0, cardH / 2, spriteKey, 0)
        .setOrigin(0.5, 1)
        .setScale(customScale * scaleMul);
    
    // 🎭 Precision Masking: Ensure sprite stays INSIDE the glass box
    const maskShape = this.add.graphics();
    maskShape.fillStyle(0xffffff, 1);
    maskShape.fillRoundedRect(x - cardW/2, y - cardH/2, cardW, cardH, 12);
    maskShape.setVisible(false);
    charSprite.setMask(maskShape.createGeometryMask());

    container.add([cardBg, charSprite, nameText]);

    // Selection Glow (Visible only when selected)
    const glow = this.add.graphics();
    glow.lineStyle(4, 0xffcc00, 0.8).strokeRoundedRect(-cardW/2 - 4, -cardH/2 - 4, cardW + 8, cardH + 8, 12);
    glow.setAlpha(0);
    container.add(glow);

    // Interactions
    cardBg.on('pointerover', () => {
      if (this.selectedChar !== spriteKey) {
        cardBg.setStrokeStyle(3, 0xffcc00, 0.8);
        this.tweens.add({ targets: container, scale: 1.08, duration: 250, ease: 'Cubic.easeOut' });
      }
    });

    cardBg.on('pointerout', () => {
      if (this.selectedChar !== spriteKey) {
        cardBg.setStrokeStyle(2, 0xffffff, 0.4);
        this.tweens.add({ targets: container, scale: 1, duration: 200, ease: 'Cubic.easeIn' });
      }
    });

    cardBg.on('pointerdown', () => {
      this.selectedChar = spriteKey;
      
      this.selectionCards.forEach(card => {
        const isSelected = card.name === spriteKey;
        const parent = card.parentContainer as Phaser.GameObjects.Container;
        const g = parent.list[3] as Phaser.GameObjects.Graphics; // Glow index (bg=0, sprite=1, text=2, glow=3)

        card.setFillStyle(0xffffff, isSelected ? 0.25 : 0.15);
        card.setStrokeStyle(isSelected ? 4 : 2, isSelected ? 0xffcc00 : 0xffffff, isSelected ? 1 : 0.4);
        
        if (isSelected) {
            this.tweens.add({ targets: g, alpha: 1, duration: 300 });
            this.tweens.add({ targets: parent, y: y - 10, duration: 600, ease: 'Power2', yoyo: true, repeat: -1 });
        } else {
            this.tweens.add({ targets: g, alpha: 0, duration: 200 });
            this.tweens.killTweensOf(parent);
            this.tweens.add({ targets: parent, y: y, duration: 300 });
        }
      });

      if (animKey) charSprite.play(animKey);

      // Show Confirm with Pro Animation
      this.tweens.add({
        targets: this.confirmBtn,
        alpha: 1,
        y: this.confirmBtn.getData('targetY'),
        duration: 500,
        ease: 'Back.easeOut'
      });
      this.confirmBtn.setInteractive();
    });
  }

  private createFooterConfirmButton(width: number, height: number, isPortrait: boolean) {
    const btnW = Math.min(width * 0.85, 320);
    const btnH = 56;
    const targetY = height - (isPortrait ? 80 : 60);

    this.confirmBtn = this.add.container(width / 2, targetY + 60);
    this.confirmBtn.setAlpha(0).setData('targetY', targetY);

    const btnBg = this.add.graphics();
    // Premium Gradient (ffcc00 to ffaa00)
    btnBg.fillGradientStyle(0xffcc00, 0xffcc00, 0xffaa00, 0xffaa00, 1);
    btnBg.fillRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 20);
    
    // Glossy Highlight
    btnBg.fillStyle(0xffffff, 0.2);
    btnBg.fillRoundedRect(-btnW/2, -btnH/2, btnW, btnH/2, { tl: 20, tr: 20, bl: 0, br: 0 });

    const btnText = this.add.text(0, 0, 'CONFIRMAR E COMEÇAR', {
      fontFamily: 'Montserrat', fontSize: '15px', fontStyle: '900', color: '#1e3c72', letterSpacing: 1.5
    }).setOrigin(0.5);

    this.confirmBtn.add([btnBg, btnText]);
    this.confirmBtn.setSize(btnW, btnH);

    this.confirmBtn.on('pointerdown', () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.registry.set('selectedCharacter', this.selectedChar);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('StoryScene', { character: this.selectedChar });
        this.scene.start('UIScene');
      });
    });

    this.confirmBtn.on('pointerover', () => this.tweens.add({ targets: this.confirmBtn, scale: 1.05, duration: 200 }));
    this.confirmBtn.on('pointerout', () => this.tweens.add({ targets: this.confirmBtn, scale: 1, duration: 200 }));
  }

  private createMenuButton() {
    const x = 20;
    const y = 20;

    const btn = this.add.container(x, y).setDepth(9999);
    
    // Glass Background
    const bg = this.add.graphics();
    bg.fillStyle(0x000000, 0.4).fillRoundedRect(0, 0, 100, 40, 12);
    bg.lineStyle(2, 0xffffff, 0.5).strokeRoundedRect(0, 0, 100, 40, 12);
    
    const txt = this.add.text(50, 20, '🔙 MENU', {
      fontFamily: 'Montserrat',
      fontSize: '14px',
      color: '#ffffff',
      fontStyle: '800'
    }).setOrigin(0.5);

    btn.add([bg, txt]);

    // Explicit hit area for reliability
    btn.setInteractive(new Phaser.Geom.Rectangle(0, 0, 100, 40), Phaser.Geom.Rectangle.Contains);

    btn.on('pointerdown', () => {
      console.log('CHARACTER SELECT MENU CLICK');
      this.tweens.add({ targets: btn, scale: 0.92, duration: 80 });
      
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('WelcomeScene');
      });
    });
  }
}

