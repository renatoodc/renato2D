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

    // 🕒 Highlight Card: CHECK-IN
    const checkinCard = document.createElement('div');
    checkinCard.className = 'highlight-card time-card';
    checkinCard.style.marginBottom = '20px';
    checkinCard.innerHTML = `
        <div class="card-icon">🔑</div>
        <div class="card-text">
            <span>Horário de Check-in</span>
            <strong>Das 08h às 23:59</strong>
        </div>
    `;
    content.appendChild(checkinCard);

    // 💡 Check-in Note
    const checkinNote = document.createElement('div');
    checkinNote.className = 'checkout-note';
    checkinNote.style.marginBottom = '35px';
    checkinNote.innerHTML = `
        <p>Check-in totalmente flexível! Para chegadas muito cedo ou de madrugada, favor consultar as condições pelo chat.</p>
    `;
    content.appendChild(checkinNote);

    // 🕒 Highlight Card: CHECK-OUT
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
    keysCard.className = 'pro-card-wifi';
    keysCard.innerHTML = `
        <div class="pro-card-icon">🔑</div>
        <div class="pro-card-body">
            <h3>Chaves e Controle</h3>
            <p>Deixe na <strong>caixa de correio 201</strong>, localizada no térreo do prédio.</p>
        </div>
    `;
    content.appendChild(keysCard);

    // 🗑️ Instruction: Trash
    const trashCard = document.createElement('div');
    trashCard.className = 'pro-card-wifi';
    trashCard.innerHTML = `
        <div class="pro-card-icon">🗑️</div>
        <div class="pro-card-body">
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
        <p>Caso queira estender o Check-out para aguardar o horário do seu voo ou transporte, consulte a disponibilidade com o anfitrião pelo chat do Airbnb.</p>
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
    title.innerText = 'CHECK-IN/OUT';

    header.appendChild(backBtn);
    header.appendChild(title);
    return header;
  }

  private applyStyles(container: HTMLElement) {
    const style = document.createElement('style');
    style.innerHTML = `
        #checkout-pro-page {
            width: 100%;
            height: 100%;
            height: 100vh;
            height: 100dvh;
            overflow-y: auto;
            background: radial-gradient(circle at top right, #2a5298, #1e3c72);
            font-family: 'Outfit', sans-serif;
            color: white;
            padding-bottom: 50px;
        }

        .checkout-header {
            position: sticky;
            top: 0;
            z-index: 2000;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(15px);
            padding: 18px 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 30px rgba(0,0,0,0.15);
        }

        .back-button {
            position: absolute;
            left: 20px;
            background: #f0f2f5;
            border: none;
            padding: 10px 16px;
            border-radius: 12px;
            font-weight: 700;
            color: #1e3c72;
            cursor: pointer;
            font-size: 0.9rem;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .checkout-header h1 {
            margin: 0;
            font-size: 1.1rem;
            color: #1e3c72;
            letter-spacing: 1px;
            font-weight: 950;
            text-align: center;
            padding: 0 75px; 
            flex: 1;
            text-transform: uppercase;
        }

        .checkout-content {
            padding: 30px 20px;
            max-width: 480px;
            margin: 0 auto;
        }

        .checkout-intro p {
            color: rgba(255,255,255,0.9);
            text-align: center;
            font-size: 1.15rem;
            line-height: 1.6;
            margin-bottom: 30px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .highlight-card {
            background: white;
            border-radius: 32px;
            padding: 30px 20px;
            display: flex;
            align-items: center;
            gap: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            margin-bottom: 35px;
            position: relative;
            overflow: hidden;
        }

        .highlight-card::after {
            content: '';
            position: absolute;
            left: 0; top:0; bottom: 0; width: 8px;
            background: linear-gradient(to bottom, #ffcc00, #ffaa00);
        }

        .time-card .card-icon { font-size: 2.5rem; background: #f8f9fa; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
        .time-card .card-text span { display: block; font-size: 0.8rem; color: #888; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 800; margin-bottom: 4px; }
        .time-card .card-text strong { display: block; font-size: 2.22rem; color: #1e3c72; font-weight: 900; line-height: 1; }

        .checkout-note p {
            color: rgba(255,255,255,0.85);
            font-size: 1rem;
            text-align: center;
            line-height: 1.6;
            margin-bottom: 35px;
            font-style: italic;
            padding: 0 10px;
        }

        .pro-card-wifi {
            background: rgba(255,255,255,0.15);
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
            background: rgba(255,255,255,0.05);
            border-radius: 32px;
            padding: 40px 25px;
            text-align: center;
            margin: 40px 0;
            border: 2px dashed rgba(255,255,255,0.15);
        }

        .cta-section h3 { color: #ffcc00; margin-bottom: 12px; font-size: 1.4rem; font-weight: 800; }
        .cta-section p { color: rgba(255,255,255,0.8); font-size: 1rem; margin-bottom: 30px; line-height: 1.5; }

        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #ffcc00, #ffaa00);
            color: #1e3c72;
            text-decoration: none;
            padding: 18px 36px;
            border-radius: 100px;
            font-weight: 900;
            font-size: 1.1rem;
            box-shadow: 0 10px 30px rgba(255, 204, 0, 0.3);
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .cta-button:active { transform: scale(0.92); }

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
