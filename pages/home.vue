<template>
  <Menu />
  <div class="home">
    <div id="game-container"></div>
    <div class="mensaje-central">¡Bienvenido al juego!</div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, defineComponent } from 'vue';

const game = ref(null);
let estructura;
let bordes;

defineComponent({
  name: 'HomePage',
  meta: {
    layout: 'default'
  }
});

onMounted(async () => {
  if (process.client) {
    const Phaser = await import('phaser');
    const config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      parent: 'game-container',
      scene: {
        preload: preload,
        create: create,
        update: update
      },
      backgroundColor: '#f0e68c',
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    };

    game.value = new Phaser.Game(config);

    window.addEventListener('resize', resizeGame);
  }
});

onUnmounted(() => {
  if (game.value) {
    game.value.destroy(true);
  }
  window.removeEventListener('resize', resizeGame);
});

function resizeGame() {
  if (game.value) {
    game.value.scale.resize(window.innerWidth, window.innerHeight);
    if (estructura) {
      estructura.setPosition(game.value.scale.width / 2, game.value.scale.height / 2);
    }
    actualizarBordes();
  }
}

function preload() {
  // No se cargan imágenes
}

function create() {
  console.log('Función create ejecutada');
  
  // Añadir la estructura en el centro usando un emoji
  estructura = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, '🏠', {
    font: '48px Arial',
    fill: '#000000'
  }).setOrigin(0.5);

  // Crear bordes con gráficos
  bordes = crearBordes.call(this);
}

function crearBordes() {
  const bordeAncho = Math.min(50, this.cameras.main.width * 0.05);
  const graphics = this.add.graphics();
  
  graphics.fillStyle(0x8b4513, 1);
  graphics.fillRect(0, 0, this.cameras.main.width, bordeAncho);
  graphics.fillRect(0, this.cameras.main.height - bordeAncho, this.cameras.main.width, bordeAncho);
  graphics.fillRect(0, bordeAncho, bordeAncho, this.cameras.main.height - 2 * bordeAncho);
  graphics.fillRect(this.cameras.main.width - bordeAncho, bordeAncho, bordeAncho, this.cameras.main.height - 2 * bordeAncho);

  // Añadir textura de roca
  for (let i = 0; i < 1000; i++) {
    const x = Phaser.Math.Between(0, this.cameras.main.width);
    const y = Phaser.Math.Between(0, this.cameras.main.height);
    if (x < bordeAncho || x > this.cameras.main.width - bordeAncho || y < bordeAncho || y > this.cameras.main.height - bordeAncho) {
      graphics.fillStyle(0x696969, Math.random() * 0.5 + 0.5);
      graphics.fillCircle(x, y, Math.random() * 3 + 1);
    }
  }

  return graphics;
}

function actualizarBordes() {
  if (bordes && game.value) {
    bordes.clear();
    crearBordes.call(game.value.scene.scenes[0]);
  }
}

function update() {
  // Mover la estructura de forma aleatoria dentro de los bordes
  if (estructura && game.value) {
    const bordeAncho = Math.min(50, game.value.scale.width * 0.05);
    const randomX = Phaser.Math.Between(bordeAncho + 25, game.value.scale.width - bordeAncho - 25);
    const randomY = Phaser.Math.Between(bordeAncho + 25, game.value.scale.height - bordeAncho - 25);
    
    this.tweens.add({
      targets: estructura,
      x: randomX,
      y: randomY,
      duration: 2000,
      ease: 'Power2'
    });
  }
}
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: relative;
}

#game-container {
  flex-grow: 1;
  background-color: #f0e68c;
  border: none;
  box-shadow: none;
}

.mensaje-central {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: clamp(16px, 4vw, 24px);
  color: #000000;
  z-index: 10;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 10px 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .mensaje-central {
    font-size: clamp(14px, 3vw, 20px);
    padding: 5px 10px;
  }
}
</style>