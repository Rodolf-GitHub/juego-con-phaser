import Phaser from 'phaser';
import { Structure } from './Structure';
import { actualizarRecursosUI, obtenerRecursos } from './Resources';

const TAMANO_ESTANDAR = 10; // Tamaño estándar en píxeles

export class Wall extends Structure {
  constructor(scene, x, y) {
    super(scene, x, y, 'muro', 'Muro', {});
    this.vidaMaxima = 200; // Vida inicial más alta para el muro
    this.vidaActual = this.vidaMaxima;
    this.nivel = 1;
    this.costoSubida = this.calcularCostoSubida();
    
    // Usar emoji en lugar de imagen
    this.emoji = scene.add.text(0, 0, '🧱', { fontSize: '32px' }).setOrigin(0.5);
    this.add(this.emoji);
    
    // Crear fondo para la barra de vida
    this.fondoBarraVida = scene.add.graphics();
    this.fondoBarraVida.fillStyle(0x000000, 0.5);
    this.fondoBarraVida.fillRect(-TAMANO_ESTANDAR / 2, TAMANO_ESTANDAR / 2 + 5, TAMANO_ESTANDAR, 8);
    this.add(this.fondoBarraVida);
    
    // Crear barra de vida
    this.barraVida = scene.add.graphics();
    this.actualizarBarraVida();
    this.add(this.barraVida);
  }

  calcularCostoSubida() {
    return {
      piedra: Math.floor(50 * (0.9 + this.nivel / 10) * (10 + 0.2 * this.nivel))
    };
  }

  actualizarBarraVida() {
    this.barraVida.clear();
    this.barraVida.fillStyle(0x00ff00);
    const anchoBarraVida = (this.vidaActual / this.vidaMaxima) * TAMANO_ESTANDAR;
    this.barraVida.fillRect(-TAMANO_ESTANDAR / 2, TAMANO_ESTANDAR / 2 + 5, anchoBarraVida, 8);
  }

  mostrarProduccion() {
    let mensaje = `Muro - Nivel ${this.nivel}\n\nVida: ${this.vidaActual}/${this.vidaMaxima}\n\n`;
    mensaje += `Costo para subir de nivel:\n`;
    for (const [recurso, cantidad] of Object.entries(this.costoSubida)) {
      mensaje += `${recurso}: ${cantidad}\n`;
    }

    if (this.mensajeContainer) {
      this.mensajeContainer.destroy();
    }

    this.mensajeContainer = this.scene.add.container(this.x, this.y);

    const fondo = this.scene.add.rectangle(0, 0, 220, 220, 0x000000, 0.8).setOrigin(0.5);
    const textoMensaje = this.scene.add.text(0, -80, mensaje, {
      fontSize: '16px',
      fill: '#ffffff',
      align: 'center',
      wordWrap: { width: 200 }
    }).setOrigin(0.5);

    const botonSubir = this.scene.add.text(0, 90, 'Subir Nivel', {
      fontSize: '18px',
      fill: '#ffffff',
      backgroundColor: '#4a4a4a',
      padding: { x: 12, y: 8 }
    }).setOrigin(0.5).setInteractive();

    botonSubir.on('pointerdown', () => {
      this.subirNivel();
    });

    this.mensajeContainer.add([fondo, textoMensaje, botonSubir]);

    this.scene.time.delayedCall(5000, () => {
      if (this.mensajeContainer) {
        this.mensajeContainer.destroy();
      }
    });
  }

  subirNivel() {
    const recursosActuales = obtenerRecursos(this.scene.recursos);
    if (recursosActuales.piedra >= this.costoSubida.piedra) {
      recursosActuales.piedra -= this.costoSubida.piedra;
      this.nivel++;
      this.textoNombre.setText(`Muro - Nivel ${this.nivel}`);
      
      this.vidaMaxima += 50;
      this.vidaActual = this.vidaMaxima;
      this.actualizarBarraVida();
      
      this.costoSubida = this.calcularCostoSubida();
      
      actualizarRecursosUI(this.scene.recursos, recursosActuales);
      
      this.mostrarProduccion();
    } else {
      if (this.mensajeError) {
        this.mensajeError.destroy();
      }
      this.mensajeError = this.scene.add.text(this.x, this.y - TAMANO_ESTANDAR / 2 - 40, `No hay suficiente piedra`, {
        fontSize: '16px',
        fill: '#ff0000',
        backgroundColor: '#000000',
        padding: { x: 8, y: 6 }
      }).setOrigin(0.5).setDepth(1);

      this.scene.time.delayedCall(2000, () => {
        if (this.mensajeError) {
          this.mensajeError.destroy();
        }
      });
    }
  }

  recibirDano(cantidad) {
    super.recibirDano(cantidad);
  }

  destruir() {
    super.destruir();
  }
}
