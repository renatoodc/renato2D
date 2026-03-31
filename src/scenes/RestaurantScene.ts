import Phaser from 'phaser';

export class RestaurantScene extends Phaser.Scene {
  constructor() {
    super('RestaurantScene');
  }

  create() {
    const { width, height } = this.scale;

    // 🌊 UI Expert Background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x1e3c72, 0x1e3c72, 0x2a5298, 0x2a5298, 1);
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
    backBtn.innerHTML = '🔙 Voltar';
    backBtn.onclick = () => {
        this.cameras.main.fadeOut(300, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('WelcomeScene');
        });
    };

    const title = document.createElement('h1');
    title.innerText = 'RESTAURANTES E BARES';

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
        <button data-target="bares">🍻 Bares</button>
        <button data-target="gastro">🍔 Gastro Parks</button>
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
            title: '☀️ Para Almoçar',
            intro: 'Preparámos uma seleção com os melhores polos gastronômicos de Vila Velha, divididos por ocasião. Desde o almoço pertinho do apartamento com gosto de comida caseira até os restaurantes mais premiados da cidade.',
            items: [
                {
                    name: 'Nona Lu',
                    desc: 'Eleito o melhor restaurante self-service do Espírito Santo! Fica pertinho do apartamento e oferece uma comida caseira de altíssima qualidade. Destaque absoluto para o bacalhau com azeite trufado.',
                    address: 'Rua Goiânia, 7 - Itapuã',
                    maps: 'https://www.google.com/maps/search/?api=1&query=Nona+Lu+Itapuã+Vila+Velha',
                    instagram: 'https://www.instagram.com/nonalurestaurantes/',
                    img: 'nona_lu.jpg'
                },
                {
                    name: 'Aloha Hawaiian Restaurant',
                    desc: 'Uma ótima opção para almoçar de frente para o mar de Itapuã. Focado na culinária havaiana e praiana, com pratos refrescantes, pokes deliciosos e um clima descontraído.',
                    address: 'Av. Antônio Gil Veloso, 2728 - Itapuã',
                    maps: 'https://www.google.com/maps/search/?api=1&query=Aloha+Hawaiian+Restaurant+Vila+Velha',
                    instagram: 'https://www.instagram.com/alohavilavelha',
                    img: 'aloha.jpg'
                },
                {
                    name: 'Caranguejo do Assis',
                    desc: 'O almoço capixaba definitivo! Restaurante tradicional para comer a verdadeira Moqueca Capixaba, frutos do mar frescos e caranguejada na rua de trás da praia de Itapuã.',
                    address: 'Av. da Praia, 290 - Itapuã',
                    maps: 'https://www.google.com/maps/search/?api=1&query=Caranguejo+do+Assis+Av+da+Praia+290+Vila+Velha',
                    instagram: 'https://www.instagram.com/caranguejodoassis',
                    img: 'caranguejo.jpg'
                }
            ]
        },
        {
            id: 'jantar',
            title: '🌙 Para Jantar (Os Melhores)',
            intro: 'Uma curadoria exclusiva dos restaurantes mais sofisticados e premiados de Vila Velha para um jantar inesquecível e memorável.',
            items: [
                {
                    name: 'Vila Rusticana (A Melhor Pizzaria)',
                    desc: 'A mais premiada da cidade. Pizzas artesanais napolitanas incríveis assadas em forno a lenha com ingredientes premium. Ambiente super charmoso e romântico.',
                    address: 'Av. Antônio Gil Veloso, 1570 - Praia da Costa',
                    maps: 'https://www.google.com/maps/search/?api=1&query=Vila+Rusticana+Pizzaria+Vila+Velha',
                    instagram: 'https://www.instagram.com/vilarusticana',
                    img: 'rusticana.jpg'
                },
                {
                    name: 'Naha Lounge Sushi (O Melhor Japonês)',
                    desc: 'O mais sofisticado restaurante japonês de Vila Velha. Oferece cortes extremamente frescos, peças criativas e um atendimento impecável.',
                    address: 'R. Quinze de Novembro, 535 - Praia da Costa',
                    maps: 'https://www.google.com/maps/search/?api=1&query=Naha+Lounge+Sushi+Vila+Velha',
                    instagram: 'https://www.instagram.com/nahasushilounge/',
                    img: 'naha.jpg'
                },
                {
                    name: 'La Cuchilla (A Melhor Carne)',
                    desc: 'O verdadeiro paraíso para os amantes de um bom churrasco! É o melhor restaurante de cortes nobres e parrilla de Vila Velha. Ambiente extremamente acolhedor, famoso pelo atendimento impecável e carnes suculentas no ponto perfeito. Ideal para um jantar especial.',
                    address: 'Av. Saturnino Rangel Mauro, 194 - Praia de Itaparica',
                    maps: 'https://www.google.com/maps/search/?api=1&query=La+Cuchilla+Parrilla+Vila+Velha',
                    instagram: 'https://www.instagram.com/lacuchillabrasil/',
                    img: 'lacuchilla.jpg'
                }
            ]
        },
        {
            id: 'bares',
            title: '🍻 Bares e Petiscarias',
            intro: 'Opções animadas para curtir a noite de Itapuã, com cerveja gelada, música ao vivo e ótimos petiscos a poucos passos do apartamento.',
            items: [
                {
                    name: 'Sheik\'s Bar',
                    desc: 'Opção excelente e próxima para uma cerveja estupidamente gelada e assistir jogos! Clima animado, cardápio farto e atendimento rápido.',
                    address: 'Rua Dr. Jair de Andrade, 434 - Itapuã',
                    maps: 'https://www.google.com/maps/search/?api=1&query=Sheiks+Bar+Vila+Velha',
                    instagram: 'https://www.instagram.com/sheiksbar/',
                    img: 'sheiks.jpg'
                },
                {
                    name: 'Bar dos Meninos',
                    desc: 'Um clássico moderno de Itapuã! Porções super generosas, espetinhos deliciosos, chopp no ponto e clima descontraído nas noites da cidade.',
                    address: 'Rua Goiânia, 293 - Itapuã',
                    maps: 'https://www.google.com/maps/search/?api=1&query=Bar+dos+Meninos+Itapuã+Vila+Velha',
                    instagram: 'https://www.instagram.com/bardosmeninos',
                    img: 'meninos.jpg'
                },
                {
                    name: 'Roda Velha Petiscaria',
                    desc: 'Ambiente rústico charmoso com música ao vivo e espaço kids com monitora. Perfeito para relaxar em família e degustar porções deliciosas.',
                    address: 'Rua Resplendor, 470 - Itapuã',
                    maps: 'https://www.google.com/maps/search/?api=1&query=Roda+Velha+Petiscaria+Vila+Velha',
                    instagram: 'https://www.instagram.com/rodavelhaitapoa/',
                    img: 'roda_velha.jpg'
                }
            ]
        },
        {
            id: 'gastro',
            title: '🍔 Gastro Parks',
            intro: 'Praças de alimentação a céu aberto com opções para todos os gostos, ambientes ventilados e diversão para as crianças.',
            items: [
                {
                    name: 'Itapuã Gran Park',
                    desc: 'Fica pertinho do apartamento! O mais novo espaço gastronômico de Vila Velha, de frente para o mar! Reúne hambúrgueres artesanais, japonês, pizzas e chopp em um ambiente moderno e ventilado.',
                    address: 'Av. Estudante José Júlio de Souza, 838 - Itapuã',
                    maps: 'https://www.google.com/maps/search/?api=1&query=Itapuã+Gran+Park+Vila+Velha',
                    instagram: 'https://www.instagram.com/itapuagranpark',
                    img: 'gran_park.jpg'
                },
                {
                    name: 'Blu Food Park',
                    desc: 'Complexo moderno na orla da Praia da Costa com pegada urbana. Diversas estações em contêineres e ótima área de recreação infantil.',
                    address: 'Av. Antônio Gil Veloso, 4000 - Praia da Costa',
                    maps: 'https://www.google.com/maps/search/?api=1&query=Blu+Food+Park+Vila+Velha',
                    instagram: 'https://www.instagram.com/blufoodpark',
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

        .restaurant-header h1 {
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
            grid-template-columns: 1fr 1fr;
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

        .action-btn:active {
            transform: scale(0.95);
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
