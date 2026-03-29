import Phaser from 'phaser';

export class CheckoutScene extends Phaser.Scene {
  constructor() {
    super('CheckoutScene');
  }

  create() {
    const { width, height } = this.scale;

    // 🌊 UI Expert Skill: Resort Elite Background (Consistent with Guide)
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x1e3c72, 0x1e3c72, 0x2a5298, 0x2a5298, 1);
    bg.fillRect(0, 0, width, height);

    // 🏆 Content Container (HTML/CSS Overlay)
    const container = document.createElement('div');
    container.id = 'checkout-pro-page';
    this.applyStyles(container);

    // 📝 Header Section
    const header = this.createHeader();
    container.appendChild(header);

    // 📄 Main Content Wrapper
    const content = document.createElement('div');
    content.className = 'checkout-content';
    container.appendChild(content);

    // 👋 Intro Message
    const intro = document.createElement('div');
    intro.className = 'checkout-intro';
    intro.innerHTML = `
        <p>Esperamos que você tenha aproveitado ao máximo sua estadia e leve ótimas lembranças de Itapuã!</p>
    `;
    content.appendChild(intro);

    // 🕒 Highlight Card: Time
    const timeCard = document.createElement('div');
    timeCard.className = 'highlight-card time-card';
    timeCard.innerHTML = `
        <div class="card-icon">🕒</div>
        <div class="card-text">
            <span>Horário de Check-out</span>
            <strong>Até às 13h</strong>
        </div>
    `;
    content.appendChild(timeCard);

    // ℹ️ Importance Note
    const note = document.createElement('div');
    note.className = 'checkout-note';
    note.innerHTML = `
        <p>Cumprir esse horário é vital para que nossa equipe de limpeza prepare o apartamento com o mesmo cuidado para o próximo hóspede.</p>
    `;
    content.appendChild(note);

    // 🔑 Instruction: Keys
    const keysCard = document.createElement('div');
    keysCard.className = 'info-card';
    keysCard.innerHTML = `
        <div class="card-icon">🔑</div>
        <div class="card-body">
            <h3>Chaves e Controle</h3>
            <p>Deixe na <strong>caixa de correio 201</strong>, localizada no térreo do prédio.</p>
        </div>
    `;
    content.appendChild(keysCard);

    // 🗑️ Instruction: Trash
    const trashCard = document.createElement('div');
    trashCard.className = 'info-card';
    trashCard.innerHTML = `
        <div class="card-icon">🗑️</div>
        <div class="card-body">
            <h3>Descarte de Lixo</h3>
            <p>Favor descartar nos coletores ao <strong>lado direito do portão da garagem</strong>.</p>
        </div>
    `;
    content.appendChild(trashCard);

    // 💬 Airbnb CTA Section
    const ctaSection = document.createElement('div');
    ctaSection.className = 'cta-section';
    ctaSection.innerHTML = `
        <h3>Precisa de um tempinho extra?</h3>
        <p>Caso queira aproveitar um pouco mais a praia, consulte a disponibilidade pelo chat do Airbnb.</p>
        <a href="https://www.airbnb.com.br/guest/inbox" target="_blank" class="cta-button">💬 Abrir Chat Airbnb</a>
    `;
    content.appendChild(ctaSection);

    // ✈️ Farewell Footer
    const footer = document.createElement('div');
    footer.className = 'checkout-footer';
    footer.innerHTML = `
        <p>Obrigado por escolher nosso espaço!</p>
        <strong>Boa viagem de volta! 🌊</strong>
    `;
    content.appendChild(footer);

    // 🚀 Inject into Phaser
    this.add.dom(width / 2, height / 2, container);
    
    // 🕵️ UI Expert: Touch-to-Dismiss Logic
    this.setupTouchDismiss(container);

