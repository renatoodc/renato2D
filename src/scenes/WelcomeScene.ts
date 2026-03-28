import Phaser from 'phaser';

export default class WelcomeScene extends Phaser.Scene {
  private hasReadRules: boolean = false;
  private gameButton!: Phaser.GameObjects.Container;
  private modalContainer: Phaser.GameObjects.Container | null = null;
  private domModal: Phaser.GameObjects.DOMElement | null = null;

  // Centralized content - updated for clarity
  private ICON_DATA: any = {
    'welcome_rules': {
      title: 'Regras da Casa',
      content: `1. Silêncio e Convivência:

Lei do Silêncio: Respeitar o silêncio entre 22h e 08h. O edifício é estritamente residencial e familiar. Multas aplicadas pelo condomínio por excesso de barulho serão de responsabilidade do hóspede.

Proibido Festas/Eventos: Não é permitida a realização de grandes eventos ou reuniões com pessoas que não constem na reserva.


2. Ocupação e Visitas:

Limite de Hóspedes: A capacidade máxima é de 8 pessoas. Apenas hóspedes registrados podem pernoitar.

Visitas: Consultar o anfitrião no chat do Airbnb sobre visitas diurnas.


3. Energia e Ventilação:

Consumo Consciente: Ao sair, certifique-se de desligar todas as luzes e ventiladores. Como o apartamento é bem ventilado, manter as janelas abertas durante o dia ajuda a manter o frescor.


4. Cuidados com o Imóvel:

Fumo: É estritamente proibido fumar dentro do imóvel. O fumo é permitido na área externa do condomínio.

Areia de Praia: Como não possuímos chuveiro no prédio, pedimos a gentileza de retirar o excesso de areia ainda na rua/praia. Isso ajuda a manter a limpeza e o bom funcionamento dos ralos.

Lixo: Por gentileza, o descarte deve ser feito preferencialmete diariamente ou ao final de sua reserva, nos coletores do condomínio, localizados à direita do portão da garagem.


5. Check-out e Chaves:

Horário: O horário de check-out deve ser respeitado para que nossa equipe de limpeza possa preparar o imóvel para o próximo hóspede.`
    },
    'welcome_game': {
      title: '🎮 GAME PARA CASHBACK',
      content: 'Aproveite nosso jogo exclusivo para ganhar cashback na sua próxima estadia!...'
    },
    'welcome_wifi': {
      title: '📶 WI-FI',
      content: 'Conecte-se e aproveite sua estadia!\n\nRede: Loga 201\nSenha: miguel10'
    },
    'welcome_visit': {
      title: '📍 GUIA LOCAL',
      content: 'Clique para abrir nosso Guia Local exclusivo com as melhores praias...'
    },
    'welcome_bakery': {
      title: '🥐 PADARIAS E CAFÉS',
      content: 'Confira as melhores opções de café da manhã próximas a você.'
    },
    'pharmacy': {
      title: '💊 FARMÁCIAS',
      content: 'Em caso de necessidade:\n- Farmácia Pague Menos (24h)\n- Drogaria São Paulo'
    },
    'restaurant': {
      title: '🍽️ RESTAURANTES', // Robust emoji
      content: 'Sabores da região:\n- Cantina Italiana\n- Peixaria do Porto'
    },
    'check_in_out': {
      title: '🔑 CHECK-OUT',
      content: 'Check-in: A partir das 14:00.\nCheck-out: Até às 11:00.'
    },
    'contact': {
      title: '📱 CONTATO',
      content: 'Anfitrião: Renato\nWhatsApp: (27) 99999-9999'
    }
  };

  constructor() {
    super('WelcomeScene');
  }

  create() {
    const { width, height } = this.scale;
    const isPortrait = height > width;

    // 1. Unified Backdrop
    const bg = this.add.graphics();
    bg.fillGradientStyle(0xff5a5f, 0xff5a5f, 0xe64d5d, 0xe64d5d, 1);
    bg.fillRect(0, 0, width, height);
    
    const gradientOverlay = this.add.graphics();
    gradientOverlay.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0.0, 0.0, 0.4, 0.4);
    gradientOverlay.fillRect(0, 0, width, height);

