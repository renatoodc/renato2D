import Phaser from 'phaser';

export class ContactScene extends Phaser.Scene {
  constructor() {
    super('ContactScene');
  }

  create() {
    const { width, height } = this.scale;

    // 🌊 UI Expert Background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x1e3c72, 0x1e3c72, 0x2a5298, 0x2a5298, 1);
    bg.fillRect(0, 0, width, height);

    // 🏆 Content Container
    const container = document.createElement('div');
    container.id = 'contact-pro-page';
    this.applyStyles(container);

    // 📝 Header Section
    const header = this.createHeader();
    container.appendChild(header);

    // 📄 Content Wrapper
    const content = document.createElement('div');
    content.className = 'contact-content';
    container.appendChild(content);

    // 👋 Intro Message
    const intro = document.createElement('div');
    intro.className = 'contact-intro';
    intro.innerHTML = `<p>Estamos à disposição para tornar sua estadia inesquecível!</p>`;
    content.appendChild(intro);

    // 💬 HERO CARD: Airbnb Chat (Primary)
    const airbnbCard = document.createElement('div');
    airbnbCard.className = 'contact-hero-card airbnb-theme';
    airbnbCard.innerHTML = `
        <div class="card-badge">PREFERENCIAL</div>
        <div class="card-icon">💬</div>
        <h3>Chat do Airbnb</h3>
        <p>Para dúvidas gerais, check-in, check-out e solicitações, fale conosco preferencialmente por aqui.</p>
        <button class="action-btn airbnb-btn" onclick="window.open('https://www.airbnb.com.br/guest/inbox', '_blank')">Abrir Chat Airbnb</button>
    `;
    content.appendChild(airbnbCard);

    // 🟢 Card: WhatsApp Anfitrião (Urgency)
    const hostCard = document.createElement('div');
    hostCard.className = 'info-card-pro';
    hostCard.innerHTML = `
        <div class="info-icon-glow">📱</div>
        <div class="info-body">
            <div class="service-label">ANFITRIÃO (URGÊNCIAS)</div>
            <h3>Renato</h3>
            <p>Em caso de urgência, ligue ou envie uma mensagem:</p>
            <div class="phone-number">27 99651-5433</div>
            <button class="action-btn wpp-btn" onclick="window.open('https://wa.me/5527996515433', '_blank')">Falar no WhatsApp</button>
        </div>
    `;
    content.appendChild(hostCard);

    // 🚨 Card: Contato Reserva (Emergency Fallback)
    const emergencyCard = document.createElement('div');
    emergencyCard.className = 'info-card-pro';
    emergencyCard.innerHTML = `
        <div class="info-icon-glow">🚨</div>
        <div class="info-body">
            <div class="service-label">CONTATO RESERVA</div>
            <h3>Emergência</h3>
            <p>Caso não consiga contato com o anfitrião principal:</p>
            <div class="phone-number">27 99721-0604</div>
            <button class="action-btn wpp-btn" onclick="window.open('https://wa.me/5527997210604', '_blank')">WhatsApp Reserva</button>
        </div>
    `;
    content.appendChild(emergencyCard);

    // 🏁 Footer
    const footer = document.createElement('div');
    footer.className = 'contact-footer';
    footer.innerHTML = `<p>Obrigado por nos escolher! Tenha uma excelente estadia.</p>`;
    content.appendChild(footer);

    // 🚀 Inject into Phaser
    this.add.dom(width / 2, height / 2, container);
    
    // 🔍 Setup Interaction Logic
    this.setupManualScroll(container);

    // Fade in
    this.cameras.main.fadeIn(500, 0, 0, 0);
  }

  private createHeader() {
    const header = document.createElement('div');
    header.className = 'contact-header';
    
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
    title.innerText = 'CONTATO';

    header.appendChild(backBtn);
    header.appendChild(title);
    return header;
  }

