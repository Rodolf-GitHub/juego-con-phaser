import Phaser from 'phaser';

const TAMANO_ESTANDAR = 40; // Tamaño estándar reducido aún más
const ORO_INICIAL = 0;
const PIEDRA_INICIAL = 0;
const COMIDA_INICIAL = 0;
const MADERA_INICIAL = 0;
const CAPACIDAD_INICIAL = 200;

export default class Recursos extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);
    this.scene = scene;
    this.recursos = { 
      oro: ORO_INICIAL, 
      piedra: PIEDRA_INICIAL, 
      comida: COMIDA_INICIAL, 
      madera: MADERA_INICIAL 
    };
    this.capacidades = {
      oro: CAPACIDAD_INICIAL,
      piedra: CAPACIDAD_INICIAL,
      comida: CAPACIDAD_INICIAL,
      madera: CAPACIDAD_INICIAL
    };
    this.nivel = 1;
    this.desplegado = true; // Cambiado a true para que siempre esté desplegado
    this.crearInterfaz();
    this.scene.add.existing(this);
  }

  crearInterfaz() {
    // Panel principal (siempre desplegado)
    this.panelPrincipal = this.scene.add.rectangle(0, 0, TAMANO_ESTANDAR * 5, TAMANO_ESTANDAR * 3, 0xf0e68c, 0.7).setOrigin(1, 0);
    this.panelPrincipal.setStrokeStyle(2, 0x4a4a4a, 0.8);

    // Título con emoji de almacén
    this.titulo = this.scene.add.text(TAMANO_ESTANDAR * -4.5, TAMANO_ESTANDAR * 0.2, '🏬 Recursos', {
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'bold',
      fill: '#4a4a4a',
      align: 'left'
    }).setOrigin(0, 0.5);

    // Recursos y capacidad máxima (siempre visibles)
    this.textoRecursos = this.scene.add.text(TAMANO_ESTANDAR * -4.5, TAMANO_ESTANDAR * 0.8, '', {
      fontSize: '12px',
      fontFamily: 'Arial, sans-serif',
      fill: '#000000',
      align: 'left'
    }).setOrigin(0, 0.5);

    // Información de nivel y costo de subida (siempre visible)
    this.textoNivel = this.scene.add.text(TAMANO_ESTANDAR * -4.5, TAMANO_ESTANDAR * 1.4, '', {
      fontSize: '12px',
      fontFamily: 'Arial, sans-serif',
      fill: '#4a4a4a',
      align: 'left'
    }).setOrigin(0, 0.5);

    // Botón para subir de nivel
    const botonSubir = this.scene.add.rectangle(TAMANO_ESTANDAR * -2.5, TAMANO_ESTANDAR * 2.2, TAMANO_ESTANDAR * 2, TAMANO_ESTANDAR * 0.6, 0x4a4a4a, 1).setOrigin(0.5);
    botonSubir.setStrokeStyle(2, 0xffffff);
    const textoBoton = this.scene.add.text(TAMANO_ESTANDAR * -2.5, TAMANO_ESTANDAR * 2.2, 'Subir nivel', {
      fontSize: '12px',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'bold',
      fill: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);

    botonSubir.setInteractive({ useHandCursor: true })
      .on('pointerover', () => botonSubir.setFillStyle(0x6a6a6a))
      .on('pointerout', () => botonSubir.setFillStyle(0x4a4a4a))
      .on('pointerdown', () => this.subirNivelAlmacen());

    this.add([this.panelPrincipal, this.titulo, this.textoRecursos, this.textoNivel, botonSubir, textoBoton]);
    this.actualizarTexto();
  }

  actualizarTexto() {
    const { oro, piedra, comida, madera } = this.recursos;
    this.textoRecursos.setText(
      `💰${oro}/${this.capacidades.oro} | 🗿${piedra}/${this.capacidades.piedra} | 🍖${comida}/${this.capacidades.comida} | 🌳${madera}/${this.capacidades.madera}`
    );
    const costoSubida = Math.floor(this.capacidades.oro * 0.5);
    this.textoNivel.setText(
      `Nivel: ${this.nivel}\nCoste subida: ${costoSubida} de cada recurso`
    );
  }

  obtenerIconoRecurso(recurso) {
    const iconos = {
      oro: '💰',
      piedra: '🗿',
      comida: '🍖',
      madera: '🌳'
    };
    return iconos[recurso] || '❓';
  }

  actualizarRecursos(nuevoOro, nuevaPiedra, nuevaComida, nuevaMadera) {
    const actualizarRecurso = (recurso, cantidad) => {
      const nuevoTotal = this.recursos[recurso] + cantidad;
      this.recursos[recurso] = Math.min(nuevoTotal, this.capacidades[recurso]);
    };

    actualizarRecurso('oro', nuevoOro);
    actualizarRecurso('piedra', nuevaPiedra);
    actualizarRecurso('comida', nuevaComida);
    actualizarRecurso('madera', nuevaMadera);

    this.actualizarTexto();
  }

  obtenerRecursos() {
    return this.recursos;
  }

  actualizarRecursosUI(recursos) {
    this.recursos = recursos;
    this.actualizarTexto();
  }

  subirNivelAlmacen() {
    const costoSubida = Object.fromEntries(
      Object.entries(this.capacidades).map(([recurso, capacidad]) => [recurso, Math.floor(capacidad * 0.5)])
    );

    if (Object.entries(costoSubida).every(([recurso, costo]) => this.recursos[recurso] >= costo)) {
      this.nivel++;
      Object.keys(this.capacidades).forEach(recurso => {
        this.recursos[recurso] -= costoSubida[recurso];
        this.capacidades[recurso] = Math.floor(this.capacidades[recurso] * 1.50);
      });
      
      this.actualizarTexto();
    } else {
      console.log('No hay suficientes recursos para subir de nivel el almacén');
      // Aquí podrías mostrar un mensaje de error en la interfaz
    }
  }
}

// Exportar métodos individuales para acceso desde otras partes
export const crearRecursos = (scene, x, y) => new Recursos(scene, x, y);
export const actualizarRecursos = (recursos, nuevoOro, nuevaPiedra, nuevaComida, nuevaMadera) => recursos.actualizarRecursos(nuevoOro, nuevaPiedra, nuevaComida, nuevaMadera);
export const obtenerRecursos = (recursos) => recursos.obtenerRecursos();
export const actualizarRecursosUI = (recursos, nuevosRecursos) => recursos.actualizarRecursosUI(nuevosRecursos);
