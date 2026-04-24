import Phaser from 'phaser';

export class BookingScene extends Phaser.Scene {
  constructor() {
    super('BookingScene');
  }

  create() {
    const { width, height } = this.scale;

    // Background Gradient (Premium UI)
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x2a5298, 0x2a5298, 0x1e3c72, 0x1e3c72, 1);
    bg.fillRect(0, 0, width, height);

    // Contêiner principal
    const container = document.createElement('div');
    container.id = 'booking-page';
    this.applyStyles(container);

    // Header
    const header = this.createHeader();
    container.appendChild(header);

    // Corpo de conteúdo
    const content = document.createElement('div');
    content.className = 'booking-content';
    container.appendChild(content);

    // Introdução - Vantagem da Reserva Direta
    const introCard = document.createElement('div');
    introCard.className = 'info-card mb-30';
    introCard.innerHTML = `
        <div class="card-icon">💡</div>
        <div class="card-text">
            <h3>Por que reservar direto?</h3>
            <p>Ao realizar sua próxima reserva diretamente conosco, você <strong>foge das taxas das plataformas de reserva</strong> e garante o melhor preço possível com condições exclusivas para hóspedes recorrentes StayVerse.</p>
        </div>
    `;
    content.appendChild(introCard);

    // Formulário de Reserva
    const formCard = document.createElement('div');
    formCard.className = 'booking-form-card';
    formCard.innerHTML = `
        <h3>Escolha a data da próxima viagem</h3>
        <p>Selecione as datas da sua estadia:</p>
        
        <div style="text-align: left; padding-left: 5px; margin-bottom: 5px; font-size: 0.9rem; font-weight: 700; color: #1e3c72;">Check-in</div>
        <input type="date" id="booking-checkin" class="text-input" />

        <div style="text-align: left; padding-left: 5px; margin-bottom: 5px; font-size: 0.9rem; font-weight: 700; color: #1e3c72;">Check-out</div>
        <input type="date" id="booking-checkout" class="text-input" />
        
        <input type="number" id="booking-guests" class="text-input" placeholder="Quantidade de Hóspedes" min="1" />
        
        <input type="text" id="booking-coupon" class="text-input" placeholder="Cupom de desconto (opcional)" />
        
        <button id="btn-check-availability" class="whatsapp-btn">
            💬 Conferir Disponibilidade
        </button>
    `;
    content.appendChild(formCard);

    // Footer
    const footer = document.createElement('div');
    footer.className = 'booking-footer';
    footer.innerHTML = `
        <p>Ao clicar, você será redirecionado para o nosso atendimento direto pelo WhatsApp.</p>
    `;
    content.appendChild(footer);

    this.add.dom(width / 2, height / 2, container);
    this.setupTouchDismiss(container, content);
    
    // Configura o evento do botão do WhatsApp
    const btnCheck = container.querySelector('#btn-check-availability');
    const inputCheckin = container.querySelector('#booking-checkin') as HTMLInputElement;
    const inputCheckout = container.querySelector('#booking-checkout') as HTMLInputElement;
    const inputGuests = container.querySelector('#booking-guests') as HTMLInputElement;
    const inputCoupon = container.querySelector('#booking-coupon') as HTMLInputElement;

    if (btnCheck && inputCheckin && inputCheckout && inputGuests) {
      btnCheck.addEventListener('click', () => {
        const rawCheckin = inputCheckin.value;
        const rawCheckout = inputCheckout.value;
        const qtdGuests = inputGuests.value.trim();
        
        if (!rawCheckin || !rawCheckout || !qtdGuests) {
            alert('Por favor, preencha as datas de check-in/check-out e a quantidade de hóspedes antes de prosseguir.');
            return;
        }

        const cinParts = rawCheckin.split('-');
        const formattedCheckin = `${cinParts[2]}/${cinParts[1]}/${cinParts[0]}`;

        const coutParts = rawCheckout.split('-');
        const formattedCheckout = `${coutParts[2]}/${coutParts[1]}/${coutParts[0]}`;

        const phone = '5527996515433';
        let message = `Olá! Vim pelo guia StayVerse e gostaria de conferir a disponibilidade para o imóvel *Itaipava 201*.\n\n*Check-in:* ${formattedCheckin}\n*Check-out:* ${formattedCheckout}\n*Hóspedes:* ${qtdGuests}`;
        
        if (inputCoupon && inputCoupon.value.trim() !== '') {
            message += `\nCupom: *${inputCoupon.value.trim()}*`;
        }

        const encodedMessage = encodeURIComponent(message);
        
        window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
      });
    }

