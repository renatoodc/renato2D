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

    // ℹ️ Instruction Card (PRO STYLE)
    const infoCard = document.createElement('div');
    infoCard.className = 'wifi-info-pro';
    infoCard.innerHTML = `
        <div class="info-icon-glow">💡</div>
        <div class="info-body">
            <h3>Dica de Conexão</h3>
            <p>Se tiver problemas com o sinal, tente desligar e ligar o roteador localizado na sala. A rede suporta múltiplos dispositivos simultaneamente.</p>
        </div>
    `;
    content.appendChild(infoCard);

    // 📺 STREAMING CARD
    const streamingCard = document.createElement('div');
    streamingCard.className = 'wifi-info-pro';
    streamingCard.style.marginTop = '20px';
    streamingCard.innerHTML = `
        <div class="info-icon-glow">📺</div>
        <div class="info-body">
            <h3>Smart TV e Streaming</h3>
            <p>Disponibilizamos <strong>Netflix</strong> e <strong>Amazon Prime</strong> diretamente na Smart TV da sala. <br><br>⚠️ <strong>IMPORTANTE:</strong> Por favor, utilize o perfil <strong>"Guest"</strong> em ambas as plataformas.</p>
        </div>
    `;
    content.appendChild(streamingCard);

    // 🚀 Inject into Phaser
    this.add.dom(width / 2, height / 2, container);
    
    // 🔍 Setup Interaction Logic
    this.setupManualScroll(container, content);
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
    title.innerText = 'WI-FI E STREAMING';

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

  private setupManualScroll(container: HTMLElement, scrollTarget: HTMLElement) {
    let startY = 0;
    let startScrollTop = 0;
    let isDragging = false;
 
    container.addEventListener('touchstart', (e) => {
        startY = e.touches[0].pageY;
        startScrollTop = scrollTarget.scrollTop;
        isDragging = true;
    }, { passive: true });
 
    container.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const pageY = e.touches[0].pageY;
        const deltaY = pageY - startY;
        scrollTarget.scrollTop = startScrollTop - deltaY;
    }, { passive: true });

    container.addEventListener('touchend', () => {
        isDragging = false;
    });
  }

  private applyStyles(container: HTMLElement) {
    const style = document.createElement('style');
    style.innerHTML = `
        #wifi-pro-page {
            position: relative;
            width: 100%;
            height: 100dvh;
            overflow: hidden;
            background: radial-gradient(circle at top right, #2a5298, #1e3c72);
            font-family: 'Outfit', sans-serif;
            color: white;
        }

        .wifi-header {
            position: absolute;
            top: 0; left: 0; right: 0;
            height: 70px;
            z-index: 1000;
            background: white;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 30px rgba(0,0,0,0.15);
            box-sizing: border-box;
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
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            font-size: 0.9rem;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .wifi-header h1 {
            margin: 0;
            font-size: 1.1rem;
            color: #1e3c72;
            text-align: left;
            padding-left: 115px;
            padding-right: 20px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-transform: uppercase;
        }

        .wifi-content {
            position: absolute;
            top: 70px; left: 0; right: 0; bottom: 0;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            padding: 30px 20px 80px;
            max-width: 480px;
            margin: 0 auto;
            width: 100%;
            box-sizing: border-box;
        }

        .wifi-intro p {
            color: rgba(255,255,255,0.9);
            text-align: center;
            font-size: 1.15rem;
            font-weight: 500;
            margin-bottom: 30px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .wifi-hero-card {
            background: white;
            border-radius: 32px;
            padding: 40px 20px;
            text-align: center;
            box-shadow: 0 20px 50px rgba(0,0,0,0.3);
            margin-bottom: 30px;
            position: relative;
            overflow: hidden;
        }

        .wifi-hero-card::after {
            content: '';
            position: absolute;
            bottom: 0; left: 0; right: 0;
            height: 10px;
            background: linear-gradient(90deg, #ffcc00, #ffaa00);
        }

        .card-icon { 
            background: #eef2f7;
            width: 80px; height: 80px;
            line-height: 80px;
            border-radius: 50%;
            margin: 0 auto 25px;
            font-size: 2.5rem;
            display: flex; align-items: center; justify-content: center;
        }
        
        .wifi-details { margin-bottom: 30px; }
        .wifi-row { margin-bottom: 20px; }
        .wifi-row span { 
            display: block; 
            font-size: 0.8rem; 
            color: #888; 
            letter-spacing: 2.5px; 
            font-weight: 800; 
            margin-bottom: 8px;
            text-transform: uppercase;
        }
        .wifi-row strong { 
            font-size: 2.2rem; 
            color: #1e3c72; 
            font-weight: 900;
            display: block;
        }

        .copy-btn {
            background: linear-gradient(135deg, #1e3c72, #2a5298);
            color: white;
            border: none;
            padding: 16px 32px;
            border-radius: 100px;
            font-weight: 800;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            width: 90%;
            box-shadow: 0 8px 20px rgba(30,60,114,0.3);
        }
        .copy-btn:active { transform: scale(0.92); }

        .wifi-info-pro {
            background: rgba(255,255,255,0.15);
            backdrop-filter: blur(20px);
            border-radius: 28px;
            padding: 25px;
            display: flex;
            gap: 20px;
            align-items: flex-start;
            border: 1px solid rgba(255,255,255,0.2);
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .info-icon-glow {
            background: rgba(255, 204, 0, 0.2);
            width: 50px; height: 50px;
            border-radius: 15px;
            display: flex; align-items: center; justify-content: center;
            font-size: 1.5rem;
            flex-shrink: 0;
            border: 1px solid rgba(255, 204, 0, 0.3);
        }
        
        .info-body h3 { 
            margin: 0 0 8px 0; 
            font-size: 1.15rem; 
            color: #ffcc00; 
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .info-body p { 
            margin: 0; 
            font-size: 1rem; 
            line-height: 1.6; 
            color: rgba(255,255,255,0.95);
            font-weight: 400;
        }
    `;
    container.appendChild(style);
  }
}
