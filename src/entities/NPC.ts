import Phaser from 'phaser';

export default class NPC extends Phaser.Physics.Arcade.Sprite {
  private baseSpeed: number = 80; // Slower than player
  private baseScale: number = 1.5;
  private moveTimer: Phaser.Time.TimerEvent;
  private currentDir: { x: number, y: number } = { x: 0, y: 0 };
  public charType: string;
  public isDead: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    this.charType = texture;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Standardize height just like the Player
    let targetHeight = 3.5 * 48; 
    
    // Gordo override - the entire image serves as one static sprite, and it's physically huge
    if (this.charType === 'gordo') {
      targetHeight = 4.2 * 48; // A bit taller than the player
    }
    
    this.baseScale = targetHeight / this.height;
    
    if (texture === 'female') {
      this.baseScale *= 0.85; 
    }

    this.setScale(this.baseScale);

    // Setup Physics Body
    this.setCollideWorldBounds(true);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(24, 24);
    body.setOffset(4, 24);

    // Random movement AI ticking every 2 seconds
    this.moveTimer = scene.time.addEvent({
      delay: 2000,
      callback: this.chooseDirection,
      callbackScope: this,
      loop: true
    });
    this.chooseDirection(); 
  }

  private chooseDirection() {
    if (this.isDead) return;
    
    // 30% chance to sit still
    if (Math.random() < 0.3) {
      this.currentDir = { x: 0, y: 0 };
    } else {
      // Pick a random angle to walk towards
      const angle = Math.random() * Math.PI * 2;
      this.currentDir = { x: Math.cos(angle), y: Math.sin(angle) };
    }
  }

  update() {
    if (!this.body || this.isDead) return;

    this.setVelocity(this.currentDir.x * this.baseSpeed, this.currentDir.y * this.baseSpeed);

    // Handle animations
    const animKey = this.texture.key + '_walk';
    if (this.currentDir.x !== 0 || this.currentDir.y !== 0) {
      if (this.scene.anims.exists(animKey)) {
        this.play(animKey, true);
      }
      if (this.currentDir.x < 0) this.setFlipX(true);
      else if (this.currentDir.x > 0) this.setFlipX(false);
    } else {
      if (this.scene.anims.exists(animKey)) {
        this.stop();
        this.setFrame(0);
      }
    }
  }

  public die(impactVelocityX: number, impactVelocityY: number) {
    if (this.isDead) return;
    this.isDead = true;
    if (this.moveTimer) this.moveTimer.destroy();
    
    // Stop physics
    this.stop();
    this.setTint(0xff0000); // Blood / hit flash
    this.setAngle(90); // Knocked over
    
    // Ragdoll physics fling!
    this.setVelocity(impactVelocityX * 0.8, impactVelocityY * 0.8);
    
    // Friction to slow down the slide
    (this.body as Phaser.Physics.Arcade.Body).setDrag(900, 900);
    
    // Fade out and destroy after a few seconds
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 5000,
      ease: 'Linear',
      onComplete: () => {
        this.destroy();
      }
    });
  }

  destroy(fromScene?: boolean) {
    if (this.moveTimer) this.moveTimer.destroy();
    super.destroy(fromScene);
  }
}