    this.cameras.main.fadeIn(500, 0, 0, 0);
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
 
        scrollTarget.scrollTop = startScrollTop - deltaY;
    }, { passive: true });

    container.addEventListener('touchend', () => {
        isDragging = false;
    });
  }

  private createHeader() {
    const header = document.createElement('div');
    header.className = 'booking-header';
    
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
    title.innerText = 'RESERVA DIRETA';

    header.appendChild(backBtn);
    header.appendChild(title);
    return header;
  }

  private applyStyles(container: HTMLElement) {
    const style = document.createElement('style');
    style.innerHTML = `
        #booking-page {
            position: relative;
            width: 100%;
            height: 100dvh;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            background: linear-gradient(135deg, #2a5298 0%, #1e3c72 100%);
            font-family: 'Outfit', sans-serif;
            color: white;
            box-sizing: border-box;
        }

        .booking-header {
            position: sticky;
            top: 0;
            height: 70px;
            z-index: 1000;
            background: white;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 30px rgba(0,0,0,0.15);
            box-sizing: border-box;
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

        .booking-header h1 {
            margin: 0;
            font-size: 1.1rem;
            color: #1e3c72;
            letter-spacing: 1px;
            font-weight: 950;
            text-align: left;
            padding-left: 110px;
            padding-right: 20px;
            text-transform: uppercase;
        }

        .booking-content {
            padding: 30px 20px 80px;
            max-width: 480px;
            margin: 0 auto;
            width: 100%;
            box-sizing: border-box;
        }

        .mb-30 { margin-bottom: 30px; }

        .info-card {
            background: rgba(255, 255, 255, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 24px;
            padding: 25px 20px;
            display: flex;
            align-items: flex-start;
            gap: 15px;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        }

        .info-card .card-icon {
            font-size: 2rem;
            line-height: 1;
        }

        .info-card h3 {
            margin: 0 0 10px 0;
            color: #ffcc00;
            font-size: 1.3rem;
        }

        .info-card p {
            margin: 0;
            color: rgba(255, 255, 255, 0.9);
            font-size: 1rem;
            line-height: 1.5;
        }

        .booking-form-card {
            background: white;
            border-radius: 28px;
            padding: 35px 25px;
            text-align: center;
            box-shadow: 0 20px 50px rgba(0,0,0,0.25);
            color: #1e3c72;
        }

        .booking-form-card h3 {
            margin: 0 0 10px 0;
            font-size: 1.4rem;
            font-weight: 900;
        }

        .booking-form-card p {
            color: #555;
            font-size: 1rem;
            margin: 0 0 25px 0;
        }

        .text-input {
            width: 100%;
            box-sizing: border-box;
            padding: 16px 20px;
            font-size: 1.1rem;
            font-family: 'Outfit', sans-serif;
            font-weight: 600;
            color: #1e3c72;
            background: #f0f4f8;
            border: 2px solid #aec2d6;
            border-radius: 16px;
            margin-bottom: 20px;
            outline: none;
            transition: border-color 0.3s;
        }

        .text-input::placeholder {
            color: #8faac2;
            font-weight: 500;
        }

        .text-input:focus {
            border-color: #3a7bd5;
        }
        
        .text-input::-webkit-calendar-picker-indicator {
            cursor: pointer;
            opacity: 0.6;
            transition: 0.2s;
        }
        .date-input::-webkit-calendar-picker-indicator:hover {
            opacity: 1;
        }

        .whatsapp-btn {
            display: block;
            width: 100%;
            background: linear-gradient(135deg, #25D366, #128C7E);
            color: white;
            border: none;
            padding: 18px 20px;
            border-radius: 100px;
            font-size: 1.15rem;
            font-weight: 800;
            font-family: 'Outfit', sans-serif;
            cursor: pointer;
            box-shadow: 0 8px 25px rgba(37, 211, 102, 0.4);
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .whatsapp-btn:active {
            transform: scale(0.96);
        }

        .booking-footer {
            margin-top: 30px;
            text-align: center;
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.9rem;
            padding: 0 20px;
        }
    `;
    container.appendChild(style);
  }
}
