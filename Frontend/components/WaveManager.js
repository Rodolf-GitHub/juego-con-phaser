import { Enemigo } from './Enemigo';

export class WaveManager {
  constructor(scene) {
    this.scene = scene;
  }

  generarOleada(nivel) {
    let enemigos = [];
    let poderRestante = nivel;

    while (poderRestante > 0) {
      const enemigosPosibles = this.scene.tiposEnemigos.filter(e => e.poder <= poderRestante);
      if (enemigosPosibles.length === 0) break;

      const enemigoElegido = enemigosPosibles[Math.floor(Math.random() * enemigosPosibles.length)];
      enemigos.push(this.crearEnemigo(enemigoElegido.tipo, 1));
      poderRestante -= enemigoElegido.poder;
    }

    return enemigos;
  }

  crearEnemigo(tipo, nivel) {
    const tipoEnemigo = this.scene.tiposEnemigos.find(e => e.tipo === tipo);
    if (tipoEnemigo) {
      return new Enemigo(
        this.scene,
        0,
        0,
        tipo,
        nivel,
        tipoEnemigo.rangoAtaque,
        tipoEnemigo.danoAtaque,
        tipoEnemigo.velocidadAtaque,
        tipoEnemigo.velocidadMovimiento,
        tipoEnemigo.emoji,
        tipoEnemigo.vidaMaxima
      );
    }
    console.error(`Tipo de enemigo no encontrado: ${tipo}`);
    return null;
  }
}