    // 2. Header Section
    const titlePadding = isPortrait ? 0.08 : 0.05;
    this.add.text(width / 2, height * titlePadding, 'CENTRAL DO HÓSPEDE', {
      fontFamily: 'Montserrat', fontSize: isPortrait ? '12px' : '16px', color: '#ffffff', fontStyle: 'bold', letterSpacing: 5
    }).setOrigin(0.5).setAlpha(0.9); // High visibility, matching "Check in" feel

    this.add.text(width / 2, height * (titlePadding + 0.07), 'Bem-vindo!', {
      fontFamily: 'Montserrat', fontSize: isPortrait ? '42px' : '64px', color: '#ffffff', fontStyle: 'bold'
    }).setOrigin(0.5);

    // 3. Grid Positioning
    const items = [
      { label: 'REGRAS DA CASA', emoji: '📜', id: 'welcome_rules', callback: () => this.showModal('welcome_rules') },
      { label: 'WI-FI', emoji: '📶', id: 'welcome_wifi', callback: () => this.showModal('welcome_wifi') },
      { label: 'ONDE VISITAR', emoji: '📍', id: 'welcome_visit', callback: () => window.open('https://guiadevilavelha.com.br', '_blank') },
      { label: 'PADARIAS E CAFÉS', emoji: '🥐', id: 'welcome_bakery', callback: () => this.showModal('welcome_bakery') },
      { label: 'GAME PARA PRÊMIOS', emoji: '🎮', id: 'welcome_game', callback: () => this.startGame(), locked: true },
      { label: 'FARMÁCIAS', emoji: '💊', id: 'pharmacy', callback: () => this.showModal('pharmacy') },
      { label: 'ONDE COMER', emoji: '🍽️', id: 'restaurant', callback: () => this.showModal('restaurant') },
      { label: 'CHECK-OUT', emoji: '🔑', id: 'check_in_out', callback: () => this.showModal('check_in_out') },
      { label: 'CONTATO', emoji: '📱', id: 'contact', callback: () => this.showModal('contact') },
    ];

    const cols = isPortrait ? 3 : 5;
    const spacingX = width / (cols + 1);
    const spacingY = isPortrait ? height * 0.17 : height * 0.22;
    const startY = height * 0.35;

