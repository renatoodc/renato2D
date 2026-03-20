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
    const gameScene = this.scene.get('GameScene');

    // Dialogue System DOM
    const uiLayer = document.getElementById('ui-layer');
    if (uiLayer) {
      // Create interaction hint
      const hint = document.createElement('div');
      hint.className = 'interaction-hint';
      uiLayer.appendChild(hint);

      // Create dialogue box
      const dialogueBox = document.createElement('div');
      dialogueBox.className = 'dialogue-box';
      dialogueBox.innerHTML = `
        <div class="dialogue-speaker" id="dialogue-speaker"></div>
        <div class="dialogue-text" id="dialogue-text"></div>
        <button class="dialogue-button" id="dialogue-close">Got it</button>
      `;
      uiLayer.appendChild(dialogueBox);

      // Interaction event mapping
      gameScene.events.on('showDialogue', (data: {speaker: string, text: string}) => {
        const speaker = document.getElementById('dialogue-speaker');
        const textArea = document.getElementById('dialogue-text');
        
        if (speaker && textArea) {
          speaker.innerText = data.speaker;
          textArea.innerText = data.text;
          dialogueBox.classList.add('visible');
        }
      });

      const closeBtn = document.getElementById('dialogue-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          dialogueBox.classList.remove('visible');
          gameScene.events.emit('dialogueClosed');
        });
      }
    }

    // Virtual DPad/Joystick for Touch devices
    if (this.sys.game.device.input.touch) {
      this.createVirtualJoystick(gameScene);
      this.createActionButton(gameScene);

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

  private createVirtualJoystick(gameScene: Phaser.Scene) {
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
      this.updateJoystick(pointer, margin, height - margin, gameScene);
    });

    interactiveZone.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.pointerDown) {
        this.updateJoystick(pointer, margin, height - margin, gameScene);
      }
    });

    interactiveZone.on('pointerup', () => {
      this.pointerDown = false;
      this.dpadCircle.setPosition(margin, height - margin);
      gameScene.events.emit('joystickMove', { x: 0, y: 0 });
    });
    
    interactiveZone.on('pointerout', () => {
      if(this.pointerDown) {
        this.pointerDown = false;
        this.dpadCircle.setPosition(margin, height - margin);
        gameScene.events.emit('joystickMove', { x: 0, y: 0 });
      }
    });
  }

  private updateJoystick(pointer: Phaser.Input.Pointer, baseX: number, baseY: number, gameScene: Phaser.Scene) {
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
    
    gameScene.events.emit('joystickMove', { x: vx, y: vy });
  }

  private createActionButton(gameScene: Phaser.Scene) {
    const { width, height } = this.cameras.main;
    const margin = 100;

    this.actionBtn = this.add.circle(width - margin, height - margin, 40, 0xff5a5f, 0.8)
      .setScrollFactor(0).setInteractive();
    
    this.actionText = this.add.text(width - margin, height - margin, 'A', { font: '24px Inter', color: '#ffffff' })
      .setOrigin(0.5).setScrollFactor(0);

    const btn = this.actionBtn;

    btn.on('pointerdown', () => {
      btn.setAlpha(0.5);
      gameScene.events.emit('actionButtonDown');
    });

    btn.on('pointerup', () => {
      btn.setAlpha(0.8);
    });
  }
}
