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

    // 🚗 Card: Parking
    this.addRuleCard(content, "🚗 Estacionamento", "É permitido apenas um veículo no estacionamento. O cadastro deve ser feito previamente enviando a placa do veículo.");

    // 🚫 Card: Smoking/Parties/Windows
    this.addRuleCard(content, "🚫 Proibitivo", "Estritamente proibido fumar no imóvel, realizar festas ou pendurar objetos nas grades das janelas. Para roupas, utilize o varal da área de serviço.");

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
    card.className = 'rule-card-pro';
    
    // Extract emoji if present
    const emojiMatch = title.match(/^([\uD800-\uDBFF][\uDC00-\uDFFF]|\S)\s*/);
    const emoji = emojiMatch ? emojiMatch[1] : '📜';
    const cleanTitle = title.replace(/^([\uD800-\uDBFF][\uDC00-\uDFFF]|\S)\s*/, '');

    card.innerHTML = `
        <div class="rule-icon-pro">${emoji}</div>
        <div class="rule-body">
            <h3>${cleanTitle}</h3>
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
            const welcome = this.scene.get('WelcomeScene') as any;
            if (welcome) welcome.hasReadRules = true;
            this.game.registry.set('justUnlocked', true);
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

        .rules-header {
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

        .rules-header h1 {
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

        .rules-content {
            padding: 30px 20px;
            max-width: 480px;
            margin: 0 auto;
        }

        .rules-intro p {
            color: rgba(255,255,255,0.9);
            text-align: center;
            font-size: 1.15rem;
            line-height: 1.6;
            margin-bottom: 30px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .rule-card-pro {
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

        .rule-icon-pro {
            background: rgba(255, 255, 255, 0.1);
            width: 50px; height: 50px;
            border-radius: 15px;
            display: flex; align-items: center; justify-content: center;
            font-size: 1.5rem;
            flex-shrink: 0;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .rule-body h3 { margin: 0 0 8px 0; font-size: 1.15rem; color: #ffcc00; font-weight: 800; }
        .rule-body p { margin: 0; font-size: 1rem; line-height: 1.5; color: rgba(255,255,255,0.95); }
        
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
