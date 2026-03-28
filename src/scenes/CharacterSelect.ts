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

    // 1. Background Image with Premium Overlay
    const bg = this.add.image(width / 2, height / 2, 'menu_bg');
    const scale = Math.max(width / bg.width, height / bg.height);
    bg.setScale(scale).setAlpha(0.6);

    // Dark Gradient Overlay for depth
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
    const spacing = isPortrait ? height * 0.3 : 280;
    const centerY = isPortrait ? height * 0.52 : height * 0.55;

    this.selectionCards = [];
    if (isPortrait) {
      this.createCharacterCard(width / 2, centerY - spacing / 0.9, 'RENATO', 'male', 'male_walk', cardScale);
      this.createCharacterCard(width / 2, centerY + spacing / 1.8, 'RENATA', 'female', 'female_walk', cardScale);
    } else {
      this.createCharacterCard(width / 2 - 160, centerY, 'RENATO', 'male', 'male_walk', cardScale);
      this.createCharacterCard(width / 2 + 160, centerY, 'RENATA', 'female', 'female_walk', cardScale);
    }

    // 4. Confirm Button
    this.createFooterConfirmButton(width, height, isPortrait);

    // Handle screen resize
    this.scale.on('resize', () => {
      this.scene.restart();
    });
  }

  private createCharacterCard(x: number, y: number, label: string, spriteKey: string, animKey: string, scaleMul: number) {
    const cardW = 180 * scaleMul;
    const cardH = 220 * scaleMul;
    const container = this.add.container(x, y);

    // Premium Glass Card
    const cardBg = this.add.rectangle(0, 0, cardW, cardH, 0xffffff, 0.12).setOrigin(0.5).setInteractive({ cursor: 'pointer' });
    cardBg.setStrokeStyle(1.5, 0xffffff, 0.3);
    cardBg.setName(spriteKey);
    this.selectionCards.push(cardBg);

    const nameText = this.add.text(0, -cardH / 2 + 30, label, {
      fontFamily: 'Montserrat',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#ffffff',
      letterSpacing: 2
    }).setOrigin(0.5);

    const charSprite = this.add.sprite(0, 20, spriteKey, 0).setScale(1.8 * scaleMul);

    container.add([cardBg, charSprite, nameText]);

    // Indicator
    const indicator = this.add.circle(0, cardH / 2 - 20, 4, 0xff5a5f, 0).setOrigin(0.5);
    indicator.setName('indicator');
    container.add(indicator);

    // Interactions
    cardBg.on('pointerover', () => {
      if (this.selectedChar !== spriteKey) {
        cardBg.setStrokeStyle(2, 0xffffff, 0.8);
        this.tweens.add({ targets: container, scale: 1.05, duration: 200 });
      }
    });

    cardBg.on('pointerout', () => {
      if (this.selectedChar !== spriteKey) {
        cardBg.setStrokeStyle(1.5, 0xffffff, 0.3);
        this.tweens.add({ targets: container, scale: 1, duration: 200 });
      }
    });

    cardBg.on('pointerdown', () => {
      this.selectedChar = spriteKey;
      this.selectionCards.forEach(card => {
        const isSelected = card.name === spriteKey;
        card.setFillStyle(0xffffff, isSelected ? 0.25 : 0.12);
        card.setStrokeStyle(isSelected ? 3 : 1.5, isSelected ? 0xff5a5f : 0xffffff, isSelected ? 1 : 0.3);
        
        const parent = card.parentContainer as Phaser.GameObjects.Container;
        const ind = parent.getByName('indicator') as Phaser.GameObjects.Arc;
        if (ind) ind.setAlpha(isSelected ? 1 : 0);
      });

      if (animKey) charSprite.play(animKey);

      // Show Confirm
      this.tweens.add({
        targets: this.confirmBtn,
        alpha: 1,
        y: this.confirmBtn.getData('targetY'),
        duration: 400,
        ease: 'Back.easeOut'
      });
      this.confirmBtn.setInteractive();
    });
  }

  private createFooterConfirmButton(width: number, height: number, isPortrait: boolean) {
    const btnW = Math.min(width * 0.85, 320);
    const btnH = 56;
    const targetY = height - (isPortrait ? 80 : 60);

    this.confirmBtn = this.add.container(width / 2, targetY + 50);
    this.confirmBtn.setAlpha(0).setData('targetY', targetY);

    const btnBg = this.add.graphics();
    btnBg.fillStyle(0xff5a5f, 1);
    btnBg.fillRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 16);

    const btnText = this.add.text(0, 0, 'CONFIRMAR E COMEÇAR', {
      fontFamily: 'Montserrat', fontSize: '14px', fontStyle: 'bold', color: '#ffffff', letterSpacing: 1
    }).setOrigin(0.5);

    this.confirmBtn.add([btnBg, btnText]);
    this.confirmBtn.setSize(btnW, btnH);

    this.confirmBtn.on('pointerdown', () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.registry.set('selectedCharacter', this.selectedChar);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('GameScene');
        this.scene.start('UIScene');
      });
    });

    this.confirmBtn.on('pointerover', () => this.tweens.add({ targets: this.confirmBtn, scale: 1.05, duration: 200 }));
    this.confirmBtn.on('pointerout', () => this.tweens.add({ targets: this.confirmBtn, scale: 1, duration: 200 }));
  }
}

