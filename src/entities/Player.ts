import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  private baseSpeed: number = 200;
  public baseScale: number = 1.5;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Calculate base scale to standardize character height
    // We aim for a consistent visual height in the game
    // 🕵️ UI Expert: 85% Increase in character size for ultra-massive mobile presence
    const targetHeight = 3.5 * 48;
    this.baseScale = (targetHeight / this.height) * 1.85;
    
    // Fine-tune adjustment for female character
    if (texture === 'female') {
      this.baseScale *= 0.85; 
    }

    this.setScale(this.baseScale);

    // Setup Physics Body
    this.setCollideWorldBounds(true);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(24, 24);
    body.setOffset(4, 24); // Feet collision for top-down
  }

  freeze(zoom: boolean = false) {
    this.setVelocity(0, 0);
    if (this.anims.isPlaying) this.stop();
    this.setFrame(0);
    this.setScale(zoom ? this.baseScale * 2.0 : this.baseScale);
    if (zoom) this.setDepth(100001); // Bring to front over UI if needed, or just below UI
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys, virtualJoystick?: { x: number, y: number }) {
    if (!this.body) return;

    this.setVelocity(0);

    let speedX = 0;
    let speedY = 0;

    // Keyboard Input
    if (cursors.left.isDown) speedX = -this.baseSpeed;
    else if (cursors.right.isDown) speedX = this.baseSpeed;

    if (cursors.up.isDown) speedY = -this.baseSpeed;
    else if (cursors.down.isDown) speedY = this.baseSpeed;

    // Virtual Joystick Input (Overrides Keyboard if active)
    if (virtualJoystick && (virtualJoystick.x !== 0 || virtualJoystick.y !== 0)) {
      speedX = virtualJoystick.x * this.baseSpeed;
      speedY = virtualJoystick.y * this.baseSpeed;
    }

    // Normalize diagonal movement
    if (speedX !== 0 && speedY !== 0) {
      const length = Math.sqrt(speedX * speedX + speedY * speedY);
      speedX = (speedX / length) * this.baseSpeed;
      speedY = (speedY / length) * this.baseSpeed;
    }

    this.setVelocity(speedX, speedY);
    
    // 🕵️ UI Expert: Nuclear Clamp for Mobile Stability (Absolute right limit 4080, left 0)
    if (this.x > 4080) this.x = 4080;
    if (this.x < 0) this.x = 0;
    if (this.y < 0) this.y = 0;
    if (this.y > 12490) this.y = 12490;

    if (speedX !== 0 || speedY !== 0) {
      const animKey = this.texture.key + '_walk';
      if (this.scene.anims.exists(animKey)) {
        this.play(animKey, true);
        if (speedX < 0) this.setFlipX(true);
        else if (speedX > 0) this.setFlipX(false);
      } else {
        // Fallback procedural scale
        const time = this.scene.time.now;
        this.setScale(this.baseScale + Math.sin(time / 50) * 0.05, this.baseScale + Math.cos(time / 50) * 0.05);
      }
    } else {
      const animKey = this.texture.key + '_walk';
      if (this.scene.anims.exists(animKey)) {
        this.stop();
        this.setFrame(0);
      }
      this.setScale(this.baseScale);
    }
  }
}
