import Phaser from 'phaser';

export default class UIScene extends Phaser.Scene {
  private joystickKnob!: Phaser.GameObjects.Graphics;
  private joystickZone!: Phaser.GameObjects.Zone;
  private actionButton!: Phaser.GameObjects.Container;
  private pointerDown = false;
  private margin = 80;

  constructor() {
    super({ key: 'UIScene', active: false });
  }

  create() {
    // 1. Dialogue System DOM Listeners
    this.setupDialogueListeners();

    // 2. Mobile Controls (Joystick & Action Button)
    const { width, height } = this.scale;
    
    // Adjust margin based on screen size (Safe Area)
    this.margin = Math.min(width, height) * 0.15;
    if (this.margin > 120) this.margin = 120;
    if (this.margin < 60) this.margin = 60;

    // Only create on touch devices or for debugging
    if (this.sys.game.device.input.touch || true) {
      this.createProfessionalJoystick();
      this.createProfessionalActionButton();

      this.createMenuButton();

      this.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
        this.cameras.main.width = gameSize.width;
        this.cameras.main.height = gameSize.height;
        this.repositionControls(gameSize.width, gameSize.height);
      });
    }
  }

  private setupDialogueListeners() {
    const uiLayer = document.getElementById('ui-layer');
    if (!uiLayer) return;

    this.game.events.on('showDialogue', (data: {speaker: string, text: string, large?: boolean}) => {
      const speaker = document.getElementById('dialogue-speaker');
      const textArea = document.getElementById('dialogue-text');
      const db = document.getElementById('dialogue-box-v2');
      
      if (textArea && speaker && db) {
        speaker.innerText = data.speaker;
        textArea.innerText = data.text;
        db.classList.toggle('large', !!data.large);
        db.classList.add('visible');
        db.style.display = 'block';
      }
    });

    this.game.events.on('updateHint', (data: {visible: boolean, text?: string, x?: number, y?: number}) => {
      const hint = document.getElementById('interaction-hint');
      if (!hint) return;
      if (data.visible) {
          hint.innerText = data.text || 'PRESSIONE PARA INSPECIONAR';
          hint.style.left = `${data.x}px`;
          hint.style.top = `${data.y}px`;
          hint.classList.add('visible');
      } else {
          hint.classList.remove('visible');
      }
    });

    const closeBtn = document.getElementById('dialogue-close');
    closeBtn?.addEventListener('click', () => {
      const db = document.getElementById('dialogue-box-v2');
      if (db) {
        db.classList.remove('visible');
        setTimeout(() => db.style.display = 'none', 300);
      }
      this.game.events.emit('dialogueClosed');
    });
  }

  private createProfessionalJoystick() {
    const { height } = this.cameras.main;
    const x = this.margin;
    const y = height - this.margin;

    // Base - Layered graphics for Glassmorphism look
    const base = this.add.graphics().setScrollFactor(0);
    // Shadow
    base.fillStyle(0x000000, 0.2).fillCircle(x + 2, y + 4, 60);
    // Outer Ring
    base.lineStyle(2, 0xffffff, 0.3).strokeCircle(x, y, 60);
    // Glass Core
    base.fillStyle(0xffffff, 0.1).fillCircle(x, y, 60);
    
    // Knob/Handle
    this.joystickKnob = this.add.graphics().setScrollFactor(0);
    this.drawKnob(x, y);

    // Interaction Zone
    this.joystickZone = this.add.zone(x, y, 160, 160).setOrigin(0.5).setInteractive().setScrollFactor(0);

    this.joystickZone.on('pointerdown', (p: Phaser.Input.Pointer) => {
      this.pointerDown = true;
      this.updateJoystick(p);
    });

    this.input.on('pointermove', (p: Phaser.Input.Pointer) => {
      if (this.pointerDown && this.input.activePointer.id === p.id) {
        this.updateJoystick(p);
      }
    });

    this.input.on('pointerup', () => {
      this.pointerDown = false;
      this.resetJoystick();
    });
  }

  private drawKnob(x: number, y: number, isPressed = false) {
    this.joystickKnob.clear();
    const alpha = isPressed ? 0.8 : 0.5;
    // Outer Glow/Border
    this.joystickKnob.lineStyle(3, 0xffffff, 0.4).strokeCircle(x, y, 32);
    // Main Body
    this.joystickKnob.fillStyle(0xffffff, alpha).fillCircle(x, y, 30);
    // Inner Highlight
    this.joystickKnob.fillStyle(0xffffff, 0.2).fillCircle(x - 6, y - 6, 12);
  }

  private updateJoystick(pointer: Phaser.Input.Pointer) {
    const x = this.joystickZone.x;
    const y = this.joystickZone.y;
    const dx = pointer.x - x;
    const dy = pointer.y - y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const max = 40;
    
    let nx = dx;
    let ny = dy;

    if (dist > max) {
      nx = (dx / dist) * max;
      ny = (dy / dist) * max;
    }

    this.drawKnob(x + nx, y + ny, true);
    this.game.events.emit('joystickMove', { x: nx / max, y: ny / max });
  }

  private resetJoystick() {
    this.drawKnob(this.joystickZone.x, this.joystickZone.y, false);
    this.game.events.emit('joystickMove', { x: 0, y: 0 });
  }

  private createProfessionalActionButton() {
    const { width, height } = this.cameras.main;
    const x = width - this.margin;
    const y = height - this.margin;

    this.actionButton = this.add.container(x, y);

    // Glass Background
    const bg = this.add.graphics();
    bg.fillStyle(0x000000, 0.2).fillCircle(2, 4, 45); // Shadow
    bg.lineStyle(2, 0xffffff, 0.3).strokeCircle(0, 0, 45); // Border
    bg.fillStyle(0xffffff, 0.15).fillCircle(0, 0, 45); // Core

    // Icon (Using Graphics to draw a professional 'Eye' or 'A')
    const icon = this.add.text(0, 0, '👁', { fontSize: '40px', color: '#ffffff' }).setOrigin(0.5);
    
    this.actionButton.add([bg, icon]);
    this.actionButton.setSize(90, 90).setInteractive({ cursor: 'pointer' });

    this.actionButton.on('pointerdown', () => {
      this.tweens.add({ targets: this.actionButton, scale: 0.9, duration: 100 });
      this.game.events.emit('actionButtonDown');
    });

    this.input.on('pointerup', () => {
      this.tweens.add({ targets: this.actionButton, scale: 1, duration: 100 });
    });
  }

  private createMenuButton() {
    const x = 20;
    const y = 20;

    const btn = this.add.container(x, y).setDepth(9999);
    
    // Glass Background
    const bg = this.add.graphics();
    bg.fillStyle(0x000000, 0.4).fillRoundedRect(0, 0, 100, 40, 12);
    bg.lineStyle(2, 0xffffff, 0.5).strokeRoundedRect(0, 0, 100, 40, 12);
    
    const txt = this.add.text(50, 20, '🔙 MENU', {
      fontFamily: 'Montserrat',
      fontSize: '14px',
      color: '#ffffff',
      fontStyle: '800'
    }).setOrigin(0.5);

    btn.add([bg, txt]);
    
    // Explicit hit area for total reliability
    btn.setInteractive(new Phaser.Geom.Rectangle(0, 0, 100, 40), Phaser.Geom.Rectangle.Contains);

    btn.on('pointerdown', () => {
      console.log('MENU BUTTON CLICKED');
      this.tweens.add({ targets: btn, scale: 0.92, duration: 80 });
      
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        // Stop both scenes to be clean
        this.registry.set('isReturningToMenu', true);
        this.scene.stop('UIScene');
        this.scene.stop('GameScene');
        this.scene.start('WelcomeScene');
      });
    });
  }

  private repositionControls(width: number, height: number) {
    this.margin = Math.min(width, height) * 0.15;
    if (this.margin > 120) this.margin = 120;
    
    // Repositioning graphics isn't trivial by just setting x/y because of custom drawing
    // We would ideally recreate or offset them
    this.scene.restart();
  }
}
