import Phaser from 'phaser';
import Recursos, { actualizarRecursosUI, obtenerRecursos } from './Resources';

const TAMANO_ESTANDAR = 45; // Tamaño estándar en píxeles
const TIEMPO_MEJORA = 5000; // 5 segundos para la mejora
const REGENERACION_HP = 0.1; // Índice de regeneración de HP por segundo

export class Structure extends Phaser.GameObjects.Container {
  constructor(scene, x, y, imagen, nombre, produccion) {
    super(scene, x, y);
    this.scene = scene;
    this.imagen = imagen;
    this.nombre = nombre;
    this.sprite = this.scene.add.image(0, 0, imagen);
    this.sprite.setDisplaySize(TAMANO_ESTANDAR, TAMANO_ESTANDAR);
    this.add(this.sprite);
    this.produccionBase = produccion;
    this.produccion = nombre === 'muralla' ? {} : { ...produccion };
    this.nivel = 1;
    this.costoSubida = this.calcularCostoSubida();
    this.vidaMaxima = 100; // Vida inicial
    this.vidaActual = this.vidaMaxima;
    this.enMejora = false;
    this.regeneracionHP = REGENERACION_HP;

    // Hacer la estructura interactiva
    this.sprite.setInteractive();
    this.sprite.on('pointerdown', this.mostrarProduccion, this);

    // Agregar barra de vida fuera del modal
    this.barraVidaFondo = this.scene.add.rectangle(0, TAMANO_ESTANDAR / 2 + 5, TAMANO_ESTANDAR, 5, 0x555555).setOrigin(0.5);
    this.barraVida = this.scene.add.rectangle(0, TAMANO_ESTANDAR / 2 + 5, TAMANO_ESTANDAR, 5, 0x00ff00).setOrigin(0.5);
    this.add(this.barraVidaFondo);
    this.add(this.barraVida);
    this.actualizarBarraVida();

    // Crear el emoji de martillo (oculto inicialmente)
    this.emojiMartillo = this.scene.add.text(0, -TAMANO_ESTANDAR / 2 - 10, '🔨', { fontSize: '24px' }).setOrigin(0.5);
    this.emojiMartillo.setVisible(false);
    this.add(this.emojiMartillo);

    this.scene.add.existing(this);

    // Iniciar la regeneración de HP
    this.scene.time.addEvent({
      delay: 1000, // Cada segundo
      callback: this.regenerarHP,
      callbackScope: this,
      loop: true
    });
  }

  obtenerProduccion() {
    return this.produccion;
  }

  calcularCostoSubida() {
    if (this.nombre === 'ayuntamiento') {
      const costos = {};
      for (const recurso in this.produccionBase) {
        costos[recurso] = Math.floor(this.produccionBase[recurso] * (0.9 + this.nivel / 10) * (10 + 0.2 * this.nivel));
      }
      return costos;
    } else if (this.nombre === 'muralla') {
      return { piedra: Math.floor(10 * (0.9 + this.nivel / 10) * (10 + 0.2 * this.nivel)) };
    } else {
      return { madera: Math.floor(10 * (0.9 + this.nivel / 10) * (10 + 0.2 * this.nivel)) };
    }
  }

