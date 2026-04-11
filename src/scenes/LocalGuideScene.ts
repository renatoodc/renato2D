import Phaser from 'phaser';

export class LocalGuideScene extends Phaser.Scene {
  constructor() {
    super('LocalGuideScene');
  }

  create() {
    const { width, height } = this.scale;

    // 🌊 UI Expert Skill: Mountain Elite Background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0B1A13, 0x0B1A13, 0x1B4332, 0x1B4332, 1);
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

    // 🏔️ Parques e Picos
    this.addCategorySection(content, "🏔️ Parques e Picos", "section-picos",
        "O coração da região do Caparaó é marcado por montanhas imponentes e vistas de tirar o fôlego. O clima frio e a altitude formam um cenário perfeito para aventureiros.", [
      {
        name: "Parque Nacional do Caparaó",
        desc: "Acesso capixaba (Pedra Menina). Trilhas cênicas, vegetação de altitude e o imponente Pico da Bandeira, o terceiro ponto mais alto do Brasil.",
        trip: "https://www.tripadvisor.com.br/Attraction_Review-g1589146-d2408332-Reviews-Caparao_National_Park-Alto_Caparao_State_of_Minas_Gerais.html",
        maps: "https://www.google.com/maps/search/Portaria+Pedra+Menina+Parque+Nacional+do+Caparaó",
        tag: "picos"
      },
      {
        name: "Pico da Bandeira",
        desc: "Aos 2.892 metros de altitude, assistir ao nascer do sol no topo das nuvens é a experiência suprema da região.",
        trip: "https://www.tripadvisor.com.br/Attraction_Review-g1589146-d2408332-Reviews-Caparao_National_Park-Alto_Caparao_State_of_Minas_Gerais.html",
        maps: "https://www.google.com/maps/search/Pico+da+Bandeira",
        tag: "picos"
      }
    ]);

    // 💦 Cachoeiras
    this.addCategorySection(content, "💦 Cachoeiras", "section-cachoeiras",
        "As águas cristalinas (e geladas!) que descem das montanhas formam poços e quedas d'água perfeitos para renovar as energias.", [
      {
        name: "Cachoeiras de Patrimônio da Penha",
        desc: "Uma vila mística no Caparaó Capixaba com trilhas curtas que revelam poços deslumbrantes como a Cachoeira do Arco-Íris.",
        trip: "https://www.tripadvisor.com.br/Attraction_Review-g2343207-d10037110-Reviews-Cachoeira_Veu_de_Noiva-Divino_de_Sao_Lourenco_State_of_Espirito_Santo.html",
        maps: "https://www.google.com/maps/search/Patrimônio+da+Penha",
        tag: "cachoeiras"
      },
      {
        name: "Poço do Egito",
        desc: "Em Iúna, este poço de águas cristalinas com tons verde-esmeralda é um dos refúgios mais bonitos da serra.",
        trip: "https://www.tripadvisor.com.br/Attraction_Review-g2343217-d23805908-Reviews-Poco_Do_Egito-Iuna_State_of_Espirito_Santo.html",
        maps: "https://www.google.com/maps/search/Poço+do+Egito+Iúna",
        tag: "cachoeiras"
      },
      {
        name: "Cachoeira da Fumaça",
        desc: "Uma queda exuberante e forte no Parque Estadual da Cachoeira da Fumaça. Ótimo acesso.",
        trip: "https://www.tripadvisor.com.br/Attraction_Review-g2343167-d8675402-Reviews-Cachoeira_da_Fumaca-Alegre_State_of_Espirito_Santo.html",
        maps: "https://www.google.com/maps/search/Cachoeira+da+Fumaça+Alegre",
        tag: "cachoeiras"
      }
    ]);

    // ☕ Rotas do Café
    this.addCategorySection(content, "☕ Café Especial e Agroturismo", "section-cafes", 
        "A região do Caparaó e as Montanhas Capixabas ganharam prêmios globais por seus cafés especiais. Visite as propriedades e deguste direto na fonte.", [
      {
        name: "Tecelagem e Cafés de Dores do Rio Preto",
        desc: "Propriedades rurais que combinam a tradição do café especial com artesanato primoroso e queijos premiados.",
        trip: "https://www.tripadvisor.com.br/Tourism-g2343208-Dores_do_Rio_Preto_State_of_Espirito_Santo-Vacations.html",
        maps: "https://www.google.com/maps/search/Cafés+Dores+do+Rio+Preto",
        tag: "cafes"
      },
      {
        name: "Roteiro do Café em Iúna e Irupi",
        desc: "Degustação guiada em fazendas familiares, onde é possível conhecer desde a plantação até a torra do café nas montanhas.",
        trip: "https://www.tripadvisor.com.br/Tourism-g2343217-Iuna_State_of_Espirito_Santo-Vacations.html",
        maps: "https://www.google.com/maps/search/Rotas+do+café+Caparaó+Capixaba",
        tag: "cafes"
      }
    ]);

    // 🏡 Vilas e Lazer
    this.addCategorySection(content, "🏡 Vilas Charmosas", "section-vilas",
        "Centrinhos rústicos ideais para tomar um vinho, passear à noite e curtir o clima de chalé.", [
      {
        name: "Centro de Patrimônio da Penha",
        desc: "Ruas charmosas de paralelepípedo, lojinhas místicas, cervejarias artesanais e gastronomia com ingredientes locais.",
        trip: "https://www.tripadvisor.com.br/Tourism-g2343207-Divino_de_Sao_Lourenco_State_of_Espirito_Santo-Vacations.html",
        maps: "https://www.google.com/maps/search/Centro+Patrimônio+da+Penha",
        tag: "vilas"
      },
      {
        name: "Vila de Pedra Menina",
        desc: "Último povoado antes da portaria do Parque Nacional, repleto de pousadas rústicas e opções para jantar após a trilha.",
        trip: "https://www.tripadvisor.com.br/Tourism-g2343208-Dores_do_Rio_Preto_State_of_Espirito_Santo-Vacations.html",
        maps: "https://www.google.com/maps/search/Pedra+Menina+ES",
        tag: "vilas"
      }
    ]);

    // Footer
    const footer = document.createElement('div');
    footer.className = 'guide-footer';
    footer.innerHTML = `👋 Tenha uma excelente estadia nas Montanhas Capixabas!`;
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
    title.innerText = 'AVENTURA & NATUREZA';
    title.style.fontFamily = 'Cinzel, serif';

    header.appendChild(backBtn);
    header.appendChild(title);
    return header;
  }

