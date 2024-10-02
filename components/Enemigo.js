export class Enemigo extends Phaser.GameObjects.Container {
    constructor(scene, x, y, tipo, nivel, rangoAtaque, danoAtaque, velocidadAtaque, velocidadMovimiento, emoji, vidaMaxima) {
      super(scene, x, y);
      
      this.tipo = tipo;
      this.nombre = `Enemigo ${tipo}`;
      this.velocidad = velocidadMovimiento;
      this.rangoAtaque = rangoAtaque;
      this.objetivoActual = null;
      this.tiempoUltimoAtaque = 0;
      this.intervaloAtaque = 1000 / velocidadAtaque; // Convertir velocidad de ataque a intervalo en milisegundos
      this.tiempoUltimoMovimiento = 0;
      
      // Asegurarse de que el nivel sea un número entero
      console.log(nivel);
      this.nivel = Math.max(1, Math.floor(nivel || 1));
      
      // Configuración del daño y vida basados en el nivel
      const aumentoPorNivel = 1 + (this.nivel - 1) * 0.2; // 20% de aumento por nivel
      this.danoAtaque = Math.floor(danoAtaque * aumentoPorNivel);
      this.vidaMaxima = Math.floor(vidaMaxima * aumentoPorNivel);
      this.vidaActual = this.vidaMaxima;
      
      // Usar el emoji recibido como parámetro
      this.emoji = scene.add.text(0, 0, emoji, { fontSize: '32px' });
      this.emoji.setOrigin(0.5);
      this.add(this.emoji);
      
      // Ajustar el tamaño en función del nivel
      const escala = 1 + (this.nivel - 1) * 0.1; // Aumenta un 10% por cada nivel
      this.setScale(escala);
      
      // Añadir barra de vida
      this.barraVida = scene.add.graphics();
      this.actualizarBarraVida();
      this.add(this.barraVida);
      
      this.setVisible(true);
      this.setDepth(1);
      
      this.debugRect = scene.add.rectangle(0, 0, 32, 32, 0xff0000, 0.5);
      this.add(this.debugRect);
      
      // Hacer el enemigo interactivo
      this.setInteractive(new Phaser.Geom.Rectangle(-16, -16, 32, 32), Phaser.Geom.Rectangle.Contains);
      this.on('pointerdown', this.mostrarInfo, this);
      
      // Añadir el enemigo a la escena
      scene.add.existing(this);
    }
  
    moverYAtacar(tiempo, estructuras, defensas) {
      if (!this.scene || !this.scene.sys) {
        // El enemigo ha sido destruido, no hacer nada
        return;
      }
    
      if (!this.objetivoActual || !this.objetivoActual.active) {
        this.buscarObjetivo(estructuras, defensas);
      }
    
      if (this.objetivoActual) {
        const distancia = Phaser.Math.Distance.Between(
          this.x, this.y,
          this.objetivoActual.x, this.objetivoActual.y
        );
    
        if (distancia <= this.rangoAtaque) {
          if (tiempo - this.tiempoUltimoAtaque >= this.intervaloAtaque) {
            this.disparar(this.objetivoActual);
            this.tiempoUltimoAtaque = tiempo;
          }
        } else {
          const angulo = Phaser.Math.Angle.Between(this.x, this.y, this.objetivoActual.x, this.objetivoActual.y);
          
          const nuevaX = this.x + Math.cos(angulo) * this.velocidad;
          const nuevaY = this.y + Math.sin(angulo) * this.velocidad;
    
          this.x = Phaser.Math.Clamp(nuevaX, 0, this.scene.sys.game.config.width);
          this.y = Phaser.Math.Clamp(nuevaY, 0, this.scene.sys.game.config.height);
        }
      }
    }
  
    buscarObjetivo(estructuras, defensas) {
      const objetivos = [...estructuras, ...defensas].filter(obj => obj.active);
      let objetivoMasCercano = null;
      let distanciaMinima = Infinity;
  
      for (const objetivo of objetivos) {
        const distancia = Phaser.Math.Distance.Between(
          this.x, this.y,
          objetivo.x, objetivo.y
        );
        if (distancia < distanciaMinima) {
          distanciaMinima = distancia;
          objetivoMasCercano = objetivo;
        }
      }
  
      this.objetivoActual = objetivoMasCercano;
    }
  
    disparar(objetivo) {
      if (objetivo && objetivo.active && this.scene && this.scene.add) {
        const proyectilEmoji = '💥'; // Emoji para el proyectil
        const proyectil = this.scene.add.text(this.x, this.y, proyectilEmoji, { fontSize: '24px' });
        proyectil.setOrigin(0.5);
        
        const angulo = Phaser.Math.Angle.Between(this.x, this.y, objetivo.x, objetivo.y);
        const velocidad = 300;
        
        this.scene.tweens.add({
          targets: proyectil,
          x: objetivo.x,
          y: objetivo.y,
          duration: Phaser.Math.Distance.Between(this.x, this.y, objetivo.x, objetivo.y) / velocidad * 1000,
          onComplete: () => {
            if (Phaser.Math.Distance.Between(proyectil.x, proyectil.y, objetivo.x, objetivo.y) < 30) {
              objetivo.recibirDano(this.danoAtaque);
              console.log(`${this.nombre} disparó a ${objetivo.nombre} causando ${this.danoAtaque} de daño`);
            }
            proyectil.destroy();
          }
        });
      } else {
        this.objetivoActual = null;
        console.log(`${this.nombre} no pudo disparar porque el objetivo ya no existe o la escena no está disponible`);
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
    
    actualizarBarraVida() {
      this.barraVida.clear();
      const anchoBarra = 32;
      const altoBarra = 5;
      const porcentajeVida = this.vidaActual / this.vidaMaxima;
      
      // Fondo de la barra
      this.barraVida.fillStyle(0x000000);
      this.barraVida.fillRect(-anchoBarra / 2, -25, anchoBarra, altoBarra);
      
      // Barra de vida
      this.barraVida.fillStyle(0x00ff00);
      this.barraVida.fillRect(-anchoBarra / 2, -25, anchoBarra * porcentajeVida, altoBarra);
    }
    
    destruir() {
      // Lógica para destruir el enemigo
      this.destroy();
    }
    
    mostrarInfo() {
      const modalWidth = 200;
      const modalHeight = 100;
      const modalX = this.x - modalWidth / 2;
      const modalY = this.y - modalHeight - 50;
      
      const modal = this.scene.add.graphics();
      modal.fillStyle(0x000000, 0.8);
      modal.fillRect(modalX, modalY, modalWidth, modalHeight);
      
      const contenido = `
        Nombre: ${this.nombre}
        Vida: ${this.vidaActual}/${this.vidaMaxima}
        Daño: ${this.danoAtaque}
        Nivel: ${this.nivel}
      `;
      
      const texto = this.scene.add.text(modalX + 10, modalY + 10, contenido, { fontSize: '14px', fill: '#ffffff' });
      
      // Cerrar el modal después de 3 segundos
      this.scene.time.delayedCall(3000, () => {
        modal.destroy();
        texto.destroy();
      });
    }
  }