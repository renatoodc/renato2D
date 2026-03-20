import Phaser from 'phaser';
import Interactable from '../entities/Interactable';
import Player from '../entities/Player';

export default class GameScene extends Phaser.Scene {
  private player!: Player;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private interactables!: Phaser.Physics.Arcade.StaticGroup;
  
  private virtualJoystick = { x: 0, y: 0 };
  private actionPressed = false;
  private activeInteractable: Interactable | null = null;
  private isDialogueOpen = false;

  constructor() {
    super('GameScene');
  }

  create() {
    const _width = this.sys.game.config.width as number;
    const _height = this.sys.game.config.height as number; 
    const worldW = 2048;
    const worldH = 2048;
    
    // Add background sand extending down to where the sea starts (at 75%)
    this.add.tileSprite(0, 0, worldW, worldH * 0.75, 'sand').setOrigin(0);

    // Calçadão shrinking to 10% height to avoid stretching.
    // It sits exactly 8% above the 75% sea mark (starting at 57%, ending at 67%).
    const calcadaoHeight = worldH * 0.10;     // 10% tall
    const calcadaoY = worldH * 0.57;          // Starts at 57%, ends at 67%
    
    // Get original image dimensions to scale it properly without vertical tiling
    const sourceImage = this.textures.get('calcadao').getSourceImage();
    const imageHeight = sourceImage && (sourceImage as HTMLImageElement).height > 0 ? (sourceImage as HTMLImageElement).height : 256;
    
    // Tile horizontally across world
    const boardwalk = this.add.tileSprite(0, calcadaoY, worldW, imageHeight, 'calcadao').setOrigin(0);
    boardwalk.scaleY = calcadaoHeight / imageHeight;
    boardwalk.setFlipY(true);
    
    
    // Smooth crossfade blending the sand OVER the top edge of the calçadão
    const blendTop = this.add.graphics();
    blendTop.fillGradientStyle(0xeecf8b, 0xeecf8b, 0xeecf8b, 0xeecf8b, 1, 1, 0, 0); // Solid sand fading down to transparent
    blendTop.fillRect(0, calcadaoY, worldW, 30);

    // Smooth crossfade blending the sand OVER the bottom edge of the calçadão
    const blendBottom = this.add.graphics();
    blendBottom.fillGradientStyle(0xeecf8b, 0xeecf8b, 0xeecf8b, 0xeecf8b, 0, 0, 1, 1); // Transparent fading down to solid sand
    blendBottom.fillRect(0, calcadaoY + calcadaoHeight - 30, worldW, 30);

    // Smooth crossfade blending the sand into the sea at 75%
    const shoreGradient = this.add.graphics();
    shoreGradient.fillGradientStyle(0xeecf8b, 0xeecf8b, 0xeecf8b, 0xeecf8b, 1, 1, 0, 0); // Fades wet sand to transparent sea
    shoreGradient.fillRect(0, worldH * 0.75, worldW, 60);

    // Create an HTML div for the repeating GIF sea at the bottom 25% of the map
    const waterDiv = document.createElement('div');
    waterDiv.style.width = `${worldW}px`;
    waterDiv.style.height = `${worldH * 0.25}px`;
    waterDiv.style.backgroundImage = 'url("/assets/mar.gif")';
    waterDiv.style.backgroundRepeat = 'repeat';
    waterDiv.style.backgroundSize = 'auto';
    waterDiv.style.zIndex = '-1'; 
    
    // Place it forming the bottom 25% of the map (origin is center, so 87.5% marks the center of the bottom 25%)
    this.add.dom(worldW / 2, worldH * 0.875, waterDiv);

    // Set world bounds
    this.physics.world.setBounds(0, 0, worldW, worldH);

    // Get selected character
    const charType = this.registry.get('selectedCharacter') || 'male';

    // Player starts safely in the middle of the boardwalk
    this.player = new Player(this, worldW / 2, worldH * 0.55, charType);

    // Interactable Objects
    this.interactables = this.physics.add.staticGroup();
    
    const routerParams = { speaker: 'House Rules', text: 'No smoking, no parties. Quiet hours from 10 PM to 8 AM.' };
    const wifiParams = { speaker: 'Wi-Fi Network', text: 'Network: Guest_5G\nPassword: property_guest_2024' };
    const fixParams = { speaker: 'Maintenance', text: 'If the AC breaks, check the breaker box in the kitchen. Send us a message on the platform if it does not turn back on.' };

    this.interactables.add(new Interactable(this, 150, 150, 'interactable', routerParams));
    this.interactables.add(new Interactable(this, 300, 450, 'interactable', wifiParams));
    this.interactables.add(new Interactable(this, 500, 200, 'interactable', fixParams));

    // Collisions
    this.physics.add.collider(this.player, this.interactables);
    
    // Interaction Zone Mapping
    this.physics.add.overlap(this.player, this.interactables, (p, interactable: any) => {
      this.activeInteractable = interactable as Interactable;
    });

    // Camera
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setBounds(0, 0, worldW, worldH);

    // Input
    this.cursors = this.input.keyboard!.createCursorKeys();
    const spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
    spaceKey.on('down', this.handleInteract.bind(this));

    // Listen to UIScene Joystick and UI interactions
    this.events.on('joystickMove', (data: {x: number, y: number}) => {
      this.virtualJoystick = data;
    });

    this.events.on('actionButtonDown', () => {
      this.handleInteract();
    });

    this.events.on('dialogueClosed', () => {
      this.isDialogueOpen = false;
    });
  }

  update() {
    // Reset active interactable every frame, let overlap set it
    this.activeInteractable = null;

    if (!this.isDialogueOpen) {
      this.player.update(this.cursors, this.virtualJoystick);
    } else {
      this.player.setVelocity(0, 0);
      this.player.setScale(1); // Stop movement logic
    }

    // Toggle interact hint
    const hintUi = document.querySelector('.interaction-hint');
    if (hintUi) {
      if (this.activeInteractable && !this.isDialogueOpen) {
        hintUi.classList.add('visible');
        hintUi.innerHTML = 'Press Space or Tap UI to Interact';
        // Need to position it via screen coords... simplified for now.
        hintUi.setAttribute('style', `left: 50%; top: 85%;`);
      } else {
        hintUi.classList.remove('visible');
      }
    }
  }

  private handleInteract() {
    if (this.isDialogueOpen) return; // Wait for UI to close it

    if (this.activeInteractable) {
      this.isDialogueOpen = true;
      // Tell UI Scene to show dialog
      this.events.emit('showDialogue', this.activeInteractable.dialogueData);
    }
  }
}
