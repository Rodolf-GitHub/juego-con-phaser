import Phaser from 'phaser';
import { obtenerRecursos, actualizarRecursosUI } from './Resources';

const TAMANO_ESTANDAR = 48; // Tamaño reducido en píxeles

export class Defense extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);
    this.scene = scene;
    this.tipo = 'torre';
    this.nombre = 'Torre de defensa';
    this.nivel = 1;
    this.vidaMaxima = 100;
    this.vidaActual = 100;
    this.danoAtaque = 10;
   
        // ... código existente ...
        this.rangoAtaque = 300; // Rango de ataque en píxeles
        this.velocidadAtaque = 1000; // Milisegundos entre cada ataque
        this.ultimoAtaque = 0; // Tiempo del último ataque
        this.proyectiles = []; // Array para almacenar los proyectiles activos
      

    // Crear sprite para la torre
    this.sprite = this.scene.add.image(0, 0, 'torre');
    this.sprite.setDisplaySize(TAMANO_ESTANDAR, TAMANO_ESTANDAR);
    this.add(this.sprite);

    // Agregar el nombre y nivel encima de la defensa
    this.textoNombre = this.scene.add.text(0, -TAMANO_ESTANDAR / 2 - 15, `${this.nombre} - Nivel ${this.nivel}`, {
      fontSize: '12px',
      fill: '#ffffff'
    }).setOrigin(0.5);
    this.add(this.textoNombre);

    // Crear barra de vida
    this.barraVida = this.scene.add.graphics();
    this.actualizarBarraVida();
    this.add(this.barraVida);

    // Hacer la defensa interactiva
    this.sprite.setInteractive();
    this.sprite.on('pointerdown', this.mostrarInformacion, this);

    this.scene.add.existing(this);
  }

  actualizarBarraVida() {
    this.barraVida.clear();
    this.barraVida.fillStyle(0xff0000);
    this.barraVida.fillRect(-TAMANO_ESTANDAR / 2, TAMANO_ESTANDAR / 2 + 4, TAMANO_ESTANDAR, 4);
    this.barraVida.fillStyle(0x00ff00);
    this.barraVida.fillRect(-TAMANO_ESTANDAR / 2, TAMANO_ESTANDAR / 2 + 4, TAMANO_ESTANDAR * (this.vidaActual / this.vidaMaxima), 4);
  }

  mostrarInformacion() {
    let mensaje = `${this.nombre} - Nivel ${this.nivel}\n\nVida: ${this.vidaActual}/${this.vidaMaxima}\nDaño de ataque: ${this.danoAtaque}\n\nCosto para subir de nivel:\nOro: ${this.nivel * 50}\nPiedra: ${this.nivel * 30}`;

    if (this.mensajeContainer) {
      this.mensajeContainer.destroy();
    }

    this.mensajeContainer = this.scene.add.container(this.x, this.y);

    const fondo = this.scene.add.rectangle(0, 0, 180, 160, 0x000000, 0.8).setOrigin(0.5);
    const textoMensaje = this.scene.add.text(0, -50, mensaje, {
      fontSize: '12px',
      fill: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);

    const botonSubir = this.scene.add.text(0, 60, 'Subir Nivel', {
      fontSize: '14px',
      fill: '#ffffff',
      backgroundColor: '#4a4a4a',
      padding: { x: 8, y: 4 }
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
    const recursosActuales = obtenerRecursos(this.scene.recursos);
    const costoOro = this.nivel * 50;
    const costoPiedra = this.nivel * 30;

    if (recursosActuales.oro >= costoOro && recursosActuales.piedra >= costoPiedra) {
      recursosActuales.oro -= costoOro;
      recursosActuales.piedra -= costoPiedra;
      
      this.nivel++;
      this.vidaMaxima += 20;
      this.vidaActual = this.vidaMaxima;
      this.danoAtaque += 5;
      
      this.textoNombre.setText(`${this.nombre} - Nivel ${this.nivel}`);
      this.actualizarBarraVida();
      
      actualizarRecursosUI(this.scene.recursos, recursosActuales);
      this.mostrarInformacion();
    } else {
      console.log('No hay suficientes recursos para subir de nivel la defensa');
      // Aquí podrías mostrar un mensaje de error en la interfaz
    }
  }

  recibirDano(cantidad) {
    this.vidaActual -= cantidad;
    if (this.vidaActual <= 0) {
      this.vidaActual = 0;
      this.destruir();
    }
    this.actualizarBarraVida();
  }

  destruir() {
    if (this.scene && this.scene.defensas) {
      const index = this.scene.defensas.indexOf(this);
      if (index > -1) {
        this.scene.defensas.splice(index, 1);
      }
    }
    this.destroy();
  }

  atacar(tiempo, enemigos) {
    if (tiempo - this.ultimoAtaque < this.velocidadAtaque) return;

    const enemigosCercanos = enemigos.filter(enemigo => 
      Phaser.Math.Distance.Between(this.x, this.y, enemigo.x, enemigo.y) <= this.rangoAtaque
    );

    if (enemigosCercanos.length > 0) {
      const objetivo = enemigosCercanos[0];
      this.dispararProyectil(objetivo);
      this.ultimoAtaque = tiempo;
    }
  }

  dispararProyectil(objetivo) {
    const angulo = Phaser.Math.Angle.Between(this.x, this.y, objetivo.x, objetivo.y);
    const velocidad = 300;
    const proyectil = this.scene.add.text(this.x, this.y, '🔥', { fontSize: '18px' });
    proyectil.setOrigin(0.5);
    proyectil.rotation = angulo;

    this.proyectiles.push(proyectil);

    this.scene.tweens.add({
      targets: proyectil,
      x: objetivo.x,
      y: objetivo.y,
      duration: Phaser.Math.Distance.Between(this.x, this.y, objetivo.x, objetivo.y) / velocidad * 1000,
      onComplete: () => {
        if (Phaser.Math.Distance.Between(proyectil.x, proyectil.y, objetivo.x, objetivo.y) < 30) {
          objetivo.recibirDano(this.danoAtaque);
        }
        proyectil.destroy();
        this.proyectiles = this.proyectiles.filter(p => p !== proyectil);
      }
    });
  }

  actualizarProyectiles() {
    for (const proyectil of this.proyectiles) {
      if (!proyectil.active) {
        this.proyectiles = this.proyectiles.filter(p => p !== proyectil);
      }
    }
  }
}
