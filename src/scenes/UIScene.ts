import Phaser from 'phaser';

export default class UIScene extends Phaser.Scene {
  private dpadCircle!: Phaser.GameObjects.Graphics;
  private dpadBase!: Phaser.GameObjects.Arc;
  private dpadZone!: Phaser.GameObjects.Zone;
  private actionBtn!: Phaser.GameObjects.Arc;
  private actionText!: Phaser.GameObjects.Text;
  private pointerDown = false;

  constructor() {
    super({ key: 'UIScene', active: false });
  }

  create() {
    // We listen to GameScene events
    // Dialogue System DOM
    const uiLayer = document.getElementById('ui-layer');
    const hint = document.getElementById('interaction-hint');
    const dialogueBox = document.getElementById('dialogue-box-v2');
    
    if (uiLayer && hint && dialogueBox) {

      // Interaction event mapping
      this.game.events.on('showDialogue', (data: {speaker: string, text: string, large?: boolean}) => {
        const speaker = document.getElementById('dialogue-speaker');
        const textArea = document.getElementById('dialogue-text');
        const db = document.getElementById('dialogue-box-v2');
        
        if (data.speaker && textArea && speaker && db) {
          speaker.innerText = data.speaker;
          textArea.innerText = data.text;
          if (data.large) db.classList.add('large');
          else db.classList.remove('large');
          db.classList.add('visible');
          db.style.display = 'block';
        }
      });

      this.game.events.on('updateHint', (data: {visible: boolean, text?: string, x?: number, y?: number}) => {
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
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          const db = document.getElementById('dialogue-box-v2');
          if (db) {
            db.classList.remove('visible');
            db.style.display = 'none';
          }
          this.game.events.emit('dialogueClosed');
        });
      }
    }

    // Virtual DPad/Joystick for Touch devices
    if (this.sys.game.device.input.touch) {
      this.createVirtualJoystick();
      this.createActionButton();

      this.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
        this.cameras.main.width = gameSize.width;
        this.cameras.main.height = gameSize.height;
        
        const { width, height } = gameSize;
        const margin = 100;
        
        if (this.dpadBase) {
          this.dpadBase.setPosition(margin, height - margin);
          this.dpadZone.setPosition(margin, height - margin);
          if (!this.pointerDown) this.dpadCircle.setPosition(margin, height - margin);
        }
        
        if (this.actionBtn) {
          this.actionBtn.setPosition(width - margin, height - margin);
          this.actionText.setPosition(width - margin, height - margin);
        }
      });
    }
  }

  private createVirtualJoystick() {
    const margin = 100;
    const { height } = this.cameras.main;
    
    // Base circle
    this.dpadBase = this.add.circle(margin, height - margin, 50, 0xffffff, 0.2).setScrollFactor(0);
    // Thumb circle
    this.dpadCircle = this.add.graphics();
    this.dpadCircle.fillStyle(0xffffff, 0.5);
    this.dpadCircle.fillCircle(0, 0, 25);
    this.dpadCircle.setPosition(margin, height - margin);
    this.dpadCircle.setScrollFactor(0);

    const interactiveZone = this.add.zone(margin, height - margin, 150, 150)
      .setOrigin(0.5).setInteractive().setScrollFactor(0);
    this.dpadZone = interactiveZone;

    interactiveZone.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.pointerDown = true;
      this.updateJoystick(pointer, margin, height - margin);
    });

    interactiveZone.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.pointerDown) {
        this.updateJoystick(pointer, margin, height - margin);
      }
    });

    interactiveZone.on('pointerup', () => {
      this.pointerDown = false;
      this.dpadCircle.setPosition(margin, height - margin);
      this.game.events.emit('joystickMove', { x: 0, y: 0 });
    });
    
    interactiveZone.on('pointerout', () => {
      if(this.pointerDown) {
        this.pointerDown = false;
        this.dpadCircle.setPosition(margin, height - margin);
        this.game.events.emit('joystickMove', { x: 0, y: 0 });
      }
    });
  }

  private updateJoystick(pointer: Phaser.Input.Pointer, baseX: number, baseY: number) {
    const dx = pointer.x - baseX;
    const dy = pointer.y - baseY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxRadius = 50;
    
    let nx = dx;
    let ny = dy;

    if (distance > maxRadius) {
      nx = (dx / distance) * maxRadius;
      ny = (dy / distance) * maxRadius;
    }

    this.dpadCircle.setPosition(baseX + nx, baseY + ny);

    // Normalize -1 to 1
    const vx = nx / maxRadius;
    const vy = ny / maxRadius;
    
    this.game.events.emit('joystickMove', { x: vx, y: vy });
  }

  private createActionButton() {
    const { width, height } = this.cameras.main;
    const margin = 100;

    this.actionBtn = this.add.circle(width - margin, height - margin, 40, 0xff5a5f, 0.8)
      .setScrollFactor(0).setInteractive();
    
    this.actionText = this.add.text(width - margin, height - margin, 'A', { font: '24px Inter', color: '#ffffff' })
      .setOrigin(0.5).setScrollFactor(0);

    const btn = this.actionBtn;

    btn.on('pointerdown', () => {
      btn.setAlpha(0.5);
      this.game.events.emit('actionButtonDown');
    });

    btn.on('pointerup', () => {
      btn.setAlpha(0.8);
    });
  }
}
