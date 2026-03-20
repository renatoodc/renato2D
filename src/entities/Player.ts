import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  private baseSpeed: number = 200;
  private baseScale: number = 1.5;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Calculate base scale to standardize character height
    // We aim for a consistent visual height in the game
    const targetHeight = 2.5 * 48; // Standardized height based on original 1.5 scale of a 48px sprite
    this.baseScale = targetHeight / this.height;
    
    // Fine-tune adjustment for female character if it still feels off
    if (texture === 'female') {
      this.baseScale *= 0.85; // Reducing female scale by 15% as she is reported as larger
    }

    this.setScale(this.baseScale);

    // Setup Physics Body
    this.setCollideWorldBounds(true);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(24, 24);
    body.setOffset(4, 24); // Feet collision for top-down
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