    // Fade in
    this.cameras.main.fadeIn(500, 0, 0, 0);
  }

  private setupTouchDismiss(container: HTMLElement) {
    let startY = 0;
    let startScrollTop = 0;
    let currentY = 0;
    let isDragging = false;

    container.addEventListener('touchstart', (e) => {
        startY = e.touches[0].pageY;
        startScrollTop = container.scrollTop;
        isDragging = true;
        container.style.transition = 'none';
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        currentY = e.touches[0].pageY;
        const deltaY = currentY - startY;

        // 🔍 UI Expert Detail: Manual Scrolling Emulation
        container.scrollTop = startScrollTop - deltaY;
        
        container.style.transform = 'translateY(0)';
        container.style.opacity = '1';
    }, { passive: true });

    container.addEventListener('touchend', () => {
        isDragging = false;
        container.style.transition = 'none';
        container.style.transform = 'translateY(0)';
        container.style.opacity = '1';
    });
  }

  private createHeader() {
    const header = document.createElement('div');
    header.className = 'checkout-header';
    
    const backBtn = document.createElement('button');
    backBtn.className = 'back-button';
    backBtn.innerHTML = '🔙 Voltar';
    backBtn.onclick = () => {
        this.cameras.main.fadeOut(300, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('WelcomeScene');
        });
    };

    const title = document.createElement('h1');
    title.innerText = 'CHECK-OUT';

    header.appendChild(backBtn);
    header.appendChild(title);
    return header;
  }

  private applyStyles(container: HTMLElement) {
    const style = document.createElement('style');
    style.innerHTML = `
        #checkout-pro-page {
            width: 100vw;
            height: 100vh;
            overflow-y: auto;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            font-family: 'Outfit', 'Inter', sans-serif;
            color: #333;
            -webkit-overflow-scrolling: touch;
        }

        .checkout-header {
            position: sticky;
            top: 0;
            z-index: 1000;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            padding: 15px 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .back-button {
            position: absolute;
            left: 15px;
            background: #f0f2f5;
            border: none;
            padding: 8px 12px;
            border-radius: 20px;
            font-weight: 600;
            cursor: pointer;
        }

        .checkout-header h1 {
            margin: 0;
            font-size: 1.1rem;
            color: #1e3c72;
            letter-spacing: 2px;
            font-weight: 800;
        }

        .checkout-content {
            padding: 20px;
            max-width: 500px;
            margin: 0 auto;
        }

        .checkout-intro p {
            color: white;
            text-align: center;
            font-size: 1.1rem;
            line-height: 1.6;
            margin-bottom: 25px;
            opacity: 0.9;
        }

        .highlight-card {
            background: white;
            border-radius: 24px;
            padding: 25px;
            display: flex;
            align-items: center;
            gap: 20px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.2);
            margin-bottom: 25px;
            border-left: 6px solid #ffd700;
        }

        .time-card .card-icon { font-size: 2.5rem; }
        .time-card .card-text span { display: block; font-size: 0.9rem; color: #666; text-transform: uppercase; letter-spacing: 1px; }
        .time-card .card-text strong { display: block; font-size: 2rem; color: #1e3c72; font-weight: 900; }

        .checkout-note p {
            color: rgba(255,255,255,0.75);
            font-size: 0.9rem;
            text-align: center;
            line-height: 1.5;
            margin-bottom: 30px;
            font-style: italic;
        }

        .info-card {
            background: rgba(255,255,255,0.15);
            backdrop-filter: blur(8px);
            border-radius: 20px;
            padding: 20px;
            display: flex;
            gap: 15px;
            margin-bottom: 15px;
            color: white;
            border: 1px solid rgba(255,255,255,0.1);
        }

        .info-card .card-icon { font-size: 1.5rem; }
        .info-card h3 { margin: 0 0 5px 0; font-size: 1.1rem; color: #ffd700; }
        .info-card p { margin: 0; font-size: 0.95rem; line-height: 1.4; opacity: 0.95; }

        .cta-section {
            background: rgba(0,0,0,0.2);
            border-radius: 24px;
            padding: 30px 20px;
            text-align: center;
            margin: 30px 0;
            border: 2px dashed rgba(255,255,255,0.2);
        }

        .cta-section h3 { color: white; margin-bottom: 10px; font-size: 1.2rem; }
        .cta-section p { color: rgba(255,255,255,0.7); font-size: 0.9rem; margin-bottom: 25px; }

        .cta-button {
            display: inline-block;
            background: white;
            color: #1e3c72;
            text-decoration: none;
            padding: 15px 30px;
            border-radius: 30px;
            font-weight: 800;
            font-size: 1rem;
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
            transition: transform 0.2s;
        }
        .cta-button:active { transform: scale(0.95); }

        .checkout-footer {
            text-align: center;
            border-top: 1px solid rgba(255,255,255,0.1);
            padding: 40px 0;
            color: white;
        }
        .checkout-footer p { margin-bottom: 5px; opacity: 0.7; }
        .checkout-footer strong { font-size: 1.2rem; display: block; margin-top: 5px; }
    `;
    container.appendChild(style);
  }
}