    items.forEach((item, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = spacingX * (col + 1);
      const y = startY + row * spacingY;

      const container = this.createProfessionalIcon(x, y, item.label, !!item.locked, item.emoji);
      
      if (item.id === 'welcome_game') this.gameButton = container;

      container.setInteractive(new Phaser.Geom.Rectangle(-45, -45, 90, 115), Phaser.Geom.Rectangle.Contains);
      container.on('pointerdown', () => {
        if (item.locked && !this.hasReadRules) {
            this.showToast('Leia as Regras da Casa primeiro!');
            this.tweens.add({ targets: container, x: x + 6, yoyo: true, duration: 60, repeat: 3 });
            return;
        }
        item.callback();
      });
    });
  }

  private createProfessionalIcon(x: number, y: number, label: string, isLocked: boolean, emoji: string) {
    const container = this.add.container(x, y);
    
    // 1. Shadow Layer
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.1).fillCircle(1, 2, 45);
    container.add(shadow);

    // 2. Crip Glass Circle
    const base = this.add.graphics();
    base.fillStyle(0xffffff, 0.15).fillCircle(0, 0, 44);
    base.lineStyle(2.5, 0xffffff, 0.4).strokeCircle(0, 0, 44); // Sharper border
    container.add(base);

    // 3. High-Fidelity Emoji with padding to prevent clipping
    const iconText = this.add.text(0, 0, emoji, { 
      fontSize: '40px',
      padding: { x: 8, y: 8 } // Ensure no clipping on garfo/faca/etc.
    }).setOrigin(0.5);
    container.add(iconText);

    // 4. Clarity Focus Label
    const labelText = this.add.text(0, 60, label.toUpperCase(), {
      fontFamily: 'Inter', fontSize: '11px', color: '#ffffff', fontStyle: 'bold', letterSpacing: 1.2
    }).setOrigin(0.5);
    container.add(labelText);

    // 5. Nítive Lock Indicator (Full opacity fonts, matching "Check in" pattern)
    if (isLocked) {
        const lock = this.add.text(28, 28, '🔒', { fontSize: '16px' }).setOrigin(0.5);
        container.add(lock);
    }

    // Hover Animation
    container.on('pointerover', () => this.tweens.add({ targets: container, scale: 1.12, duration: 250, ease: 'Cubic.easeOut' }));
    container.on('pointerout', () => this.tweens.add({ targets: container, scale: 1.0, duration: 200, ease: 'Cubic.easeIn' }));

    return container;
  }

  private showToast(msg: string) {
    const { width, height } = this.scale;
    const toast = this.add.container(width / 2, height + 60);
    const bg = this.add.graphics().fillStyle(0x000000, 0.9).fillRoundedRect(-140, -22, 280, 44, 22);
    const txt = this.add.text(0, 0, msg, { fontFamily: 'Inter', fontSize: '12px', color: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5);
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

  private showModal(key: string) {
    if (this.modalContainer) return;
    const { width, height } = this.scale;
    const data = this.ICON_DATA[key] || { title: 'INFO', content: '...' };

    this.modalContainer = this.add.container(0, 0).setDepth(200);
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.8).setOrigin(0).setInteractive();
    
    // Responsive Card Size
    const cardW = Math.min(width * 0.9, 440);
    const cardH = Math.min(height * 0.75, 540);
    
    const modalFrame = this.add.container(width / 2, height / 2);
    const cardBg = this.add.graphics();
    cardBg.fillStyle(0x000000, 0.3).fillRoundedRect(-cardW / 2 + 5, -cardH / 2 + 5, cardW, cardH, 32);
    cardBg.fillStyle(0xffffff, 1).fillRoundedRect(-cardW / 2, -cardH / 2, cardW, cardH, 32);
    modalFrame.add(cardBg);

    // Native HTML/CSS Scrollable Content
    const domHtml = `
      <div class="welcome-modal-wrapper" style="width: ${cardW - 60}px; height: ${cardH - 60}px;">
        <h1 class="welcome-modal-title">${data.title}</h1>
        <div class="welcome-modal-scroll">
          <p class="welcome-modal-text">${data.content}</p>
        </div>
        <div class="welcome-modal-footer">
          <button class="welcome-modal-btn">ENTENDIDO</button>
        </div>
      </div>
    `;

    this.domModal = this.add.dom(width / 2, height / 2).createFromHTML(domHtml);
    
    // Add event listener to the native button
    const btn = this.domModal.node.querySelector('.welcome-modal-btn') as HTMLElement;
    if (btn) {
      btn.addEventListener('click', () => {
        this.domModal?.destroy();
        this.domModal = null;
        this.modalContainer?.destroy();
        this.modalContainer = null;
        if (key === 'welcome_rules') {
          this.hasReadRules = true;
          this.gameButton.setAlpha(1);
        }
      });
    }

    // High-Performance Drag-Scroll Implementation
    const scrollContainer = this.domModal.node.querySelector('.welcome-modal-scroll') as HTMLElement;
    if (scrollContainer) {
        let isDown = false;
        let startY: number;
        let scrollTop: number;

        const start = (e: MouseEvent | TouchEvent) => {
            isDown = true;
            const pageY = e instanceof MouseEvent ? e.pageY : e.touches[0].pageY;
            startY = pageY - scrollContainer.offsetTop;
            scrollTop = scrollContainer.scrollTop;
        };

        const end = () => isDown = false;

        const move = (e: MouseEvent | TouchEvent) => {
            if (!isDown) return;
            // Only prevent default on mouse to avoid breaking native mobile swipe features
            if (e instanceof MouseEvent) e.preventDefault();
            const pageY = e instanceof MouseEvent ? e.pageY : e.touches[0].pageY;
            const y = pageY - scrollContainer.offsetTop;
            const walk = (y - startY) * 1.5; // Multiplier for better feel
            scrollContainer.scrollTop = scrollTop - walk;
        };

        // Desktop
        scrollContainer.addEventListener('mousedown', start as any);
        scrollContainer.addEventListener('mouseleave', end);
        scrollContainer.addEventListener('mouseup', end);
        scrollContainer.addEventListener('mousemove', move as any);

        // Mobile (just in case native swipe is blocked)
        scrollContainer.addEventListener('touchstart', start as any);
        scrollContainer.addEventListener('touchend', end);
        scrollContainer.addEventListener('touchmove', move as any);
    }

    this.modalContainer.add([overlay, modalFrame]);
    
    // Animations
    modalFrame.setScale(0.7).setAlpha(0);
    this.domModal.setScale(0.7).setAlpha(0);
    this.tweens.add({ targets: [modalFrame, this.domModal], scale: 1, alpha: 1, duration: 450, ease: 'Back.easeOut' });
  }
}
