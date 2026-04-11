import Phaser from 'phaser';

export class RestaurantScene extends Phaser.Scene {
  constructor() {
    super('RestaurantScene');
  }

  create() {
    const { width, height } = this.scale;

    // 🌊 UI Expert Background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x2a5298, 0x2a5298, 0x1e3c72, 0x1e3c72, 1);
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
    this.setupManualScroll(container, content);

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
    title.innerText = 'GASTRONOMIA E BARES';
    title.style.fontFamily = 'Outfit, sans-serif';

    header.appendChild(backBtn);
    header.appendChild(title);
    return header;
  }

  private createCategoryMenu() {
    const menu = document.createElement('div');
    menu.className = 'anchor-menu';
    menu.innerHTML = `
        <button data-target="almoco">☀️ Almoço</button>
        <button data-target="jantar">🌙 Jantar</button>
        <button data-target="bares">🍻 Bares & Petiscos</button>
        <button data-target="gastro">🍔 Food Parks</button>
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
            title: '☀️ Almoço e Comida Caseira',
            intro: 'Para a principal refeição do dia, uma seleção com pratos fartos, tempero maravilhoso e locais com clima agradável perto do mar.',
            items: [
                {
                    name: 'Restaurante Nona Lu',
                    desc: 'Referência em comida caseira na região. Comida por quilo bem temperada, farta, e ideal para o almoço após uma manhã de onda.',
                    address: 'Rua São Paulo, Itapuã',
                    maps: 'https://www.google.com/maps/search/?api=1&query=Nona+Lu+Vila+Velha',
                    instagram: 'https://www.instagram.com/restaurantenonalu/',
                    img: 'nona_lu.jpg' 
                },
                {
                    name: 'Aloha',
                    desc: 'Comida vibrante, opções saudáveis e tropicais. Os pratos são leves e o ambiente exala o verdadeiro clima de praia.',
                    address: 'Orla de Itapuã',
                    maps: 'https://www.google.com/maps/search/?api=1&query=Aloha+Vila+Velha',
                    instagram: 'https://www.instagram.com/alohaitapua/',
                    img: 'aloha.jpg'
                }
            ]
        },
        {
            id: 'jantar',
            title: '🌙 Jantar & Massas',
            intro: 'Após o pôr do sol, o bairro te convida a jantar bons pratos, carnes ou deliciosos rodízios e massas.',
            items: [
                {
                    name: 'Rusticana Pizzaria',
                    desc: 'Pizzas maravilhosas com massa fininha e ingredientes selecionados e muito chopp gelado. Ambiente super acolhedor.',
                    address: 'Av. Hugo Musso',
                    maps: 'https://www.google.com/maps/search/?api=1&query=Rusticana+Pizzaria+Vila+Velha',
                    instagram: 'https://www.instagram.com/rusticanapizzaria/',
                    img: 'rusticana.jpg'
                },
                {
                    name: 'Naha Temakeria',
                    desc: 'Se a vontade for de culinária oriental, o Naha oferece sushis e temakis super frescos e variados. Perfeito e rápido.',
                    address: 'Rua Jair de Andrade',
                    maps: 'https://www.google.com/maps/search/?api=1&query=Naha+Temakeria+Itapua',
                    instagram: 'https://www.instagram.com/nahatemakeria/',
                    img: 'naha.jpg'
                },
                {
                    name: 'La Cuchilla',
                    desc: 'Para quem não abre mão da boa carne! Carnes nobres feitas na parrilla com o clássico tempero argentino e uruguaio.',
                    address: 'Itapuã',
                    maps: 'https://www.google.com/maps/search/?api=1&query=La+Cuchilla+Vila+Velha',
                    instagram: 'https://www.instagram.com/lacuchillaparrilla/',
                    img: 'lacuchilla.jpg'
                }
            ]
        },
        {
            id: 'bares',
            title: '🍻 Bares e Frutos do Mar',
            intro: 'A verdadeira alma do litoral capixaba: moquecas quentes, casquinha de siri, cerveja trincando e muita diversão.',
            items: [
                {
                    name: 'Caranguejo do Assis',
                    desc: 'Ícone capixaba! Moquecas espetaculares, caranguejadas e porções de camarão fartas para comer curtindo a energia do lugar.',
                    address: 'Praia de Itaparica',
                    maps: 'https://www.google.com/maps/search/?api=1&query=Caranguejo+do+Assis+Vila+Velha',
                    instagram: 'https://www.instagram.com/caranguejodoassis/',
                    img: 'caranguejo.jpg'
                },
                {
                    name: 'Sheik\'s Bar',
                    desc: 'Ótimo lugar para reunir amigos, tomar chopp trincando, drinques variados e aproveitar os excelentes petiscos.',
                    address: 'Itapuã',
                    maps: 'https://www.google.com/maps/search/?api=1&query=Sheiks+Bar+Vila+Velha',
                    instagram: 'https://www.instagram.com/sheiksbar/',
                    img: 'sheiks.jpg'
                },
                {
                    name: 'Os Meninos Bar',
                    desc: 'Clima descontraído, som ao vivo em alguns dias e um cardápio de dar água na boca com carnes de sol e fritas.',
                    address: 'Vila Velha',
                    maps: 'https://www.google.com/maps/search/?api=1&query=Os+Meninos+Bar+Vila+Velha',
                    instagram: 'https://www.instagram.com/osmeninosbar/',
                    img: 'meninos.jpg'
                }
            ]
        },
        {
            id: 'gastro',
            title: '🍔 Food Parks',
            intro: 'Para a família inteira: os Food Parks em Vila Velha oferecem muita diversidade de lanches e entretenimento.',
            items: [
                {
                    name: 'Gran Park Food Park',
                    desc: 'Diversas opções de food trucks: do hambúrguer artesanal às sobremesas insanas, passando por crepes e culinária internacional.',
                    address: 'Itapuã',
                    maps: 'https://www.google.com/maps/search/?api=1&query=Gran+Park+Vila+Velha',
                    instagram: 'https://www.instagram.com/granparkfoodpark/',
                    img: 'gran_park.jpg'
                },
                {
                    name: 'Blu Food Park',
                    desc: 'Ambiente descolado com muitas mesinhas e música legal. Ideal para todo mundo comer o que gosta no mesmo lugar.',
                    address: 'Praia da Costa',
                    maps: 'https://www.google.com/maps/search/?api=1&query=Blu+Food+Park+Vila+Velha',
                    instagram: 'https://www.instagram.com/blufoodpark/',
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

  private applyStyles(_container: HTMLElement) {
    const style = document.createElement('style');
    style.innerHTML = `
        #restaurant-pro-page {
            position: relative;
            width: 100%;
            height: 100dvh;
            overflow-y: auto;
            background: linear-gradient(135deg, #2a5298 0%, #1e3c72 100%);
            font-family: 'Outfit', sans-serif;
            color: #333;
        }

        .market-header {
            position: sticky;
            top: 0;
            z-index: 2000;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(15px);
            padding: 12px 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            border-bottom: 1px solid rgba(0,0,0,0.05);
            box-sizing: border-box;
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
            color: #1e3c72;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
        }

        .back-button:hover {
            background: rgba(30, 60, 114, 0.15);
        }

        .market-header h1 {
            font-size: 1rem;
            font-weight: 800;
            color: #1e3c72;
            margin: 0;
            letter-spacing: 0.5px;
            text-align: left;
            padding-left: 110px;
            padding-right: 20px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
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
            background: white;
            border: 1px solid #2a5298;
            padding: 12px 8px;
            border-radius: 14px;
            font-size: 0.8rem;
            font-weight: 700;
            color: #1e3c72;
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
            position: absolute;
            top: 60px; left: 0; right: 0; bottom: 0;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            padding: 20px 20px 80px;
            max-width: 600px;
            margin: 0 auto;
            width: 100%;
            box-sizing: border-box;
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
            background: #2a5298;
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
