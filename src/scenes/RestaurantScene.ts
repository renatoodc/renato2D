import Phaser from 'phaser';

export class RestaurantScene extends Phaser.Scene {
  constructor() {
    super('RestaurantScene');
  }

  create() {
    const { width, height } = this.scale;

    // 🌊 UI Expert Background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0B1A13, 0x0B1A13, 0x1B4332, 0x1B4332, 1);
    bg.fillRect(0, 0, width, height);

    // 🏆 Content Container
    const container = document.createElement('div');
    container.id = 'restaurant-pro-page';
    this.applyStyles(container);

    // 📝 Header Section
    const header = this.createHeader();
    container.appendChild(header);

    // 🏷️ Category Menu
    const menu = this.createCategoryMenu();
    container.appendChild(menu);

    // 📄 Content Wrapper
    const content = document.createElement('div');
    content.className = 'market-guide-content'; // Reuse market layout CSS if needed
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
    backBtn.innerHTML = '← Voltar';
    backBtn.onclick = () => {
        this.cameras.main.fadeOut(300, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('WelcomeScene');
        });
    };

    const title = document.createElement('h1');
    title.innerText = 'FONDUE E BISTRÔS';
    title.style.fontFamily = 'Cinzel, serif';

    header.appendChild(backBtn);
    header.appendChild(title);
    return header;
  }

  private createCategoryMenu() {
    const menu = document.createElement('div');
    menu.className = 'anchor-menu';
    menu.innerHTML = `
        <button data-target="almoco">☀️ Almoço Serrano</button>
        <button data-target="jantar">🌙 Jantar à Luz de Velas</button>
        <button data-target="bares">🧀 Queijos & Frios</button>
        <button data-target="gastro">🫕 Fondue & Vinhos</button>
    `;

    menu.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const btnEl = e.target as HTMLElement;
            const target = btnEl.getAttribute('data-target');
            
            const element = document.getElementById(`section-${target}`);
            if (element) {
                const container = document.getElementById('restaurant-pro-page');
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
            id: 'almoco',
            title: '☀️ Almoço Serrano',
            intro: 'Para a principal refeição do dia, preparamos uma seleção com a culinária aconchegante da montanha: fogão a lenha, panelas de pedra e tempero colonial.',
            items: [
                {
                    name: 'Fogão de Lenha da Serra',
                    desc: 'O sabor do campo! Comida caseira servida direto das panelas de barro sobre o fogão a lenha fumegante. O lugar ideal após uma trilha pelas matas da região.',
                    address: 'Estrada do Parque Central',
                    maps: 'https://www.google.com/maps/search/?api=1&query=Restaurante+Alto+Caparao',
                    instagram: 'https://www.instagram.com/explore/tags/comidamineira/',
                    img: 'nona_lu.jpg' 
                },
                {
                    name: 'Casa da Truta Montanhesa',
                    desc: 'Peixe fresco típico das águas geladas da serra. Um restaurante rústico de madeira que serve a melhor truta com pinhão ou amêndoas na manteiga.',
                    address: 'Rua do Rio de Cristal',
                    maps: 'https://www.google.com/maps/search/?api=1&query=Truta+Caparao',
                    instagram: 'https://www.instagram.com/explore/tags/caparao/',
                    img: 'aloha.jpg'
                },
                {
                    name: 'Estalagem do Caparaó',
                    desc: 'Localizado no alto da colina, com vista panorâmica. Cortes de carne rústicos ideais para repor a energia no frio cortante da tarde.',
                    address: 'Rodovia dos Picos',
                    maps: 'https://www.google.com/maps/search/?api=1&query=Iuna+ES+Restaurante',
                    instagram: 'https://www.instagram.com/explore/',
                    img: 'caranguejo.jpg'
                }
            ]
        },
        {
            id: 'jantar',
            title: '🌙 Jantar à Luz de Velas',
            intro: 'Quando a névoa desce e a temperatura cai, não há nada como um ambiente aquecido, música suave e culinária para esquentar a noite.',
            items: [
                {
                    name: 'Pizzaria Fogo & Lenha',
                    desc: 'Reduto quente na vila. Pizzas napolitanas assadas lentamente no calor do forno a lenha, acompanhadas de lareira acessa e bom vinho.',
                    address: 'Praça da Matriz',
                    maps: 'https://www.google.com/maps/search/?api=1&query=Pizzaria+Alto+Caparao',
                    instagram: 'https://www.instagram.com/explore/',
                    img: 'rusticana.jpg'
                },
                {
                    name: 'Bistrô das Araucárias',
                    desc: 'Iluminação baixa e charme rústico absoluto. Especialistas em risotos trufados e caldos encorpados servidos no pão italiano.',
                    address: 'Caminho da Penha',
                    maps: 'https://www.google.com/maps/search/?api=1&query=Bistro+Patrimonio+da+Penha',
                    instagram: 'https://www.instagram.com/explore/',
                    img: 'naha.jpg'
                },
                {
                    name: 'Parrilla de Inverno',
                    desc: 'O calor da brasa na noite gelada. Espeto corrido e cortes nobres uruguaios que são uma verdadeira celebração em volta do fogo.',
                    address: 'Alameda de Pedra Menina',
                    maps: 'https://www.google.com/maps/search/?api=1&query=Parrilla+Caparao',
                    instagram: 'https://www.instagram.com/explore/',
                    img: 'lacuchilla.jpg'
                }
            ]
        },
        {
            id: 'bares',
            title: '🧀 Queijos & Geladas',
            intro: 'Mesmo no frio, os encontros continuam. Cervejas fortes, licores serranos e tábuas curadas.',
            items: [
                {
                    name: 'Refúgio Chopp Artesanal',
                    desc: 'Ponto de encontro da vila. Cervejas encorpadas feitas na montanha (como as Stouts e IPA) com vista para as ruas de pedra.',
                    address: 'Centrinho da Serra',
                    maps: 'https://www.google.com/maps/search/?api=1&query=Chopp+Artesanal+Montanha',
                    instagram: 'https://www.instagram.com/explore/',
                    img: 'sheiks.jpg'
                },
                {
                    name: 'Tábua Serrana & Empório',
                    desc: 'Esqueça os petiscos fritos comuns; a vez aqui é de geleias caseiras, queijos maturados na caverna e parma curado na serra.',
                    address: 'Bairro do Lago',
                    maps: 'https://www.google.com/maps/search/?api=1&query=Queijo+Caparao',
                    instagram: 'https://www.instagram.com/explore/',
                    img: 'meninos.jpg'
                }
            ]
        },
        {
            id: 'gastro',
            title: '🫕 Fondue & Vinhos',
            intro: 'A coroa imperativa de qualquer visita ao frio. O ritual de mergulhar frutas e carnes sob a luz dourada do fogo.',
            items: [
                {
                    name: 'Chalet de La Fondue',
                    desc: 'O autêntico ritual suíço. Sequência mágica: queijos fundidos, cortes nobres ao vinho e o sublime mergulho de morangos recém-colhidos no chocolate belga.',
                    address: 'Vila Romântica',
                    maps: 'https://www.google.com/maps/search/?api=1&query=Fondue+Montanha',
                    instagram: 'https://www.instagram.com/explore/',
                    img: 'gran_park.jpg'
                },
                {
                    name: 'Adaga e Taça Cave',
                    desc: 'Vá pelo vinho, fique pelo ambiente envolvente. Descubra harmonizações com queijos da lua nova preparados especialmente pelos sommeliers locais.',
                    address: 'Boulevard Principal',
                    maps: 'https://www.google.com/maps/search/?api=1&query=Adega+Serra',
                    instagram: 'https://www.instagram.com/explore/',
                    img: 'blu_park.jpg'
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
                <div class="card-img" style="background-image: url('assets/img/restaurants/${item.img}'); background-size: cover; background-position: center;">
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
        #restaurant-pro-page {
            width: 100%;
            height: 100%;
            height: 100vh;
            height: 100dvh;
            overflow-y: auto;
            background: linear-gradient(135deg, #0B1A13 0%, #1B4332 100%);
            font-family: 'Cinzel', 'Outfit', sans-serif;
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

        .anchor-menu {
            padding: 15px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(5px);
        }

        .anchor-menu button {
            background: #0B1A13;
            border: 1px solid #D4AF37;
            padding: 12px 8px;
            border-radius: 14px;
            font-size: 0.8rem;
            font-weight: 700;
            color: #D4AF37;
            box-shadow: 0 4px 15px rgba(0,0,0,0.06);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
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
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
            border: 1px solid #eee;
        }

        .card-img {
            height: 180px;
            background-color: #f0f2f5;
            position: relative;
            overflow: hidden;
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
            color: #1B4332 !important;
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

        .action-btn:active {
            transform: scale(0.95);
        }

        .maps-btn {
            background: #D4AF37;
            color: #0B1A13;
        }

        .insta-btn {
            background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%);
            color: white;
        }
    `;
    document.head.appendChild(style);
  }
}
