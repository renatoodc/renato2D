import Phaser from 'phaser';

export class MarketScene extends Phaser.Scene {
  constructor() {
    super('MarketScene');
  }

  create() {
    const { width, height } = this.scale;

    // 🌊 UI Expert Background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0B1A13, 0x0B1A13, 0x1B4332, 0x1B4332, 1);
    bg.fillRect(0, 0, width, height);

    // 🏆 Content Container
    const container = document.createElement('div');
    container.id = 'market-pro-page';
    this.applyStyles(container);

    // 📝 Header Section
    const header = this.createHeader();
    container.appendChild(header);

    // 🏷️ Category Menu
    const menu = this.createCategoryMenu();
    container.appendChild(menu);

    // 📄 Content Wrapper
    const content = document.createElement('div');
    content.className = 'market-guide-content';
    container.appendChild(content);

    // 🛒 Section: Adega e Empórios
    this.createSection(content, 'supermercados', '🍷 Adegas e Empórios', 
      'Para garantir o máximo de conforto durante a sua estadia de inverno, mapeamos os melhores locais para comprar queijos selecionados, vinhos encorpados e especiarias para curtir o clima rústico. Uma boa tábua de frios em frente à lareira é um ritual indispensável no chalé.',
      [
        { 
          name: 'Empório da Serra', 
          img: 'extrabom.jpg', 
          desc: 'Excelente para quem busca produtos rústicos, pães artesanais de fermentação natural, frios selecionados e itens de empório gourmet.',
          maps: 'https://www.google.com/maps/search/?api=1&query=Supermercado+Alto+Caparao'
        },
        { 
          name: 'Adega Alto de Inverno', 
          img: 'perim.jpg', 
          desc: 'Especializada em vinhos de altitude, licores serranos e chocolates. O lugar perfeito para escolher a bebida da sua noite.',
          maps: 'https://www.google.com/maps/search/?api=1&query=Emporio+Caparao'
        }
      ]
    );

    // 🍅 Section: Itens Básicos e Lenha
    this.createSection(content, 'feiras', '🛒 Supermercados Essenciais', 
      'Para as necessidades básicas, reposição de café, água, produtos de higiene ou até mesmo lenha e acendedores (quando disponíveis), você encontrará o essencial aqui bem perto.',
      [
        { 
          name: 'Supermercado Vila Alpina', 
          img: 'feira_itapua.jpg', 
          desc: 'Opção robusta para compras gerais. Conta com açougue, padaria básica e tudo que você precisa para manter o chalé abastecido durante a viagem.',
          maps: 'https://www.google.com/maps/search/?api=1&query=Feira+Placa+Caparao'
        },
        { 
          name: 'Mercadinho Local (Lenha e Carvão)', 
          img: 'feira_castanheiras.jpg', 
          desc: 'Simples, mas salva vidas. Geralmente possui sacos de lenha, fósforos longos e carvão. Ideal para repor itens rapidamente.',
          maps: 'https://www.google.com/maps/search/?api=1&query=Feira+Artesanato+Caparao'
        }
      ]
    );

    // 🚀 Inject into Phaser
    this.add.dom(width / 2, height / 2, container);
    
    // 🕵️ UI Expert: Manual Scrolling
    this.setupManualScroll(container);

    // Fade in
    this.cameras.main.fadeIn(500, 0, 0, 0);
  }

  private createHeader() {
    const header = document.createElement('div');
    header.className = 'market-header';
    
    const backBtn = document.createElement('button');
    backBtn.className = 'back-button';
    backBtn.innerHTML = '← Voltar';
    backBtn.onclick = () => {
        this.cameras.main.fadeOut(300, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('WelcomeScene');
        });
    };

    const title = document.createElement('h1');
    title.innerText = 'EMPÓRIO & VINHOS';
    title.style.fontFamily = 'Cinzel, serif';

