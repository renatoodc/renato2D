import Phaser from 'phaser';

export class RulesScene extends Phaser.Scene {
  constructor() {
    super('RulesScene');
  }

  create() {
    const { width, height } = this.scale;

    // 🌊 UI Expert Background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x1e3c72, 0x1e3c72, 0x2a5298, 0x2a5298, 1);
    bg.fillRect(0, 0, width, height);

    // 🏆 Content Container
    const container = document.createElement('div');
    container.id = 'rules-pro-page';
    this.applyStyles(container);

    // 📝 Header Section
    const header = this.createHeader();
    container.appendChild(header);

    // 📄 Content Wrapper
    const content = document.createElement('div');
    content.className = 'rules-content';
    container.appendChild(content);

    // 👋 Intro Message
    const intro = document.createElement('div');
    intro.className = 'rules-intro';
    intro.innerHTML = `<p>Para garantir a melhor experiência para você e a boa convivência com os vizinhos, pedimos atenção às regras da casa:</p>`;
    content.appendChild(intro);

    // 🤫 Card: Silence
    this.addRuleCard(content, "🤫 Silêncio e Respeito", "Das 22h às 08h. O edifício é estritamente residencial e familiar. Evite barulhos excessivos.");
    
    // 👥 Card: Capacity
    this.addRuleCard(content, "👥 Ocupação e Visitas", "Capacidade máxima de 8 pessoas (pernoite). Visitas diurnas devem ser consultadas pelo chat.");
    
    // ⚡ Card: Energy
    this.addRuleCard(content, "⚡ Consumo Consciente", "Desligue todas as luzes e ventiladores ao sair. Deixe janelas abertas para refrescar o apartamento.");
    
    // 🏖️ Card: Beach/Cleaning
    this.addRuleCard(content, "🏖️ Areia e Prédio", "Favor retirar o excesso de areia na rua/praia. Não possuímos chuveiro no prédio; ajude a manter os ralos limpos!");
    
    // 🗑️ Card: Trash
    this.addRuleCard(content, "🗑️ Descarte de Lixo", "Favor descartar o lixo diariamente nos coletores à direita do portão da garagem.");

    // 🚫 Card: Smoking/Parties
    this.addRuleCard(content, "🚫 Proibitivo", "É estritamente proibido fumar dentro do imóvel ou realizar festas/eventos.");

    // 🏁 Footer
    const footer = document.createElement('div');
    footer.className = 'rules-footer';
    footer.innerHTML = `<p>Obrigado por sua colaboração! Aproveite sua estadia.</p>`;
    content.appendChild(footer);

    // 🚀 Inject into Phaser
    this.add.dom(width / 2, height / 2, container);
    
    // 🕵️ UI Expert: Manual Scrolling
    this.setupManualScroll(container);

    // Fade in
    this.cameras.main.fadeIn(500, 0, 0, 0);
  }

  private addRuleCard(parent: HTMLElement, title: string, text: string) {
    const card = document.createElement('div');
    card.className = 'info-card';
    card.innerHTML = `
        <div class="card-body">
            <h3>${title}</h3>
            <p>${text}</p>
        </div>
    `;
    parent.appendChild(card);
  }

  private createHeader() {
    const header = document.createElement('div');
    header.className = 'rules-header';
    
    const backBtn = document.createElement('button');
    backBtn.className = 'back-button';
    backBtn.innerHTML = '🔙 Voltar';
    backBtn.onclick = () => {
        this.cameras.main.fadeOut(300, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            // Signal WelcomeScene that we read the rules (global state persistence)
            (this.scene.get('WelcomeScene') as any).hasReadRules = true;
            this.scene.start('WelcomeScene');
        });
    };

    const title = document.createElement('h1');
    title.innerText = 'REGRAS DA CASA';

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
        #rules-pro-page {
            width: 100vw;
            height: 100vh;
            overflow-y: auto;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            font-family: 'Outfit', 'Inter', sans-serif;
            color: #333;
            -webkit-overflow-scrolling: touch;
        }

        .rules-header {
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

        .rules-header h1 {
            margin: 0;
            font-size: 1.1rem;
            color: #1e3c72;
            letter-spacing: 2px;
            font-weight: 800;
        }

        .rules-content {
            padding: 20px;
            max-width: 500px;
            margin: 0 auto;
        }

        .rules-intro p {
            color: white;
            text-align: center;
            font-size: 1.1rem;
            line-height: 1.6;
            margin-bottom: 25px;
            opacity: 0.9;
        }

        .info-card {
            background: rgba(255,255,255,0.12);
            backdrop-filter: blur(8px);
            border-radius: 20px;
            padding: 20px;
            margin-bottom: 15px;
            color: white;
            border: 1px solid rgba(255,255,255,0.08);
            transition: transform 0.2s;
        }
        
        .info-card h3 { margin: 0 0 10px 0; font-size: 1.1rem; color: #ffd700; letter-spacing: 0.5px; }
        .info-card p { margin: 0; font-size: 0.95rem; line-height: 1.5; opacity: 0.95; }

        .rules-footer {
            text-align: center;
            padding: 40px 0;
            border-top: 1px solid rgba(255,255,255,0.2);
            color: white;
            opacity: 0.7;
            font-style: italic;
        }
    `;
    container.appendChild(style);
  }
}
