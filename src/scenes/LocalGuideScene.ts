import Phaser from 'phaser';

export class LocalGuideScene extends Phaser.Scene {
  constructor() {
    super('LocalGuideScene');
  }

  create() {
    const { width, height } = this.scale;

    // 🌊 UI Expert Skill: Resort Elite Background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x3a7bd5, 0x3a7bd5, 0x00aaff, 0x00aaff, 1);
    bg.fillRect(0, 0, width, height);

    // 🏆 Landing Page Container (HTML/CSS Overlay)
    const container = document.createElement('div');
    container.id = 'guide-landing-page';
    this.applyStyles(container);

    // 📝 Header Section (Sticky)
    const header = this.createHeader();
    container.appendChild(header);

    // 🔗 Anchor Menu (Quick-Jump)
    const anchorMenu = this.createAnchorMenu();
    container.appendChild(anchorMenu);

    // 📄 Main Content Wrapper
    const content = document.createElement('div');
    content.className = 'guide-content';
    container.appendChild(content);



    // 🏛️ Histórico
    this.addCategorySection(content, "🏛️ Pontos Históricos", "section-historico",
        "Vila Velha não é apenas um destino de belas praias, mas também o berço da história capixaba. Fundada em 1535, nossa cidade reserva tesouros arquitetônicos e religiosos que sobreviveram aos séculos.", [
      {
        name: "Convento da Penha",
        desc: "O maior símbolo do estado, localizado no topo de um penhasco com uma vista deslumbrante.",
        trip: "https://www.tripadvisor.com.br/Attraction_Review-g303319-d2408107-Reviews-Nossa_Senhora_da_Penha_Convent-Vila_Velha_State_of_Espirito_Santo.html",
        maps: "https://maps.app.goo.gl/NjgcGSTgr3Ct7Ewp7",
        tag: "historico"
      },
      {
        name: "Farol Santa Luzia",
        desc: "Marco histórico charmoso, construído com peças trazidas da Escócia em 1870.",
        trip: "https://www.tripadvisor.com.br/Attraction_Review-g303319-d8533291-Reviews-Farol_de_Santa_Luzia-Vila_Velha_State_of_Espirito_Santo.html",
        maps: "https://www.google.com/maps/search/Farol+Santa+Luzia+Vila+Velha",
        tag: "historico"
      },
      {
        name: "Igreja Matriz de Nossa Senhora do Rosário",
        desc: "O marco religioso mais antigo em funcionamento no Brasil. Tesouro da colonização.",
        trip: "https://www.tripadvisor.com.br/Attraction_Review-g303319-d6589501-Reviews-Igreja_De_Nossa_Senhora_Do_Rosario-Vila_Velha_State_of_Espirito_Santo.html",
        maps: "https://www.google.com/maps/search/Igreja+Matriz+do+Rosário+Vila+Velha",
        tag: "historico"
      },
      {
        name: "Fábrica de Chocolates Garoto",
        desc: "Viagem ao mundo dos doces em uma das fábricas mais icônicas da América Latina.",
        trip: "https://www.tripadvisor.com.br/Attraction_Review-g303319-d10807919-Reviews-Museu_Garoto-Vila_Velha_State_of_Espirito_Santo.html",
        maps: "https://www.google.com/maps/search/Fábrica+Garoto+Vila+Velha",
        tag: "historico"
      },
      {
        name: "Casa da Memória de Vila Velha",
        desc: "O guardião da rica história capixaba, situado em um casarão antigo preservado.",
        trip: "https://www.tripadvisor.com.br/Attraction_Review-g303319-d4377763-Reviews-Casa_da_Memoria_de_Vila_Velha-Vila_Velha_State_of_Espirito_Santo.html",
        maps: "https://www.google.com/maps/search/Casa+da+Memória+Vila+Velha",
        tag: "historico"
      },
      {
        name: "Parque da Prainha",
        desc: "A praça que marca o local exato onde a cidade foi fundada em 1535.",
        trip: "https://www.tripadvisor.com.br/Attraction_Review-g303319-d8821555-Reviews-Parque_da_Prainha-Vila_Velha_State_of_Espirito_Santo.html",
        maps: "https://www.google.com/maps/search/Parque+da+Prainha+Vila+Velha",
        tag: "historico"
      }
    ]);

    // 🏖️ Praias
    this.addCategorySection(content, "🏖️ Melhores Praias", "section-praias",
        "Com mais de 32 km de litoral, Vila Velha é dona de algumas das praias mais cobiçadas do Sudeste. O sol brilha o ano todo!", [
      {
        name: "Praia da Costa",
        desc: "A praia urbana mais famosa da cidade. Extensa faixa de areia dourada e águas claras.",
        trip: "https://www.tripadvisor.com.br/Attraction_Review-g303319-d2408104-Reviews-Praia_da_Costa-Vila_Velha_State_of_Espirito_Santo.html",
        maps: "https://www.google.com/maps/search/Praia+da+Costa+Vila+Velha",
        tag: "praias"
      },
      {
        name: "Praia de Itapuã",
        desc: "A poucos passos do nosso apartamento! Ambiente familiar e ponto de partida para ilhas.",
        trip: "https://www.tripadvisor.com.br/Attraction_Review-g303319-d2408105-Reviews-Praia_de_Itapua-Vila_Velha_State_of_Espirito_Santo.html",
        maps: "https://www.google.com/maps/search/Praia+de+Itapuã+Vila+Velha",
        tag: "praias"
      },
      {
        name: "Praia da Sereia",
        desc: "Refúgio de águas calmas que parecem uma piscina natural. Super segura.",
        trip: "https://www.tripadvisor.com.br/Attraction_Review-g303319-d4056565-Reviews-Praia_da_Sereia-Vila_Velha_State_of_Espirito_Santo.html",
        maps: "https://www.google.com/maps/search/Praia+da+Sereia+Vila+Velha",
        tag: "praias"
      },
      {
        name: "Praia Secreta",
        desc: "Refúgio altamente fotogênico escondido próximo ao Farol, com águas cristalinas.",
        trip: "https://www.tripadvisor.com.br/LocationPhotoDirectLink-g303319-d15837903-i415886611-Praia_Secreta_de_Vila_Velha-Vila_Velha_State_of_Espirito_Santo.html",
        maps: "https://www.google.com/maps/search/Praia+Secreta+Vila+Velha",
        tag: "praias"
      }
    ]);

    // 🌳 Natureza
    this.addCategorySection(content, "🌳 Natureza e Aventura", "section-natureza", 
        "Contraste entre a cidade e a Mata Atlântica. Pôr do sol cinematográfico e agroturismo no interior.", [
      {
        name: "Morro do Moreno",
        desc: "Mirante natural espetacular. Ideal para assistir ao nascer ou pôr do sol.",
        trip: "https://www.tripadvisor.com.br/Attraction_Review-g303319-d3536151-Reviews-Morro_do_Moreno-Vila_Velha_State_of_Espirito_Santo.html",
        maps: "https://www.google.com/maps/search/Morro+do+Moreno+Vila+Velha",
        tag: "natureza"
      },
      {
        name: "Fazenda Rico Caipira",
        desc: "Refúgio perfeito de agroturismo com charrete, tirolesa e comida no fogão a lenha.",
        trip: "https://www.tripadvisor.com.br/Attraction_Review-g303319-d9796897-Reviews-Fazenda_Rico_Caipira-Vila_Velha_State_of_Espirito_Santo.html",
        maps: "https://www.google.com/maps/search/Fazenda+Rico+Caipira+Vila+Velha",
        tag: "natureza"
      }
    ]);

    // 🛍️ Shoppings
    this.addCategorySection(content, "🛍️ Shoppings e Lazer", "section-compras",
        "Grandes complexos comerciais para um dia de chuva ou lazer noturno.", [
      {
        name: "Shopping Vila Velha",
        desc: "O maior centro de compras e entretenimento do estado. Ideal para lazer noturno.",
        trip: "https://www.tripadvisor.com.br/Attraction_Review-g303319-d7133210-Reviews-Shopping_Vila_Velha-Vila_Velha_State_of_Espirito_Santo.html",
        maps: "https://www.google.com/maps/search/Shopping+Vila+Velha",
        tag: "compras"
      },
      {
        name: "Shopping Praia da Costa",
        desc: "Ambiente íntimo, charmoso e sofisticado, com foco em moda e gastronomia gourmet.",
        trip: "https://www.tripadvisor.com.br/Attraction_Review-g303319-d4126472-Reviews-Shopping_Praia_Da_Costa-Vila_Velha_State_of_Espirito_Santo.html",
        maps: "https://www.google.com/maps/search/Shopping+Praia+da+Costa",
        tag: "compras"
      },
      {
        name: "Boulevard Shopping Vila Velha",
        desc: "Arquitetura moderna, corredores espaçosos e farta área de lazer infantil.",
        trip: "https://www.tripadvisor.com.br/Attraction_Review-g303319-d3929041-Reviews-Boulevard_Shopping-Vila_Velha_State_of_Espirito_Santo.html",
        maps: "https://www.google.com/maps/search/Boulevard+Shopping+Vila+Velha",
        tag: "compras"
      }
    ]);

    // Footer
    const footer = document.createElement('div');
    footer.className = 'guide-footer';
    footer.innerHTML = `👋 Tenha uma excelente estadia em Vila Velha!`;
    content.appendChild(footer);

    // 🚀 Inject into Phaser
    this.add.dom(width / 2, height / 2, container);
    
    // 🕵️ UI Expert: Touch-to-Dismiss Logic
    this.setupTouchDismiss(container, content);

    // Fade in
    this.cameras.main.fadeIn(500, 0, 0, 0);

    // 🕵️ UI Expert: Scroll Reveal Animations
    this.setupScrollReveal();
  }