  private observer: IntersectionObserver | null = null;

  private createAnchorMenu() {
    const menu = document.createElement('div');
    menu.className = 'anchor-menu';
    
    const categories = [
        { label: '🏔️ Picos', id: 'section-picos' },
        { label: '💦 Cachoeiras', id: 'section-cachoeiras' },
        { label: '☕ Grãos', id: 'section-cafes' },
        { label: '🏡 Vilas', id: 'section-vilas' }
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
<<<<<<< HEAD
            overflow: hidden;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            font-family: 'Outfit', 'Inter', sans-serif;
=======
            overflow-y: auto;
            background: linear-gradient(135deg, #0B1A13 0%, #1B4332 100%);
            font-family: 'Cinzel', 'Outfit', 'Inter', sans-serif;
>>>>>>> 0ae1c626049b3f7fbf97f56a19d48a58009428c0
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
<<<<<<< HEAD
            background: white;
=======
            background: rgba(11, 26, 19, 0.95);
            backdrop-filter: blur(10px);
>>>>>>> 0ae1c626049b3f7fbf97f56a19d48a58009428c0
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
            background: rgba(212, 175, 55, 0.15);
            border: 1px solid #D4AF37;
            padding: 8px 12px;
            border-radius: 20px;
            font-weight: 600;
            color: #D4AF37;
            cursor: pointer;
            transition: all 0.2s;
        }

        .guide-header h1 {
            margin: 0;
            font-size: 1.15rem;
            color: #D4AF37;
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
            background: rgba(11, 26, 19, 0.1);
        }

        .anchor-menu button {
            background: #0B1A13;
            border: 1px solid #D4AF37;
            padding: 14px 10px;
            border-radius: 16px;
            font-size: 0.85rem;
            font-weight: 700;
            color: #D4AF37;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
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
            color: #1B4332;
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
            background: #D4AF37;
            color: #0B1A13;
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