  private setupManualScroll(container: HTMLElement) {
    let startY = 0;
    let startScrollTop = 0;
    let isDragging = false;

    container.addEventListener('touchstart', (e) => {
        startY = e.touches[0].pageY;
        startScrollTop = container.scrollTop;
        isDragging = true;
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const pageY = e.touches[0].pageY;
        const deltaY = pageY - startY;
        container.scrollTop = startScrollTop - deltaY;
    }, { passive: true });

    container.addEventListener('touchend', () => {
        isDragging = false;
    });
  }

  private applyStyles(container: HTMLElement) {
    const style = document.createElement('style');
    style.innerHTML = `
        #contact-pro-page {
            width: 100%;
            height: 100%;
            height: 100vh;
            height: 100dvh;
            overflow-y: auto;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            font-family: 'Outfit', 'Inter', sans-serif;
            color: #333;
            -webkit-overflow-scrolling: touch;
        }

        .contact-header {
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

        .contact-header h1 {
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

        .contact-content {
            padding: 20px;
            max-width: 500px;
            margin: 0 auto;
        }

        .contact-intro p {
            color: white;
            text-align: center;
            font-size: 1.1rem;
            line-height: 1.6;
            margin-bottom: 25px;
            opacity: 0.9;
        }

        .contact-hero-card {
            background: white;
            border-radius: 24px;
            padding: 30px 20px;
            text-align: center;
            box-shadow: 0 15px 35px rgba(0,0,0,0.2);
            margin-bottom: 25px;
            position: relative;
            overflow: hidden;
        }

        .airbnb-theme { border-bottom: 8px solid #ff385c; }
        
        .card-badge {
            position: absolute;
            top: 15px;
            right: 15px;
            background: #ff385c;
            color: white;
            font-size: 0.7rem;
            font-weight: 800;
            padding: 4px 10px;
            border-radius: 10px;
            letter-spacing: 1px;
        }

        .contact-hero-card .card-icon { font-size: 3rem; margin-bottom: 15px; }
        .contact-hero-card h3 { color: #1e3c72; margin: 0 0 10px 0; font-weight: 800; }
        .contact-hero-card p { color: #555; line-height: 1.5; margin-bottom: 20px; }

        .action-btn {
            width: 100%;
            padding: 15px;
            border: none;
            border-radius: 15px;
            font-weight: 700;
            font-size: 1rem;
            cursor: pointer;
            transition: transform 0.2s;
        }
        .action-btn:active { transform: scale(0.98); }

        .airbnb-btn { background: #ff385c; color: white; }

        .info-card-pro {
            background: rgba(255,255,255,0.15);
            backdrop-filter: blur(20px);
            border-radius: 28px;
            padding: 25px;
            display: flex;
            gap: 20px;
            align-items: flex-start;
            margin-bottom: 20px;
            border: 1px solid rgba(255,255,255,0.2);
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .info-icon-glow {
            background: rgba(255, 255, 255, 0.1);
            width: 50px; height: 50px;
            border-radius: 15px;
            display: flex; align-items: center; justify-content: center;
            font-size: 1.5rem;
            flex-shrink: 0;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 0 15px rgba(255,255,255,0.1);
        }

        .info-body { flex: 1; }
        
        .service-label { 
            font-size: 0.7rem; 
            color: rgba(255,255,255,0.7); 
            letter-spacing: 2px; 
            margin-bottom: 5px; 
            font-weight: 800;
            text-transform: uppercase;
        }

        .phone-number { 
            font-size: 1.8rem; 
            font-weight: 950; 
            margin: 12px 0; 
            color: #ffcc00; 
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .info-card-pro h3 { margin: 0; font-size: 1.25rem; color: #ffffff; font-weight: 800; }
        .info-card-pro p { margin: 5px 0 0 0; font-size: 0.95rem; line-height: 1.5; color: rgba(255,255,255,0.9); }

        .wpp-btn { 
            background: #25d366; 
            color: white; 
            margin-top: 15px; 
            border-radius: 100px;
            box-shadow: 0 5px 15px rgba(37, 211, 102, 0.3);
        }

        .contact-footer {
            text-align: center;
            padding: 30px 0;
            color: white;
            opacity: 0.6;
            font-style: italic;
        }
    `;
    container.appendChild(style);
  }
}
