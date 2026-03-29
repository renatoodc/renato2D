import Phaser from 'phaser';

export class MarketScene extends Phaser.Scene {
  constructor() {
    super('MarketScene');
  }

  create() {
    const { width, height } = this.scale;

    // 🌊 UI Expert Background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x1e3c72, 0x1e3c72, 0x2a5298, 0x2a5298, 1);
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

    // 🛒 Section: Supermercados
    this.createSection(content, 'supermercados', '🛒 Supermercados', 
      'Para garantir o máximo de conforto durante a sua estadia, mapeamos os melhores supermercados e lojas de conveniência a poucos passos do apartamento. Seja para comprar os ingredientes de um jantar especial, garantir a carne do churrasco ou apenas repor itens básicos e bebidas geladas, você encontrará opções excelentes sem precisar tirar o carro da garagem (mercados no ES não abrem aos domingos).',
      [
        { 
          name: 'Extrabom Supermercados Itapoã', 
          img: 'extrabom.jpg', 
          desc: 'Localizado a menos de 300 metros do apartamento, ideal para ir a pé e resolver as compras da semana. Ótima opção com preços excelentes, boa seção de frutas e verduras frescas e bastante variedade de marcas.',
          maps: 'https://www.google.com/maps/search/?api=1&query=Extrabom+Supermercados+Itapo%C3%A3+Vila+Velha'
        },
        { 
          name: 'Supermercado Perim - Itapuã', 
          img: 'perim.jpg', 
          desc: 'É indiscutivelmente o melhor e mais completo supermercado de toda a região! Estrutura premium, excelente para quem busca produtos diferenciados, importados, uma padaria de altíssima qualidade e cortes de carnes especiais.',
          maps: 'https://www.google.com/maps/search/?api=1&query=Supermercado+Perim+Rua+Deolindo+Perim+350+Vila+Velha'
        },
        { 
          name: 'Supermercado Carone - Itapoã', 
          img: 'carone.jpg', 
          desc: 'A cerca de 3 minutinhos de caminhada. É um dos supermercados mais completos e premium do bairro. Excelente opção para comprar carnes para churrasco, vinhos, queijos e lanches rápidos.',
          maps: 'https://www.google.com/maps/search/?api=1&query=Supermercado+Carone+Itapo%C3%A3+Vila+Velha'
        },
        { 
          name: 'Supermercado BH', 
          img: 'bh.jpg', 
          desc: 'Famosos pelos preços super competitivos e excelente custo-benefício para compras maiores. Muito prático para o dia a dia e para repor bebidas e itens básicos de forma econômica durante a estadia.',
          maps: 'https://www.google.com/maps/search/?api=1&query=Supermercados+BH+Itapu%C3%A3+Vila+Velha'
        },
        { 
          name: 'Multishow Express Itapuã: Carnes e Bebidas', 
          img: 'multishow.jpg', 
          desc: 'Como o nome já diz, é o lugar ideal e certeiro para salvar o churrasco do final de semana! Foco em grande variedade de carnes selecionadas, carvão e bebidas geladas.',
          maps: 'https://www.google.com/maps/search/?api=1&query=Multishow+Express+Rua+Santa+Catarina+402+Itapu%C3%A3+Vila+Velha'
        },
        { 
          name: 'Hipermercado Carrefour (Antigo Walmart)', 
          img: 'carrefour.jpg', 
          desc: 'Localizado dentro do Shopping Vila Velha, unindo a conveniência das compras com um passeio completo. Hipermercado gigantesco, ideal para grandes volumes. (Dica: por estar dentro do Shopping, é um dos únicos mercados aberto aos domingos).',
          maps: 'https://www.google.com/maps/search/?api=1&query=Shopping+Vila+Velha+Carrefour'
        }
      ]
    );

    // 🍅 Section: Feiras Livres
    this.createSection(content, 'feiras', '🍅 Feiras e Mercados Tradicionais', 
      'Nada melhor do que viver a experiência local visitando as tradicionais feiras da nossa cidade! Elas acontecem pela manhã e são perfeitas para comprar produtos frescos, artesanatos e tomar aquele clássico café da manhã de rua.',
      [
        { 
          name: 'Feira Livre de Itapuã', 
          img: 'feira_itapua.jpg', 
          desc: 'Sábados, 04h às 13h, na Rua Jaime Duarte (próximo ao Estádio Tupy). Fica super pertinho do apartamento! É uma das maiores feiras da região, ideal para frutas, temperos e o tradicional pastel com caldo de cana.',
          maps: 'https://www.google.com/maps/search/?api=1&query=Rua+Jaime+Duarte+Nascimento+Itapuã+Vila+Velha'
        },
        { 
          name: 'Feira Parque das Castanheiras', 
          img: 'feira_castanheiras.jpg', 
          desc: 'Sábados pela manhã, na Rua João Joaquim da Mota (Praia da Costa). Uma feirinha com pegada "premium" e super charmosa. Excelente lugar para hortifrúti selecionado, artesanato, decoração e flores.',
          maps: 'https://www.google.com/maps/search/?api=1&query=Rua+João+Joaquim+da+Mota+Parque+das+Castanheiras+Vila+Velha'
        },
        { 
          name: 'Mercado de Peixes da Prainha', 
          img: 'peixes_prainha.jpg', 
          desc: 'Sábados e domingos pela manhã (até as 13h), localizado no Parque da Prainha. O ponto mais tradicional da cidade para comprar pescados e frutos do mar super frescos, tanto no varejo quanto atacado.',
          maps: 'https://www.google.com/maps/search/?api=1&query=Mercado+de+Peixe+da+Prainha+Vila+Velha'
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
    backBtn.innerHTML = '🔙 Voltar';
    backBtn.onclick = () => {
        this.cameras.main.fadeOut(300, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('WelcomeScene');
        });
    };

    const title = document.createElement('h1');
    title.innerText = 'MERCADOS E FEIRAS';

    header.appendChild(backBtn);
    header.appendChild(title);
    return header;
  }

  private createCategoryMenu() {
    const menu = document.createElement('div');
    menu.className = 'market-category-menu';
    menu.innerHTML = `
        <button class="cat-btn active" data-target="supermercados">🛒 Supermercados</button>
        <button class="cat-btn" data-target="feiras">🍅 Feiras Livres</button>
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
            <div class="card-img" style="background-image: url('assets/market/${item.img}')">
                <div class="card-img-placeholder">Adicionar Foto: ${item.img}</div>
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
            width: 100vw;
            height: 100vh;
            overflow-y: auto;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            font-family: 'Outfit', 'Inter', sans-serif;
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
        }

        .market-header h1 {
            margin: 0;
            font-size: 1.1rem;
            color: #1e3c72;
            letter-spacing: 2px;
            font-weight: 800;
        }

        .market-category-menu {
            position: sticky;
            top: 55px;
            z-index: 1500;
            background: rgba(255, 255, 255, 0.9);
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
            background: #1e3c72;
            color: white;
            border-color: #1e3c72;
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
            height: 200px;
            background-size: cover;
            background-position: center;
            background-color: #eee;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .card-img-placeholder {
            background: rgba(0,0,0,0.5);
            color: white;
            padding: 10px 20px;
            border-radius: 10px;
            font-size: 0.8rem;
            text-align: center;
        }

        .card-body {
            padding: 20px;
        }

        .card-body h3 {
            margin: 0 0 10px 0;
            color: #1e3c72;
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
            background: #1e3c72;
            color: white;
        }
        
        .action-btn:active {
            transform: scale(0.98);
        }
    `;
    container.appendChild(style);
  }
}
