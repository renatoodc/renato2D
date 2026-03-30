import Phaser from 'phaser';

export default class StoryScene extends Phaser.Scene {
  private selectedChar: string = 'male';

  constructor() {
    super('StoryScene');
  }

  init(data: { character: string }) {
    this.selectedChar = data.character || 'male';
  }

  create() {
    const { width, height } = this.scale;

    // 🌅 Cinematic Background - Gradient Sunset (Fallback for high styling)
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x1a2a6c, 0xb21f1f, 0xfdbb2d, 0xfdbb2d, 1);
    bg.fillRect(0, 0, width, height);

    // 🧥 Portrait of the selected character
    this.add.image(width * 0.5, height * 0.5, this.selectedChar === 'male' ? 'male' : 'female', 0)
      .setScale(3.5)
      .setAlpha(0.4);

    // 💎 Glassmorphism Panel
    const panelW = Math.min(width * 0.85, 420);
    const panelH = height * 0.75;
    const panelX = width * 0.5;
    const panelY = height * 0.5;

    const panelBg = this.add.graphics();
    panelBg.fillStyle(0x000000, 0.5);
    panelBg.fillRoundedRect(panelX - panelW / 2, panelY - panelH / 2, panelW, panelH, 30);
    panelBg.lineStyle(2, 0xffffff, 0.2);
    panelBg.strokeRoundedRect(panelX - panelW / 2, panelY - panelH / 2, panelW, panelH, 30);

    // ✍️ Typography & Objectives
    this.add.text(panelX, panelY - panelH / 2 + 60, 'BEM-VINDO À ITAPUÃ', {
      fontFamily: 'Montserrat',
      fontSize: '28px',
      color: '#ffffff',
      fontStyle: '900',
      align: 'center'
    }).setOrigin(0.5);

    this.add.text(panelX, panelY - panelH / 2 + 120, 'Sua jornada começa agora...', {
      fontFamily: 'Montserrat',
      fontSize: '16px',
      color: '#cccccc',
      fontStyle: '500'
    }).setOrigin(0.5);

    const objectives = [
      { icon: '📍', title: 'A ORLA', text: 'Explore o famoso calçadão\ne sinta a energia Capixaba.' },
      { icon: '🏝️', title: 'O ACESSO', text: 'Encontre o caminho de areia\npara chegar até a praia.' },
      { icon: '💎', title: 'TESOUROS', text: 'Vasculhe as conchas na praia\ne ache prêmios instantâneos!' }
    ];

    objectives.forEach((obj, i) => {
      const yPos = panelY - 80 + (i * 100);
      
      this.add.text(panelX - panelW / 2 + 40, yPos, obj.icon, { fontSize: '32px' }).setOrigin(0, 0.5);
      
      this.add.text(panelX - panelW / 2 + 90, yPos - 15, obj.title, {
        fontFamily: 'Montserrat',
        fontSize: '18px',
        color: '#fdbb2d',
        fontStyle: '800'
      }).setOrigin(0, 0.5);

      this.add.text(panelX - panelW / 2 + 90, yPos + 15, obj.text, {
        fontFamily: 'Montserrat',
        fontSize: '14px',
        color: '#ffffff',
        fontStyle: '500',
        lineSpacing: 4
      }).setOrigin(0, 0.5);
    });

    // 🚀 Start Button
    const startButton = this.add.container(panelX, panelY + panelH / 2 - 60);
    const btnBg = this.add.graphics();
    btnBg.fillStyle(0xffffff, 1);
    btnBg.fillRoundedRect(-100, -25, 200, 50, 25);
    
    const btnText = this.add.text(0, 0, 'INICIAR TOUR', {
      fontFamily: 'Montserrat',
      fontSize: '18px',
      color: '#000000',
      fontStyle: '900'
    }).setOrigin(0.5);

    startButton.add([btnBg, btnText]);
    startButton.setSize(200, 50).setInteractive({ useHandCursor: true });

    // 🪄 Pulse Animation for Button
    this.tweens.add({
      targets: startButton,
      scale: 1.05,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    startButton.on('pointerdown', () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('GameScene');
      });
    });

    // 🎬 Fade In
    this.cameras.main.fadeIn(500, 0, 0, 0);
  }
}
