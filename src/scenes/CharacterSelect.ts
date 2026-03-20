import Phaser from 'phaser';

export default class CharacterSelect extends Phaser.Scene {
  private selectionCards: Phaser.GameObjects.Rectangle[] = [];
  private confirmBtn!: Phaser.GameObjects.Container;
  private selectedChar: string = '';

  constructor() {
    super('CharacterSelect');
  }

  create() {
    // Clear any previous UI layer contents
    const uiLayer = document.getElementById('ui-layer');
    if (uiLayer) uiLayer.innerHTML = '';

    const { width, height } = this.cameras.main;
    const isPortrait = height > width;

    // 1. Background Image (Beach Scene)
    const bg = this.add.image(width / 2, height / 2, 'menu_bg');
    const scaleX = width / bg.width;
    const scaleY = height / bg.height;
    const scaleHeight = Math.max(scaleX, scaleY);
    bg.setScale(scaleHeight).setAlpha(0.8);

    // 2. Dark Overlay for Contrast
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.4);

    // 3. Title Section
    const titleY = isPortrait ? height * 0.12 : height * 0.15;
    const titleSize = isPortrait ? '28px' : '48px';
    const subTitleSize = isPortrait ? '14px' : '18px';

    const title = this.add.text(width / 2, titleY, 'COMECE SUA ESTADIA', {
      fontFamily: 'Fredoka',
      fontSize: titleSize,
      fontStyle: 'bold',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);
    
    // Subtle float animation for title
    this.tweens.add({
      targets: title,
      y: title.y - 8,
      duration: 2500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    this.add.text(width / 2, titleY + (isPortrait ? 35 : 60), 'Escolha seu personagem para explorar', {
      fontFamily: 'Inter',
      fontSize: subTitleSize,
      color: '#ffffff'
    }).setOrigin(0.5);

    // 4. Character Cards (Responsive Positioning)
    const cardScale = isPortrait ? 0.8 : 1;
    const spacing = isPortrait ? Math.min(height * 0.32, 220) : 260;
    const centerY = isPortrait ? height * 0.5 : height * 0.52;

    this.selectionCards = [];
    if (isPortrait) {
      this.createCharacterCard(width / 2, centerY - spacing/2, 'Male', 'male', 'male_select', cardScale);
      this.createCharacterCard(width / 2, centerY + spacing/2, 'Female', 'female', 'female_select', cardScale);
    } else {
      this.createCharacterCard(width / 2 - 140 * cardScale, centerY, 'Male', 'male', 'male_select', cardScale);
      this.createCharacterCard(width / 2 + 140 * cardScale, centerY, 'Female', 'female', 'female_select', cardScale);
    }

    // 5. Footer Confirm Button
    this.createFooterConfirmButton(width, height, isPortrait);

    // Handle screen resize
    this.scale.on('resize', () => {
      this.scene.restart();
    });
  }

  private createCharacterCard(x: number, y: number, label: string, spriteKey: string, animKey: string, scaleMul: number) {
    const cardW = 190 * scaleMul;
    const cardH = 210 * scaleMul;

    const cardContainer = this.add.container(x, y);

    // Glassmorphism Card (Layered rectangles for depth)
    const shadow = this.add.rectangle(5, 5, cardW, cardH, 0x000000, 0.3).setOrigin(0.5);
    const cardBg = this.add.rectangle(0, 0, cardW, cardH, 0xffffff, 0.12).setOrigin(0.5).setInteractive({ cursor: 'pointer' });
    cardBg.setStrokeStyle(2, 0xffffff, 0.4);
    cardBg.setName(spriteKey); // To identify which card is selected
    this.selectionCards.push(cardBg);
    
    // Gradient overlay inside the card to help text contrast
    const cardOverlay = this.add.rectangle(0, 0, cardW, cardH, 0x000000, 0.2).setOrigin(0.5);

    const nameText = this.add.text(0, -cardH / 2 + 25 * scaleMul, label, {
      fontFamily: 'Fredoka',
      fontSize: (22 * scaleMul) + 'px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0.5);

    const charSprite = this.add.sprite(0, 10 * scaleMul, spriteKey, 0);
    
    // Fit sprite to card height (approx 140px safe height for sprite)
    const targetCharHeight = 130 * scaleMul;
    const charScale = targetCharHeight / charSprite.height;
    charSprite.setScale(charScale);

    cardContainer.add([shadow, cardBg, cardOverlay, charSprite, nameText]);

    // Small selection indicator (hidden initially)
    const indicator = this.add.circle(cardW/2 - 15, -cardH/2 + 15, 8, 0x14B8A6, 0).setOrigin(0.5);
    indicator.setName('indicator');
    cardContainer.add(indicator);

    // Interactions
    cardBg.on('pointerover', () => {
      if (this.selectedChar !== spriteKey) {
        cardBg.setStrokeStyle(3, 0xffffff, 0.8);
        this.tweens.add({ targets: cardContainer, scale: 1.05, duration: 200 });
      }
    });

    cardBg.on('pointerout', () => {
      if (this.selectedChar !== spriteKey) {
        cardBg.setStrokeStyle(2, 0xffffff, 0.4);
        this.tweens.add({ targets: cardContainer, scale: 1, duration: 200 });
      }
    });

    cardBg.on('pointerdown', () => {
      this.selectedChar = spriteKey;
      
      // Update all cards and indicators
      this.selectionCards.forEach(card => {
        const isSelected = card.name === spriteKey;
        card.setFillStyle(0xffffff, isSelected ? 0.3 : 0.12);
        card.setStrokeStyle(isSelected ? 4 : 2, isSelected ? 0x14B8A6 : 0xffffff, isSelected ? 1 : 0.4);
        
        // Find indicator in the parent container
        const parent = card.parentContainer as Phaser.GameObjects.Container;
        const ind = parent.getByName('indicator') as Phaser.GameObjects.Arc;
        if (ind) ind.setAlpha(isSelected ? 1 : 0);
      });

      // Character specific animation triggers
      if (animKey) {
          charSprite.play(animKey);
      }

      // Activate Confirm Button
      this.tweens.add({
        targets: this.confirmBtn,
        alpha: 1,
        scale: 1,
        duration: 300,
        ease: 'Back.easeOut'
      });
      this.confirmBtn.setInteractive();
    });
  }

  private createFooterConfirmButton(width: number, height: number, isPortrait: boolean) {
    const btnW = Math.min(width * 0.85, 300);
    const btnH = 50;

    // Center of footer area
    const footerY = height - (isPortrait ? 80 : 60);
    this.confirmBtn = this.add.container(width / 2, footerY); 
    this.confirmBtn.setAlpha(0).setScale(0.8);

    const btnBg = this.add.graphics();
    btnBg.fillStyle(0x14B8A6, 1);
    btnBg.fillRoundedRect(-btnW/2, -btnH/2, btnW, btnH, 12);
    
    const btnText = this.add.text(0, 0, 'CONFIRMAR E COMEÇAR', {
      fontFamily: 'Inter',
      fontSize: isPortrait ? '14px' : '16px',
      fontStyle: 'bold',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.confirmBtn.add([btnBg, btnText]);
    this.confirmBtn.setSize(btnW, btnH).setInteractive({ cursor: 'pointer' });

    this.confirmBtn.on('pointerdown', () => {
      this.cameras.main.flash(400, 20, 184, 166);
      this.registry.set('selectedCharacter', this.selectedChar);
      this.time.delayedCall(400, () => {
        this.scene.start('GameScene');
        this.scene.start('UIScene');
      });
    });

    this.confirmBtn.on('pointerover', () => {
        this.tweens.add({ targets: this.confirmBtn, scale: 1.05, duration: 100 });
    });

    this.confirmBtn.on('pointerout', () => {
        this.tweens.add({ targets: this.confirmBtn, scale: 1, duration: 100 });
    });
  }
}