  mostrarProduccion() {
    let mensaje = `${this.nombre} - Nv ${this.nivel}\n`;
    mensaje += `Vida: ${this.vidaActual.toFixed(1)}/${this.vidaMaxima}\n\n`;
    if (this.nombre !== 'muralla') {
      mensaje += `Produce:\n`;
      for (const [recurso, cantidad] of Object.entries(this.produccion)) {
        mensaje += `${recurso}: ${cantidad}/s\n`;
      }
    }
    mensaje += `\nMejorar:\n`;
    for (const [recurso, cantidad] of Object.entries(this.costoSubida)) {
      mensaje += `${recurso}: ${cantidad}\n`;
    }

    if (this.mensajeContainer) {
      this.mensajeContainer.destroy();
    }

    this.mensajeContainer = this.scene.add.container(this.x, this.y);

    const fondo = this.scene.add.rectangle(0, 0, 200, 200, 0x000000, 0.8).setOrigin(0.5);
    const textoMensaje = this.scene.add.text(0, -70, mensaje, {
      fontSize: '14px',
      fill: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);

    const botonSubir = this.scene.add.text(0, 70, 'Mejorar', {
      fontSize: '16px',
      fill: '#ffffff',
      backgroundColor: '#4a4a4a',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setInteractive();

    botonSubir.on('pointerdown', () => {
      this.subirNivel();
    });

    this.mensajeContainer.add([fondo, textoMensaje, botonSubir]);

    // Ocultar el mensaje después de 5 segundos
    this.scene.time.delayedCall(5000, () => {
      if (this.mensajeContainer) {
        this.mensajeContainer.destroy();
      }
    });
  }

  subirNivel() {
    if (this.enMejora) {
      return; // No permitir subir de nivel si ya está en mejora
    }

    const recursosActuales = obtenerRecursos(this.scene.recursos);
    let puedeSubir = true;

    for (const [recurso, costo] of Object.entries(this.costoSubida)) {
      if (recursosActuales[recurso] < costo) {
        puedeSubir = false;
        break;
      }
    }
    
    if (puedeSubir) {
      for (const [recurso, costo] of Object.entries(this.costoSubida)) {
        recursosActuales[recurso] -= costo;
      }
      
      // Iniciar el proceso de mejora
      this.enMejora = true;
      this.emojiMartillo.setVisible(true);
      
      // Actualizar recursos en la UI
      actualizarRecursosUI(this.scene.recursos, recursosActuales);
      
      // Programar la finalización de la mejora
      this.scene.time.delayedCall(TIEMPO_MEJORA, () => {
        this.finalizarMejora();
      });
    } else {
      if (this.mensajeError) {
        this.mensajeError.destroy();
      }
      this.mensajeError = this.scene.add.text(this.x, this.y - TAMANO_ESTANDAR / 2 - 40, `Recursos insuficientes`, {
        fontSize: '14px',
        fill: '#ff0000',
        backgroundColor: '#000000',
        padding: { x: 5, y: 5 }
      }).setOrigin(0.5).setDepth(1);

      this.scene.time.delayedCall(2000, () => {
        if (this.mensajeError) {
          this.mensajeError.destroy();
        }
      });
    }
  }

  finalizarMejora() {
    this.nivel++;
    
    if (this.nombre === 'muralla') {
      // Mejorar todas las murallas
      this.scene.estructuras.forEach(estructura => {
        if (estructura.nombre === 'muralla') {
          estructura.nivel = this.nivel;
          estructura.vidaMaxima += 20;
          estructura.vidaActual = estructura.vidaMaxima;
          estructura.costoSubida = estructura.calcularCostoSubida();
          estructura.actualizarBarraVida();
        }
      });
    } else {
      // Actualizar producción para estructuras que no son murallas
      for (const recurso in this.produccion) {
        this.produccion[recurso] = Math.floor(this.produccionBase[recurso] * Math.pow(1.2, this.nivel - 1));
      }
    }
    
    // Actualizar vida máxima y actual
    this.vidaMaxima += 20;
    this.vidaActual = this.vidaMaxima;
    
    // Actualizar costo de subida
    this.costoSubida = this.calcularCostoSubida();
    
    // Actualizar la barra de vida
    this.actualizarBarraVida();
    
    // Ocultar el emoji de martillo
    this.emojiMartillo.setVisible(false);
    
    // Finalizar el estado de mejora
    this.enMejora = false;
    
    // Actualizar el mensaje de producción
    this.mostrarProduccion();
  }

  recibirDano(cantidad) {
    this.vidaActual -= cantidad;
    if (this.vidaActual <= 0) {
      this.vidaActual = 0;
      this.destruir();
    }
    this.actualizarBarraVida();
  }

  actualizarBarraVida() {
    const porcentajeVida = this.vidaActual / this.vidaMaxima;
    this.barraVida.setScale(porcentajeVida, 1);
  }

  destruir() {
    if (this.scene && this.scene.estructuras) {
      const index = this.scene.estructuras.indexOf(this);
      if (index > -1) {
        this.scene.estructuras.splice(index, 1);
      }
    } else {
      console.warn('No se puede acceder a la escena o a las estructuras al destruir.');
    }

    // Asegúrate de que todos los elementos de la estructura se destruyan correctamente
    this.removeAll(true);
    this.destroy(true);
  }

  regenerarHP() {
    if (this.vidaActual < this.vidaMaxima) {
      this.vidaActual = Math.min(this.vidaActual + this.regeneracionHP, this.vidaMaxima);
      this.actualizarBarraVida();
    }
  }
}
