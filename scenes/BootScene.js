import Phaser from 'phaser';

class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // No es necesario cargar nada para un emoji
  }

  create() {
    // Mostrar un emoji en el centro de la pantalla
    this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, '🎮', {
      font: '64px Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Iniciar la siguiente escena después de un breve retraso
    this.time.delayedCall(2000, () => {
      this.scene.start('MainMenuScene');
    });
  }
}

export default BootScene;