  private setupTouchDismiss(container: HTMLElement, scrollTarget: HTMLElement) {
    let startY = 0;
    let startScrollTop = 0;
    let currentY = 0;
    let isDragging = false;
 
    container.addEventListener('touchstart', (e) => {
        startY = e.touches[0].pageY;
        startScrollTop = scrollTarget.scrollTop;
        isDragging = true;
        container.style.transition = 'none';
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        currentY = e.touches[0].pageY;
        const deltaY = currentY - startY;

        // 🔍 UI Expert Detail: Manual Scrolling Emulation
        // This ensures the page is scrollable even if Phaser blocks native input.
        scrollTarget.scrollTop = startScrollTop - deltaY;
        
        // Reset transform to ensure it stays pinned
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

  private setupScrollReveal() {
    const options = { threshold: 0.15 };
    this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
            }
        });
    }, options);

    document.querySelectorAll('.category-section').forEach(section => {
        section.classList.add('reveal-item');
        this.observer?.observe(section);
    });
  }

  // Cleanup to prevent memory leaks
  shutdown() {
    this.observer?.disconnect();
  }

  private createHeader() {
    const header = document.createElement('div');
    header.className = 'guide-header';
    
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
    title.innerText = 'PONTOS TURÍSTICOS';

    header.appendChild(backBtn);
    header.appendChild(title);
    return header;
  }

  private observer: IntersectionObserver | null = null;

  private createAnchorMenu() {
    const menu = document.createElement('div');
    menu.className = 'anchor-menu';
    
    const categories = [
        { label: '🏛️ Histórico', id: 'section-historico' },
        { label: '🏖️ Praias', id: 'section-praias' },
        { label: '🌳 Natureza', id: 'section-natureza' },
        { label: '🛍️ Shoppings', id: 'section-compras' }
    ];

    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.innerText = cat.label;
        btn.onclick = () => {
            const el = document.getElementById(cat.id);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        };
        menu.appendChild(btn);
    });

    return menu;
  }

  private addCategorySection(parent: HTMLElement, title: string, id: string, intro: string, locations: any[]) {
    const section = document.createElement('section');
    section.id = id;
    section.className = 'category-section reveal-item';

    const h2 = document.createElement('h2');
    h2.innerText = title;
    section.appendChild(h2);

    const p = document.createElement('p');
    p.className = 'category-intro';
    p.innerText = intro;
    section.appendChild(p);

    const grid = document.createElement('div');
    grid.className = 'location-grid';
    locations.forEach(loc => {
        const card = this.createLocationCard(loc);
        grid.appendChild(card);
    });
    section.appendChild(grid);

    parent.appendChild(section);
  }

  private createLocationCard(loc: any) {
    const card = document.createElement('div');
    card.className = 'location-card';

    // Image Placeholder OR Real Photo (Supporting multiple extensions)
    const imageName = loc.name.toLowerCase().replace(/ /g, '_').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    const imgContainer = document.createElement('div');
    imgContainer.className = 'card-image';
    
    // UI Expert Skill: Hybrid Loading Logic
    // We attempt JPG, JPEG, and PNG in order, then fallback to placeholder
    const formats = ['jpg', 'jpeg', 'png', 'JPG', 'JPEG', 'jpg.jpeg'];
    let backgrounds = formats.map(ext => `url('assets/img/guia/${imageName}.${ext}')`);
    backgrounds.push(`url('https://placehold.co/600x400/3a7bd5/ffffff?text=${encodeURIComponent(loc.name)}')`);
    
    imgContainer.style.backgroundImage = backgrounds.join(', ');

    const info = document.createElement('div');
    info.className = 'card-info';
    
    const h3 = document.createElement('h3');
    h3.innerText = loc.name;
    
    const desc = document.createElement('p');
    desc.innerText = loc.desc;

    const btns = document.createElement('div');
    btns.className = 'card-actions';

    const mapBtn = document.createElement('a');
    mapBtn.href = loc.maps;
    mapBtn.target = '_blank';
    mapBtn.className = 'btn-maps';
    mapBtn.innerHTML = '📍 Ver no Mapa';

    const tripBtn = document.createElement('a');
    tripBtn.href = loc.trip;
    tripBtn.target = '_blank';
    tripBtn.className = 'btn-trip';
    tripBtn.innerHTML = '⭐ TripAdvisor';

    btns.appendChild(mapBtn);
    btns.appendChild(tripBtn);
    
    info.appendChild(h3);
    info.appendChild(desc);
    info.appendChild(btns);

    card.appendChild(imgContainer);
    card.appendChild(info);

    return card;
  }

  private applyStyles(container: HTMLElement) {
    const style = document.createElement('style');
    style.innerHTML = `
        #guide-landing-page {
            position: relative;
            width: 100%;
            height: 100dvh;
            overflow: hidden;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            font-family: 'Outfit', 'Inter', sans-serif;
            color: #333;
        }

        /* 🎬 Scroll Reveal Effects */
        .reveal-item {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .reveal-visible {
            opacity: 1;
            transform: translateY(0);
        }

        .guide-header {
            position: absolute;
            top: 0; left: 0; right: 0;
            height: 60px;
            z-index: 1000;
            background: white;
            padding: 15px 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            box-sizing: border-box;
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

        .guide-header h1 {
            margin: 0;
            font-size: 1.15rem;
            color: #1e3c72;
            letter-spacing: 2px;
            font-weight: 950;
            text-transform: uppercase;
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

        .guide-content {
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

        .category-section h2 {
            color: white;
            font-size: 1.6rem;
            margin-top: 40px;
            margin-bottom: 10px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .category-intro {
            color: rgba(255, 255, 255, 0.9);
            font-size: 0.95rem;
            line-height: 1.6;
            margin-bottom: 25px;
        }

        .location-grid {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .location-card {
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
            transition: transform 0.3s;
        }

        .card-image {
            height: 180px;
            background-size: cover;
            background-position: center;
        }

        .card-info {
            padding: 20px;
        }

        .card-info h3 {
            margin: 0 0 10px 0;
            font-size: 1.2rem;
            color: #2c3e50;
        }

        .card-info p {
            font-size: 0.9rem;
            color: #555;
            line-height: 1.5;
            margin-bottom: 20px;
        }

        .card-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }

        .card-actions a {
            text-decoration: none;
            padding: 12px;
            border-radius: 12px;
            text-align: center;
            font-size: 0.85rem;
            font-weight: 700;
            transition: opacity 0.2s;
        }

        .btn-maps {
            background: #34a853;
            color: white;
        }

        .btn-trip {
            background: #ffc107;
            color: #2c3e50;
        }

        .guide-footer {
            text-align: center;
            padding: 50px 0;
            color: white;
            font-weight: 600;
            opacity: 0.8;
        }
    `;
    container.appendChild(style);
  }
}