    header.appendChild(backBtn);
    header.appendChild(title);
    return header;
  }

  private createCategoryMenu() {
    const menu = document.createElement('div');
    menu.className = 'market-category-menu';
    menu.innerHTML = `
        <button class="cat-btn active" data-target="supermercados">🍷 Adegas</button>
        <button class="cat-btn" data-target="feiras">🛒 Essenciais & Lenha</button>
    `;

    menu.querySelectorAll('.cat-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = (e.target as HTMLElement).getAttribute('data-target');
            document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
            (e.target as HTMLElement).classList.add('active');
            
            const element = document.getElementById(`section-${target}`);
            if (element) {
                const container = document.getElementById('market-pro-page');
                if (container) {
                    container.scrollTo({
                        top: element.offsetTop - 120,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    return menu;
  }

  private createSection(parent: HTMLElement, id: string, title: string, intro: string, items: any[]) {
    const section = document.createElement('section');
    section.id = `section-${id}`;
    section.className = 'market-section';

    const h2 = document.createElement('h2');
    h2.innerText = title;
    section.appendChild(h2);

    const p = document.createElement('p');
    p.className = 'section-intro';
    p.innerText = intro;
    section.appendChild(p);

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'market-card';
        card.innerHTML = `
            <div class="card-img" style="background-image: url('assets/img/market/${item.img}'); background-size: cover; background-position: center;">
            </div>
            <div class="card-body">
                <h3>${item.name}</h3>
                <p>${item.desc}</p>
                <div class="card-actions">
                    <button class="action-btn maps-btn" onclick="window.open('${item.maps}', '_blank')">📍 Localização no Maps</button>
                </div>
            </div>
        `;
        section.appendChild(card);
    });

    parent.appendChild(section);
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
        #market-pro-page {
            width: 100%;
            height: 100%;
            height: 100vh;
            height: 100dvh;
            overflow-y: auto;
            background: linear-gradient(135deg, #0B1A13 0%, #1B4332 100%);
            font-family: 'Cinzel', 'Outfit', 'Inter', sans-serif;
            color: #333;
            -webkit-overflow-scrolling: touch;
        }

        .market-header {
            position: sticky;
            top: 0;
            z-index: 2000;
            background: rgba(11, 26, 19, 0.98);
            backdrop-filter: blur(15px);
            padding: 12px 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            border-bottom: 1px solid rgba(0,0,0,0.05);
        }

        .back-button {
            position: absolute;
            left: 12px;
            background: rgba(212, 175, 55, 0.15);
            border: 1px solid #D4AF37;
            padding: 6px 10px;
            border-radius: 12px;
            font-weight: 700;
            font-size: 0.85rem;
            color: #D4AF37;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
        }

        .back-button:hover {
            background: rgba(30, 60, 114, 0.15);
        }

        .market-header h1 {
            font-size: 1rem;
            font-weight: 800;
            color: #D4AF37;
            margin: 0;
            letter-spacing: 0.5px;
            text-align: center;
            padding: 0 60px;
            flex: 1;
            text-transform: uppercase;
        }

        .market-category-menu {
            position: sticky;
            top: 55px;
            z-index: 1500;
            background: rgba(11, 26, 19, 0.9);
            backdrop-filter: blur(5px);
            padding: 10px;
            display: flex;
            gap: 10px;
            overflow-x: auto;
            justify-content: center;
            border-bottom: 1px solid rgba(0,0,0,0.05);
        }

        .cat-btn {
            background: #f0f2f5;
            border: 1px solid #ddd;
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 0.9rem;
            white-space: nowrap;
            cursor: pointer;
            transition: all 0.2s;
        }

        .cat-btn.active {
            background: #D4AF37;
            color: #0B1A13;
            border-color: #D4AF37;
        }

        .market-guide-content {
            padding: 20px;
            max-width: 600px;
            margin: 0 auto;
        }

        .market-section h2 {
            color: white;
            font-size: 1.5rem;
            margin: 30px 0 10px 0;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .section-intro {
            color: rgba(255,255,255,0.9);
            font-size: 1rem;
            line-height: 1.6;
            margin-bottom: 25px;
        }

        .market-card {
            background: white;
            border-radius: 24px;
            overflow: hidden;
            margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        .card-img {
            height: 180px;
            background-color: #f0f2f5;
            background-size: cover;
            background-position: center;
            position: relative;
            overflow: hidden;
        }

        .card-body {
            padding: 20px;
        }

        .card-body h3 {
            margin: 0 0 10px 0;
            color: #1B4332;
            font-size: 1.25rem;
        }

        .card-body p {
            margin: 0 0 20px 0;
            color: #555;
            line-height: 1.5;
            font-size: 0.95rem;
        }

        .action-btn {
            width: 100%;
            padding: 12px;
            border: none;
            border-radius: 12px;
            font-weight: 700;
            cursor: pointer;
            transition: transform 0.2s;
        }

        .maps-btn {
            background: #1B4332;
            color: white;
        }
        
        .action-btn:active {
            transform: scale(0.98);
        }
    `;
    container.appendChild(style);
  }
}
