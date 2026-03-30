import Phaser from 'phaser';

export class BakeryScene extends Phaser.Scene {
  constructor() {
    super('BakeryScene');
  }

  create() {
    const { width, height } = this.scale;

    // 🌊 UI Expert Background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x1e3c72, 0x1e3c72, 0x2a5298, 0x2a5298, 1);
    bg.fillRect(0, 0, width, height);

    // 🏆 Content Container
    const container = document.createElement('div');
    container.id = 'bakery-pro-page';
    this.applyStyles(container);

    // 📝 Header Section
    const header = this.createHeader();
    container.appendChild(header);

    // 🏷️ Category Menu (2-column layout)
    const menu = this.createCategoryMenu();
    container.appendChild(menu);

    // 📄 Content Wrapper
    const content = document.createElement('div');
    content.className = 'market-guide-content';
    container.appendChild(content);

    // 🏆 Content Rendering
    this.renderContent(content);

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
    backBtn.innerHTML = '🔙 Voltar';
    backBtn.onclick = () => {
        this.cameras.main.fadeOut(300, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('WelcomeScene');
        });
    };

    const title = document.createElement('h1');
    title.innerText = 'PADARIAS E CAFÉS';

    header.appendChild(backBtn);
    header.appendChild(title);
    return header;
  }

  private createCategoryMenu() {
    const menu = document.createElement('div');
    menu.className = 'anchor-menu';
    menu.style.gridTemplateColumns = '1fr 1fr'; // 2 columns for 2 categories
    menu.innerHTML = `
        <button data-target="padarias">🍞 Padarias</button>
        <button data-target="cafes">☕ Cafeterias</button>
    `;

    menu.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const btnEl = e.target as HTMLElement;
            const target = btnEl.getAttribute('data-target');
            
            const element = document.getElementById(`section-${target}`);
            if (element) {
                const container = document.getElementById('bakery-pro-page');
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

  private renderContent(parent: HTMLElement) {
    const sections = [
        {
            id: 'padarias',
            title: '🍞 Padarias',
            intro: 'Seja para garantir o pão fresco logo pela manhã ou tomar um pequeno-almoço reforçado, selecionámos as melhores opções a poucos passos do apartamento.',
            items: [
                {
                    name: 'Padaria Peter Pão',
                    desc: 'A nossa vizinha de porta! Saia pelo portão de cima e vire à esquerda. Ótima variedade de pães, doces e salgados frescos. Possui almoço self-service.',
                    address: 'Av. Fortaleza, 1200 - Itapuã',
                    maps: 'https://www.google.com/maps/search/?api=1&query=Padaria+Peter+Pão+Vila+Velha',
                    instagram: 'https://www.instagram.com/peter.pao/',
                    img: 'peter_pao.jpg'
                },
                {
                    name: 'Padaria Monza Itapuã',
                    desc: 'Uma das mais tradicionais e famosas do bairro. Ambiente agradável, ideal para um café completo, lanche da tarde ou buffet variado.',
                    address: 'Rua São Paulo, 2224 - Itapuã',
                    maps: 'https://www.google.com/maps/search/?api=1&query=Padaria+Monza+Itapuã+Vila+Velha',
                    instagram: 'https://www.instagram.com/padariamonza/',
                    img: 'monza.jpg'
                }
            ]
        },
        {
            id: 'cafes',
            title: '☕ Cafetarias Especiais',
            intro: 'Para uma pausa no dia ou um café de altíssima qualidade. Locais charmosos e sofisticados para relaxar ou levar para a praia.',
            items: [
                {
                    name: 'The Coffee',
                    desc: 'Conceito moderno e minimalista inspirado no Japão. Especialistas em cafés to-go (para levar), perfeitos para acompanhar uma caminhada até à praia.',
                    address: 'Av. Hugo Musso, 1754 - Itapuã',
                    maps: 'https://www.google.com/maps/search/?api=1&query=The+Coffee+Vila+Velha+Itapuã',
                    instagram: 'https://www.instagram.com/thecoffee.jp/',
                    img: 'the_coffee.jpg'
                },
                {
                    name: 'Caffè Lorenzon',
                    desc: 'Aconchegante e sofisticado. Oferece grãos selecionados e uma confeitaria impecável. Ótimo lugar para relaxar ou trabalhar um pouco.',
                    address: 'Av. Hugo Musso, 1243 - Praia da Costa',
                    maps: 'https://www.google.com/maps/search/?api=1&query=Caffè+Lorenzon+Vila+Velha',
                    instagram: 'https://www.instagram.com/caffelorenzon/',
                    img: 'lorenzon.jpg'
                },
                {
                    name: 'Terrafé',
                    desc: 'De frente para o mar! Valorizam os grãos capixabas com diferentes métodos de extração. Ideal para um final de tarde saboreando um bom café na orla.',
                    address: 'Av. Antônio Gil Veloso, 1000 - Praia da Costa',
                    maps: 'https://www.google.com/maps/search/?api=1&query=Terrafé+Praia+da+Costa+Vila+Velha',
                    instagram: 'https://www.instagram.com/terrafecafeteria/',
                    img: 'terrafe.jpg'
                }
            ]
        }
    ];

    sections.forEach(sec => {
        const section = document.createElement('section');
        section.id = `section-${sec.id}`;
        section.className = 'market-section';

        const h2 = document.createElement('h2');
        h2.innerText = sec.title;
        section.appendChild(h2);

        if (sec.intro) {
            const p = document.createElement('p');
            p.className = 'section-intro';
            p.innerText = sec.intro;
            section.appendChild(p);
        }

        sec.items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'market-card';
            card.innerHTML = `
                <div class="card-img" style="background-image: url('assets/img/bakerys/${item.img}'); background-size: cover; background-position: center;">
                </div>
                <div class="card-body">
                    <h3>${item.name}</h3>
                    <p>${item.desc}</p>
                    <p class="card-address">📍 ${item.address}</p>
                    <div class="card-actions">
                        <button class="action-btn maps-btn" onclick="window.open('${item.maps}', '_blank')">📍 Ver no Maps</button>
                        <button class="action-btn insta-btn" onclick="window.open('${item.instagram}', '_blank')">📱 Instagram</button>
                    </div>
                </div>
            `;
            section.appendChild(card);
        });

        parent.appendChild(section);
    });
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

  private applyStyles(_container: HTMLElement) {
    const style = document.createElement('style');
    style.innerHTML = `
        #bakery-pro-page {
            width: 100vw;
            height: 100vh;
            overflow-y: auto;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            font-family: 'Outfit', sans-serif;
            color: #333;
            -webkit-overflow-scrolling: touch;
        }

        .market-header {
            position: sticky;
            top: 0;
            z-index: 2000;
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
            transition: all 0.2s;
        }

        .market-header h1 {
            font-size: 1.1rem;
            font-weight: 950;
            color: #1e3c72;
            margin: 0;
            letter-spacing: 1px;
            text-align: center;
            padding: 0 75px;
            flex: 1;
            text-transform: uppercase;
        }

        .anchor-menu {
            padding: 15px;
            display: grid;
            gap: 12px;
            background: rgba(255, 255, 255, 0.1);
        }

        .anchor-menu button {
            background: white;
            border: none;
            padding: 14px 10px;
            border-radius: 16px;
            font-size: 0.85rem;
            font-weight: 700;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s, background 0.2s;
        }

        .anchor-menu button:active {
            transform: scale(0.95);
            background: #f0f2f5;
        }

        .market-guide-content {
            padding: 20px;
            max-width: 600px;
            margin: 0 auto;
        }

        .market-section h2 {
            color: white;
            font-size: 1.6rem;
            margin-top: 40px;
            margin-bottom: 10px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .section-intro {
            color: rgba(255, 255, 255, 0.9);
            font-size: 0.95rem;
            line-height: 1.6;
            margin-bottom: 25px;
        }

        .market-card {
            background: white;
            border-radius: 20px;
            overflow: hidden;
            margin-bottom: 25px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
            border: 1px solid #eee;
        }

        .card-img {
            height: 180px;
            background-color: #f0f2f5;
            position: relative;
            overflow: hidden;
            background-size: cover;
            background-position: center;
        }

        .card-body {
            padding: 20px;
        }

        .card-body h3 {
            font-size: 1.25rem;
            font-weight: 700;
            color: #1a1a1a;
            margin: 0 0 10px 0;
        }

        .card-body p {
            font-size: 0.95rem;
            color: #555;
            line-height: 1.6;
            margin: 0 0 15px 0;
        }

        .card-address {
            font-size: 0.85rem !important;
            color: #1e3c72 !important;
            font-weight: 600;
            margin-bottom: 15px !important;
        }

        .card-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }

        .action-btn {
            border: none;
            padding: 12px 5px;
            border-radius: 12px;
            font-weight: 700;
            font-size: 0.85rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
            transition: transform 0.2s;
        }

        .maps-btn {
            background: #1e3c72;
            color: white;
        }

        .insta-btn {
            background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%);
            color: white;
        }
    `;
    document.head.appendChild(style);
  }
}
