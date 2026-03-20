import Phaser from 'phaser';

export interface DialogueData {
  speaker: string;
  text: string;
}

export default class Interactable extends Phaser.Physics.Arcade.Sprite {
  public dialogueData: DialogueData;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, dialogueData: DialogueData) {
    super(scene, x, y, texture);

    this.dialogueData = dialogueData;

    scene.add.existing(this);
    scene.physics.add.existing(this, true); // Static body
  }
}
