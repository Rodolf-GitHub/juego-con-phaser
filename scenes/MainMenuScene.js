import Phaser from 'phaser';

class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenuScene' });
  }

  create() {
    // Crear el menú principal
    this.add.text(100, 100, 'Main Menu', { fontSize: '32px', fill: '#fff' });

    // Iniciar la escena del juego al hacer clic
    this.input.on('pointerdown', () => {
      this.scene.start('GameScene');
    });
  }
}

export default MainMenuScene;