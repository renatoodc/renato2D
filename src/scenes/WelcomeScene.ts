import Phaser from 'phaser';

export default class WelcomeScene extends Phaser.Scene {
  private hasReadRules: boolean = false;
  private gameButton!: Phaser.GameObjects.Container;
  private modalContainer: Phaser.GameObjects.Container | null = null;

  // Centralized content for the user to edit
  private ICON_DATA: any = {
    'welcome_rules': {
      title: '📝 REGRAS DA CASA',
      content: `1. Silêncio e Convivência:
Lei do Silêncio: Respeitar o silêncio entre 22h e 08h. O edifício é estritamente residencial e familiar. Multas aplicadas pelo condomínio por excesso de barulho serão de responsabilidade do hóspede.

Proibido Festas/Eventos: Não é permitida a realização de eventos ou reuniões com pessoas que não constem na reserva.

2. Ocupação e Visitas:
Limite de Hóspedes: A capacidade máxima é de 8 pessoas. Apenas hóspedes registrados podem pernoitar. Visitas: Consultar o anfitrião no chat do Airbnb sobre visitas diurnas.

3. Energia e Ventilação:
Consumo Consciente: Ao sair, certifique-se de desligar todas as luzes e ventiladores. Como o apartamento é bem ventilado, manter as janelas abertas durante o dia ajuda a manter o frescor.

4. Cuidados com o Imóvel:
Fumo: É estritamente proibido fumar dentro do imóvel. Areia de Praia: Retirar o excesso ainda na rua/praia. Isso ajuda a manter a limpeza e o bom funcionamento dos ralos. Lixo: O descarte deve ser feito diariamente nos coletores do condomínio.

5. Check-out e Chaves:
Horário: O check-out deve ser respeitado para limpeza. O acesso é via check-in remoto, garantindo sua autonomia.`
    },
    'welcome_game': {
      title: '🎮 GAME PARA CASHBACK',
      content: 'Aproveite nosso jogo exclusivo para ganhar cashback na sua próxima estadia!'
    },
    'welcome_visit': {
      title: '📍 GUIA LOCAL',
      content: 'Clique para abrir nosso Guia Local exclusivo com as melhores praias, pontos turísticos e dicas de Vila Velha!'
    },
    'welcome_bakery': {
      title: '🥐 PADARIAS E CAFÉS',
      content: 'Confira as melhores opções de café da manhã próximas a você.'
    }
  };

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
      { label: 'REGRAS DA CASA', texture: 'welcome_rules', callback: () => this.showModal('welcome_rules') },
      { label: 'GAME PARA CASHBACK', texture: 'welcome_game', callback: () => this.startGame(), locked: true },
      { label: 'Wi-Fi', texture: 'welcome_wifi', callback: () => this.showModal('welcome_wifi') },
      { label: 'LUGARES PARA VISITAR', texture: 'welcome_visit', callback: () => window.open('guia.html', '_blank') },
      { label: 'SUPERMERCADOS', emoji: '🛒', callback: () => this.showModal('supermarket') },
      { label: 'FARMÁCIAS', emoji: '💊', callback: () => this.showModal('pharmacy') },
      { label: 'RESTAURANTES', emoji: '🍴', callback: () => this.showModal('restaurant') },
      { label: 'PADARIAS E CAFÉS', texture: 'welcome_bakery', callback: () => this.showModal('welcome_bakery') },
      { label: 'CHECK IN/OUT', emoji: '🔑', callback: () => this.showModal('check_in_out') },
      { label: 'CONTATO', emoji: '📱', callback: () => this.showModal('contact') }
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

  private showModal(key: string) {
    if (this.modalContainer) return;

    const { width, height } = this.scale;
    const data = this.ICON_DATA[key] || { title: 'INFORMAÇÃO', content: 'Conteúdo em breve...' };

    this.modalContainer = this.add.container(0, 0).setDepth(100);

    // Overlay
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7).setOrigin(0);
    overlay.setInteractive();

    // Card
    const cardWidth = width * 0.8;
    const cardHeight = height * 0.5;
    const card = this.add.graphics();
    card.fillStyle(0xffffff, 1);
    card.fillRoundedRect(width / 2 - cardWidth / 2, height / 2 - cardHeight / 2, cardWidth, cardHeight, 20);

    // Title
    const title = this.add.text(width / 2, height / 2 - cardHeight / 2 + 50, data.title, {
      fontFamily: 'Arial', fontSize: '32px', color: '#e64d5d', fontStyle: 'bold'
    }).setOrigin(0.5);

    // Content Text
    const contentText = this.add.text(width / 2, height / 2 - cardHeight / 2 + 120, data.content, {
      fontFamily: 'Arial', fontSize: '20px', color: '#333333', align: 'left', wordWrap: { width: cardWidth - 100 }
    }).setOrigin(0.5, 0);

    // Close Button
    const btnWidth = 200;
    const btnHeight = 60;
    const closeBtn = this.add.container(width / 2, height / 2 + cardHeight / 2 - 60);
    const btnBg = this.add.graphics().fillStyle(0xe64d5d, 1).fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 10);
    const btnText = this.add.text(0, 0, 'FECHAR', { fontFamily: 'Arial', fontSize: '24px', color: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5);
    closeBtn.add([btnBg, btnText]);
    closeBtn.setInteractive(new Phaser.Geom.Rectangle(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight), Phaser.Geom.Rectangle.Contains);

    closeBtn.on('pointerdown', () => {
      this.tweens.add({
        targets: this.modalContainer,
        alpha: 0,
        duration: 200,
        onComplete: () => {
          this.modalContainer?.destroy();
          this.modalContainer = null;
          if (key === 'welcome_rules') this.unlockGame();
        }
      });
    });

    this.modalContainer.add([overlay, card, title, contentText, closeBtn]);
    this.modalContainer.setAlpha(0);
    this.tweens.add({ targets: this.modalContainer, alpha: 1, duration: 300 });
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
