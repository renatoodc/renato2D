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
      content: 'Aproveite nosso jogo exclusivo para ganhar cashback na sua próxima estadia! Você poderá explorar a cidade, encontrar itens raros e desbloquear prêmios reais para sua próxima reserva.\n\nRegras do Game:\n- Colete 5 moedas para ganhar 5% de desconto.\n- Encontre a concha dourada para um bônus surpresa!\n- Divirta-se respeitando os limites do mapa.'
    },
    'welcome_visit': {
      title: '📍 GUIA LOCAL',
      content: 'Clique para abrir nosso Guia Local exclusivo com as melhores praias, pontos turísticos e dicas de Vila Velha!\n\nRecomendações:\n1. Convento da Penha: Vista panorâmica incrível.\n2. Praia da Costa: Ótima para banho e caminhadas.\n3. Morro do Moreno: Trilhas e pôr do sol espetacular.\n4. Museu da Vale: Cultura e história ferroviária.'
    },
    'welcome_bakery': {
      title: '🥐 PADARIAS E CAFÉS',
      content: 'Confira as melhores opções de café da manhã próximas a você.\n\n- Padaria Monte Líbano: A mais tradicional, com buffet completo.\n- Café do Centro: Ideal para um café rápido e artesanal.\n- Doceria Gourmet: Bolos e doces incríveis para o seu final de tarde.'
    },
    'welcome_wifi': {
      title: '📶 WI-FI',
      content: 'Conecte-se e aproveite sua estadia!\n\nRede: Loga 201\nSenha: miguel10\n\nA rede suporta alta velocidade para streaming e trabalho remoto.'
    },
    'supermarket': {
      title: '🛒 SUPERMERCADOS',
      content: 'Opções próximas para suas compras:\n\n- Supermercado Carone: Completo e com adega.\n- Hortifruti: Frutas e verduras sempre frescas.\n- Farmácia e Conveniência: Aberto 24h para emergências.'
    },
    'pharmacy': {
      title: '💊 FARMÁCIAS',
      content: 'Em caso de necessidade:\n\n- Farmácia Pague Menos (24h)\- Drogaria São Paulo\n- Farmácia local na esquina do prédio.'
    },
    'restaurant': {
      title: '🍴 RESTAURANTES',
      content: 'Sabores da região:\n\n- Cantina Italiana: Massas frescas.\n- Peixaria do Porto: Especialidade em frutos do mar e moqueca capixaba.\n- Hamburgueria Artesanal: Opção rápida e deliciosa.'
    },
    'check_in_out': {
      title: '🔑 CHECK IN/OUT',
      content: 'Informações importantes:\n\nCheck-in: A partir das 14:00. O acesso é via código digital enviado previamente.\n\nCheck-out: Até às 11:00. Por favor, deixe as chaves na caixa de segurança se houver, ou apenas feche a porta digital.'
    },
    'contact': {
      title: '📱 CONTATO',
      content: 'Estamos aqui para ajudar!\n\nAnfitrião: [NOME]\nWhatsApp: [NUMERO]\n\nEmergências do Prédio: [NUMERO_PORTARIA]'
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
      { label: 'SUPERMERCADOS', emoji: '🛒', callback: () => window.open('supermercados.html', '_blank') },
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

    // Overlay with fade
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0)
      .setOrigin(0)
      .setInteractive();
    
    this.tweens.add({ targets: overlay, fillAlpha: 0.6, duration: 300 });

    // Modal sizing
    const isMobile = width < 600;
    const cardWidth = isMobile ? width * 0.9 : Math.min(width * 0.6, 600);
    const cardHeight = isMobile ? height * 0.7 : Math.min(height * 0.8, 700);
    const cardX = width / 2 - cardWidth / 2;
    const cardY = height / 2 - cardHeight / 2;

    // Card background with Glassmorphism
    const cardBg = this.add.graphics();
    // Shadow
    cardBg.fillStyle(0x000000, 0.2);
    cardBg.fillRoundedRect(cardX + 5, cardY + 5, cardWidth, cardHeight, 24);
    // Main background (semi-transparent)
    cardBg.fillStyle(0xffffff, 0.9);
    cardBg.fillRoundedRect(cardX, cardY, cardWidth, cardHeight, 24);
    // Border
    cardBg.lineStyle(2, 0xe64d5d, 0.4);
    cardBg.strokeRoundedRect(cardX, cardY, cardWidth, cardHeight, 24);

    // Close Icon (X) in top right
    const closeX = cardX + cardWidth - 40;
    const closeY = cardY + 40;
    const closeIcon = this.add.container(closeX, closeY);
    const closeCircle = this.add.graphics().fillStyle(0xf5f5f5, 1).fillCircle(0, 0, 20);
    const closeText = this.add.text(0, 0, '✕', { fontSize: '24px', color: '#333', fontStyle: 'bold' }).setOrigin(0.5);
    closeIcon.add([closeCircle, closeText]);
    closeIcon.setInteractive(new Phaser.Geom.Circle(0, 0, 20), Phaser.Geom.Circle.Contains);
    closeIcon.on('pointerover', () => closeCircle.clear().fillStyle(0xffcccc, 1).fillCircle(0, 0, 20));
    closeIcon.on('pointerout', () => closeCircle.clear().fillStyle(0xf5f5f5, 1).fillCircle(0, 0, 20));
    closeIcon.on('pointerdown', () => closeModal());

    // Title (Static)
    const title = this.add.text(width / 2, cardY + 60, data.title, {
      fontFamily: 'Montserrat, Arial', 
      fontSize: isMobile ? '26px' : '34px', 
      color: '#e64d5d', 
      fontStyle: 'bold',
      align: 'center'
    }).setOrigin(0.5);

    // Separator Line
    const separator = this.add.graphics();
    separator.lineStyle(1, 0x000000, 0.1);
    separator.lineBetween(cardX + 40, cardY + 105, cardX + cardWidth - 40, cardY + 105);

    // Scrollable Content Area
    const margin = 40;
    const contentWidth = cardWidth - (margin * 2);
    const viewY = cardY + 125;
    const viewHeight = cardHeight - (viewY - cardY) - 40; 

    const contentContainer = this.add.container(width / 2, viewY);
    
    // Content Text
    const contentText = this.add.text(0, 0, data.content, {
      fontFamily: 'Inter, Arial', 
      fontSize: isMobile ? '18px' : '20px', 
      color: '#2d3436', 
      align: 'left', 
      wordWrap: { width: contentWidth },
      lineSpacing: 12
    }).setOrigin(0.5, 0);

    contentContainer.add(contentText);

    // Mask for scrolling (with rounded bottom to match card)
    const maskShape = this.make.graphics({ x: 0, y: 0 });
    maskShape.fillStyle(0xffffff);
    maskShape.fillRoundedRect(cardX + margin, viewY, contentWidth, viewHeight, { tl: 0, tr: 0, bl: 20, br: 20 });
    const mask = maskShape.createGeometryMask();
    contentContainer.setMask(mask);

    // Scrolling Logic
    let currentY = 0;
    const minHeight = viewHeight;
    const totalHeight = contentText.height;
    const maxScroll = Math.max(0, totalHeight - minHeight);

    const updateScroll = (delta: number) => {
      currentY = Phaser.Math.Clamp(currentY + delta, -maxScroll, 0);
      contentText.y = currentY;
      
      // Update scrollbar
      if (maxScroll > 0) {
        const scrollRatio = Math.abs(currentY) / maxScroll;
        const barHeight = (viewHeight / totalHeight) * viewHeight;
        const barRange = viewHeight - barHeight;
        scrollbarThumb.y = viewY + (scrollRatio * barRange);
      }
    };

    // Scrollbar Visual
    const scrollbarBg = this.add.graphics();
    const scrollbarThumb = this.add.graphics();
    if (maxScroll > 0) {
      scrollbarBg.fillStyle(0x000000, 0.05);
      scrollbarBg.fillRoundedRect(cardX + cardWidth - 15, viewY, 6, viewHeight, 3);
      
      const barHeight = (viewHeight / totalHeight) * viewHeight;
      scrollbarThumb.fillStyle(0xe64d5d, 0.7);
      scrollbarThumb.fillRoundedRect(cardX + cardWidth - 15, 0, 6, barHeight, 3);
      scrollbarThumb.y = viewY;
    }

    // Input Events for Scrolling
    overlay.on('wheel', (_pointer: any, _over: any, _deltaX: number, deltaY: number) => {
      updateScroll(-deltaY * 0.5);
    });

    let isDragging = false;
    let lastP: number = 0;

    overlay.on('pointerdown', (p: any) => {
        isDragging = true;
        lastP = p.y;
    });

    this.input.on('pointermove', (p: any) => {
        if (!isDragging) return;
        const delta = p.y - lastP;
        lastP = p.y;
        updateScroll(delta);
    });

    this.input.on('pointerup', () => {
        isDragging = false;
    });

    // Close Action
    const closeModal = () => {
      this.tweens.add({
        targets: this.modalContainer,
        alpha: 0,
        y: 20,
        duration: 300,
        ease: 'Back.easeIn',
        onComplete: () => {
          this.modalContainer?.destroy();
          this.modalContainer = null;
          if (key === 'welcome_rules') this.unlockGame();
          // Remove global move/up listeners
          this.input.off('pointermove');
          this.input.off('pointerup');
        }
      });
    };

    // Add everything to main container
    this.modalContainer.add([overlay, cardBg, title, separator, contentContainer, closeIcon]);
    if (maxScroll > 0) this.modalContainer.add([scrollbarBg, scrollbarThumb]);

    // Initial Animation
    this.modalContainer.setAlpha(0);
    this.modalContainer.y = -20;
    this.tweens.add({
      targets: this.modalContainer,
      alpha: 1,
      y: 0,
      duration: 400,
      ease: 'Back.easeOut'
    });
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
