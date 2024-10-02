import Phaser from 'phaser';

class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UIScene' });
  }

  create() {
    // Crear elementos de la interfaz de usuario
    this.add.text(10, 10, 'Puntos: 0', { fontSize: '32px', fill: '#fff' });
  }
}

export default UIScene;