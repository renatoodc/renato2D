import Phaser from 'phaser';

export class WifiScene extends Phaser.Scene {
  constructor() {
    super('WifiScene');
  }

  create() {
    const { width, height } = this.scale;

    // 🌊 UI Expert Background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x1e3c72, 0x1e3c72, 0x2a5298, 0x2a5298, 1);
    bg.fillRect(0, 0, width, height);

    // 🏆 Content Container
    const container = document.createElement('div');
    container.id = 'wifi-pro-page';
    this.applyStyles(container);

    // 📝 Header Section
    const header = this.createHeader();
    container.appendChild(header);

    // 📄 Content Wrapper
    const content = document.createElement('div');
    content.className = 'wifi-content';
    container.appendChild(content);

    // 👋 Intro Message
    const intro = document.createElement('div');
    intro.className = 'wifi-intro';
    intro.innerHTML = `<p>Fique conectado e aproveite sua estadia em Itapuã!</p>`;
    content.appendChild(intro);

    // ⚡ HERO CARD: WiFi Info
    const heroCard = document.createElement('div');
    heroCard.className = 'wifi-hero-card';
    heroCard.innerHTML = `
        <div class="card-icon">📶</div>
        <div class="wifi-details">
            <div class="wifi-row">
                <span>REDE:</span>
                <strong>Loga 201</strong>
            </div>
            <div class="wifi-row">
                <span>SENHA:</span>
                <strong id="wifi-pass">miguel10</strong>
            </div>
        </div>
        <button class="copy-btn" id="copy-btn">📋 Copiar Senha</button>
    `;
    content.appendChild(heroCard);

    // ℹ️ Instruction Card
    const infoCard = document.createElement('div');
    infoCard.className = 'info-card';
    infoCard.innerHTML = `
        <div class="card-body">
            <h3>Dica de Conexão</h3>
            <p>Se tiver problemas com o sinal, tente desligar e ligar o roteador localizado na sala. A rede suporta múltiplos dispositivos simultaneamente.</p>
        </div>
    `;
    content.appendChild(infoCard);

    // 🚀 Inject into Phaser
    this.add.dom(width / 2, height / 2, container);
    
    // 🔍 Setup Interaction Logic
    this.setupManualScroll(container);
    this.setupCopyFeature(container);

    // Fade in
    this.cameras.main.fadeIn(500, 0, 0, 0);
  }

  private createHeader() {
    const header = document.createElement('div');
    header.className = 'wifi-header';
    
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
    title.innerText = 'WI-FI';

    header.appendChild(backBtn);
    header.appendChild(title);
    return header;
  }

  private setupCopyFeature(container: HTMLElement) {
    const btn = container.querySelector('#copy-btn') as HTMLElement;
    const pass = container.querySelector('#wifi-pass')?.textContent || '';
    
    if (btn) {
      btn.onclick = () => {
        navigator.clipboard.writeText(pass).then(() => {
            btn.innerHTML = '✅ Copiada!';
            btn.style.background = '#34a853';
            btn.style.color = 'white';
            setTimeout(() => {
                btn.innerHTML = '📋 Copiar Senha';
                btn.style.background = 'white';
                btn.style.color = '#1e3c72';
            }, 2000);
        });
      };
    }
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
        #wifi-pro-page {
            width: 100vw;
            height: 100vh;
            overflow-y: auto;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            font-family: 'Outfit', 'Inter', sans-serif;
            color: #333;
            -webkit-overflow-scrolling: touch;
        }

        .wifi-header {
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

        .wifi-header h1 {
            margin: 0;
            font-size: 1.1rem;
            color: #1e3c72;
            letter-spacing: 2px;
            font-weight: 800;
        }

        .wifi-content {
            padding: 20px;
            max-width: 500px;
            margin: 0 auto;
        }

        .wifi-intro p {
            color: white;
            text-align: center;
            font-size: 1.1rem;
            line-height: 1.6;
            margin-bottom: 25px;
            opacity: 0.9;
        }

        .wifi-hero-card {
            background: white;
            border-radius: 24px;
            padding: 30px 20px;
            text-align: center;
            box-shadow: 0 15px 35px rgba(0,0,0,0.2);
            margin-bottom: 30px;
            border-bottom: 8px solid #ffd700;
        }

        .wifi-hero-card .card-icon { font-size: 3rem; margin-bottom: 20px; }
        
        .wifi-details { margin-bottom: 25px; }
        .wifi-row { margin-bottom: 15px; }
        .wifi-row span { display: block; font-size: 0.85rem; color: #777; letter-spacing: 2px; font-weight: 800; margin-bottom: 4px; }
        .wifi-row strong { font-size: 1.8rem; color: #1e3c72; font-weight: 900; }

        .copy-btn {
            background: white;
            color: #1e3c72;
            border: 2px solid #1e3c72;
            padding: 12px 24px;
            border-radius: 25px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;
        }
        .copy-btn:active { transform: scale(0.95); }

        .info-card {
            background: rgba(255,255,255,0.12);
            backdrop-filter: blur(8px);
            border-radius: 20px;
            padding: 20px;
            color: white;
            border: 1px solid rgba(255,255,255,0.08);
        }
        
        .info-card h3 { margin: 0 0 10px 0; font-size: 1.1rem; color: #ffd700; }
        .info-card p { margin: 0; font-size: 0.95rem; line-height: 1.5; opacity: 0.95; }
    `;
    container.appendChild(style);
  }
}
