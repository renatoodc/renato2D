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
    
    // 🕵️ UI Expert: Touch Scroll — identical to LocalGuideScene
    this.setupManualScroll(container, container);

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
        <button data-target="bares">🍻 Bares &amp; Petiscos</button>
        <button data-target="gastro">🍔 Food Parks</button>
    `;

    menu.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const btnEl = e.target as HTMLElement;
            const target = btnEl.getAttribute('data-target');
            const element = document.getElementById(`section-${target}`);
            const scrollContainer = document.getElementById('restaurant-pro-page');
            if (element && scrollContainer) {
                scrollContainer.scrollTo({
                    top: element.offsetTop - 120,
                    behavior: 'smooth'
                });
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
                    maps: 'https://maps.app.goo.gl/P94xCnCrWmugGsZW7',
                    instagram: 'https://www.instagram.com/nonalurestaurantes/',
                    img: 'nona_lu.jpg' 
                },
                {
                    name: 'Aloha',
                    desc: 'Comida vibrante, opções saudáveis e tropicais. Os pratos são leves e o ambiente exala o verdadeiro clima de praia.',
                    address: 'Orla de Itapuã',
                    maps: 'https://www.google.com/maps/search/?api=1&query=Aloha+Vila+Velha',
                    instagram: 'https://www.instagram.com/alohavilavelha/',
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
                    name: 'Vila Rusticana Pizzaria',
                    desc: 'Pizzas maravilhosas com massa fininha e ingredientes selecionados e muito chopp gelado. Ambiente super acolhedor.',
                    address: 'Av. Hugo Musso',
                    maps: 'https://www.google.com/maps/search/?api=1&query=Rusticana+Pizzaria+Vila+Velha',
                    instagram: 'https://www.instagram.com/vilarusticana/?hl=pt',
                    img: 'rusticana.jpg'
                },
                {
                    name: 'Naha Lounge Sushi',
                    desc: 'Rodízio de sushi e temaki com excelente custo-benefício! Variedade enorme de peças frescas e criativas, ótimo para grupos. Uma surpresa gastronômica no bairro.',
                    address: 'Rua Jair de Andrade',
                    maps: 'https://maps.app.goo.gl/ou4yuUE3Nb8ujgGY9',
                    instagram: 'https://www.instagram.com/vilarusticana/?hl=pt',
                    img: 'naha.jpg'
                },
                {
                    name: 'La Cuchilla',
                    desc: 'Para quem não abre mão da boa carne! Carnes nobres feitas na parrilla com o clássico tempero argentino e uruguaio.',
                    address: 'Itapuã',
                    maps: 'https://maps.app.goo.gl/abRczzBjUc5nVxdz6',
                    instagram: 'https://www.instagram.com/lacuchillabrasil/',
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
                    name: 'Bar dos Meninos',
                    desc: 'Clima descontraído, som ao vivo em alguns dias e um cardápio de dar água na boca com carnes de sol e fritas.',
                    address: 'Vila Velha',
                    maps: 'https://maps.app.goo.gl/uwxvAfAujFFHsdKu8',
                    instagram: 'https://www.instagram.com/bardosmeninos/',
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
                    name: 'Itapuã Gran Park',
                    desc: 'Diversas opções de food trucks: do hambúrguer artesanal às sobremesas insanas, passando por crepes e culinária internacional.',
                    address: 'Itapuã',
                    maps: 'https://maps.app.goo.gl/EtSWNJDrRBZjZV1P6',
                    instagram: 'https://www.instagram.com/itapuagranpark/',
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
        container.style.transition = 'none';
    }, { passive: true });
 
    container.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const pageY = e.touches[0].pageY;
        const deltaY = pageY - startY;
        scrollTarget.scrollTop = startScrollTop - deltaY;
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

  private applyStyles(_container: HTMLElement) {
    const style = document.createElement('style');
    style.innerHTML = `
        #restaurant-pro-page {
            position: relative;
            width: 100%;
            height: 100dvh;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            background: linear-gradient(135deg, #2a5298 0%, #1e3c72 100%);
            font-family: 'Outfit', sans-serif;
            color: #333;
        }

        .market-header {
            position: sticky;
            top: 0;
            z-index: 1000;
            background: white;
            padding: 15px 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            box-sizing: border-box;
            height: 60px;
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
            position: sticky;
            top: 60px;
            z-index: 900;
            padding: 12px 15px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            background: rgba(30, 60, 114, 0.85);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
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
    _container.appendChild(style);
  }
}
