import Phaser from 'phaser';
import { Structure } from '../components/Structure';
import Recursos, { crearRecursos, actualizarRecursos, obtenerRecursos } from '../components/Resources';
import { Defense } from '../components/Defense';
import { Enemigo } from '../components/Enemigo';
import { WaveManager } from '../components/WaveManager';

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.estructuras = [];
    this.defensas = [];
    this.recursos = null;
    this.tiempoTranscurrido = 0;
    this.intervaloGeneracion = 5000; // 5 segundos
    this.enemigos = [];
    this.intervaloMovimientoEnemigo = 1000; // 1 segundo
    this.tiempoUltimoMovimientoEnemigo = 0;
    this.nivel = 1; // Comenzamos en el nivel 1
    this.tiempoUltimoEnemigoEliminado = 0;
    this.esperaNuevaOleada = 10000; // 10 segundos de espera después de eliminar al último enemigo
    this.oleadaGenerada = false; // Nueva variable para controlar si ya se generó la oleada del nivel actual
    this.tiempoRestanteOleada = 0; // Tiempo restante para la siguiente oleada
    this.tiposEnemigos = [
      { tipo: 'slime', emoji: '🟢', rangoAtaque: 10, danoAtaque: 5, velocidadAtaque: 1, velocidadMovimiento: 1, poder: 1, vidaMaxima: 100 },
      { tipo: 'zombie', emoji: '🧟', rangoAtaque: 10, danoAtaque: 10, velocidadAtaque: 0.5, velocidadMovimiento: 0.8, poder: 2, vidaMaxima: 130 },
      { tipo: 'fantasma', emoji: '👻', rangoAtaque: 80, danoAtaque: 3, velocidadAtaque: 2, velocidadMovimiento: 1.5, poder: 3, vidaMaxima: 150 },
      { tipo: 'dragón', emoji: '🐉', rangoAtaque: 100, danoAtaque: 30, velocidadAtaque: 0.2, velocidadMovimiento: 1.3, poder: 4, vidaMaxima: 300 }
    ];
    this.waveManager = null;
  }

  preload() {
    const assets = [
      { key: 'ayuntamiento', path: 'assets/images/structures/ayuntamiento.png' },
      { key: 'canteraPiedra', path: 'assets/images/structures/canteraPiedra.png' },
      { key: 'granja', path: 'assets/images/structures/granja.png' },
      { key: 'aserradero', path: 'assets/images/structures/aserradero.png' },
      { key: 'minaOro', path: 'assets/images/structures/minaOro.png' },
      { key: 'torre', path: 'assets/images/structures/torreArquero.jpg' },
      { key: 'muralla', path: 'assets/images/structures/muralla.jpg' }
    ];

    let loadedAssets = 0;

    assets.forEach(asset => {
      this.load.image(asset.key, asset.path);
    });

    this.load.on('filecomplete', (key) => {
      loadedAssets++;
      const progress = loadedAssets / assets.length;
      console.log(`Progreso de carga: ${progress * 100}%`);
      this.game.events.emit('progress', progress);
    });

    this.load.on('complete', () => {
      console.log('Carga completa');
      this.game.events.emit('ready');
    });
  }

  create() {
    this.ajustarTamano();
    
    const fondo = this.add.graphics();
    fondo.fillStyle(0x4CAF50, 1);
    fondo.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
    fondo.setDepth(-1);

    this.recursos = crearRecursos(this, this.cameras.main.width - this.escala(250), this.escala(60));
    
    const centroX = this.cameras.main.width / 2;
    const centroY = this.cameras.main.height / 2;
    
    // Crear el círculo de murallas (un poco más grande)
    const radioBase = this.escala(180);
    this.crearMurallasCirculares(centroX, centroY, radioBase);
    
    // Crear el ayuntamiento en el centro
    this.crearEstructura('ayuntamiento', centroX, centroY, { oro: 1, madera: 1, comida: 1, piedra: 1 });
    
    // Crear 4 torres de defensa dentro del círculo de murallas
    const numTorres = 4;
    const radioTorres = radioBase * 0.8;
    for (let i = 0; i < numTorres; i++) {
      const angulo = (i / numTorres) * Math.PI * 2;
      const x = centroX + Math.cos(angulo) * radioTorres;
      const y = centroY + Math.sin(angulo) * radioTorres;
      this.crearDefensa(x, y);
    }

    // Crear estructuras recolectoras entre las torres, pero más cerca del centro
    const estructurasProduccion = ['canteraPiedra', 'granja', 'aserradero', 'minaOro'];
    const producciones = [{ piedra: 9 }, { comida: 9 }, { madera: 9 }, { oro: 9 }];
    const radioEstructuras = radioBase * 0.5; // Reducido de 0.7 a 0.5 para acercarlas más al centro
    for (let i = 0; i < numTorres; i++) {
      const angulo = ((i + 0.5) / numTorres) * Math.PI * 2;
      const x = centroX + Math.cos(angulo) * radioEstructuras;
      const y = centroY + Math.sin(angulo) * radioEstructuras;
      this.crearEstructura(estructurasProduccion[i], x, y, producciones[i]);
    }
    
    this.waveManager = new WaveManager(this);
    this.waveManager.tiposEnemigos = this.tiposEnemigos;
    
    // Crear un cartel de nivel más grande, pegado arriba y semitransparente
    this.cartelNivel = this.add.text(this.escala(10), this.escala(10), '', {
      fontSize: this.escala(20) + 'px',
      fontStyle: 'bold',
      fill: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: this.escala(10), y: this.escala(5) },
      fixedWidth: this.escala(250)
    }).setAlpha(0.8);
    this.actualizarCartelNivel();

    this.scale.on('resize', this.ajustarTamano, this);
  }

  ajustarTamano() {
    const { width, height } = this.sys.game.canvas;
    this.cameras.main.setViewport(0, 0, width, height);
    this.escalaBase = Math.min(width / 800, height / 600);
  }

  escala(valor) {
    return valor * this.escalaBase;
  }

  crearMurallasCirculares(centroX, centroY, radio) {
    const numSegmentos = 32;
    const anguloIncremento = (Math.PI * 2) / numSegmentos;
    for (let i = 0; i < numSegmentos; i++) {
      const angulo = i * anguloIncremento;
      const x = centroX + Math.cos(angulo) * radio;
      const y = centroY + Math.sin(angulo) * radio;
      this.crearEstructura('muralla', x, y, { piedra: 1 });
    }
  }

  crearEstructura(tipo, x, y, produccion) {
    const estructura = new Structure(this, x, y, tipo, tipo, produccion);
    estructura.setScale(this.escalaBase);
    this.estructuras.push(estructura);
  }

  crearDefensa(x, y) {
    const defensa = new Defense(this, x, y);
    defensa.setScale(this.escalaBase);
    this.defensas.push(defensa);
  }

  actualizarRecursos() {
    for (const estructura of this.estructuras) {
      const produccion = estructura.obtenerProduccion();
      actualizarRecursos(this.recursos, produccion.oro || 0, produccion.piedra || 0, produccion.comida || 0, produccion.madera || 0);
    }
  }

  generarOleadaEnemigos() {
    if (this.oleadaGenerada) return; // Si ya se generó la oleada para este nivel, no hacer nada

    const enemigosGenerados = this.waveManager.generarOleada(this.nivel);
    
    for (const enemigo of enemigosGenerados) {
      if (enemigo) {
        const angulo = Math.random() * Math.PI * 2;
        const distancia = Math.max(this.cameras.main.width, this.cameras.main.height) / 2;
        const x = this.cameras.main.width / 2 + Math.cos(angulo) * distancia;
        const y = this.cameras.main.height / 2 + Math.sin(angulo) * distancia;
        
        enemigo.setPosition(x, y);
        enemigo.setScale(this.escalaBase);
        this.enemigos.push(enemigo);
      }
    }

    console.log(`Oleada generada: ${enemigosGenerados.filter(e => e !== null).length} enemigos de nivel ${this.nivel}`);
    this.oleadaGenerada = true; // Marcar que ya se generó la oleada para este nivel
    this.aumentarDificultad(); // Aumentar el nivel después de generar la oleada
  }

  aumentarDificultad() {
    this.nivel++;
    this.oleadaGenerada = false; // Resetear la variable para permitir una nueva oleada en el siguiente nivel
    this.tiempoRestanteOleada = this.esperaNuevaOleada;
    console.log(`Nivel aumentado a ${this.nivel}`);
    this.actualizarCartelNivel();
  }

  actualizarCartelNivel() {
    const segundosRestantes = Math.ceil(this.tiempoRestanteOleada / 1000);
    this.cartelNivel.setText(`Nivel: ${this.nivel-1}\nSiguiente: ${segundosRestantes}s`);
    this.cartelNivel.setFontSize(this.escala(20) + 'px');
    this.cartelNivel.setPosition(this.escala(10), this.escala(10));
    this.cartelNivel.setDisplaySize(this.escala(250), this.cartelNivel.height);
  }

  update(time, delta) {
    this.tiempoTranscurrido += delta;

    if (this.tiempoTranscurrido >= this.intervaloGeneracion) {
      this.actualizarRecursos();
      this.tiempoTranscurrido = 0;
    }

    if (this.enemigos.length === 0 && !this.oleadaGenerada) {
      this.tiempoRestanteOleada -= delta;
      if (this.tiempoRestanteOleada <= 0) {
        this.generarOleadaEnemigos();
      }
      this.actualizarCartelNivel();
    }

    this.enemigos = this.enemigos.filter(enemigo => {
      if (!enemigo.active) {
        this.tiempoUltimoEnemigoEliminado = time;
        return false;
      }
      return true;
    });

    for (const enemigo of this.enemigos) {
      enemigo.moverYAtacar(time, this.estructuras, this.defensas);
    }

    for (const defensa of this.defensas) {
      defensa.atacar(time, this.enemigos);
      defensa.actualizarProyectiles();
    }
  }
}

export default GameScene;