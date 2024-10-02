<template>
  <div>
    <div v-if="isLoading" class="loading-overlay">
      <p>Cargando juego...</p>
    </div>
    <ClientOnly>
      <div id="game-container"></div>
    </ClientOnly>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

const game = ref(null);
const isLoading = ref(true);

onMounted(async () => {
  if (process.client) {
    isLoading.value = true;
    const Phaser = await import('phaser');
    const { default: GameScene } = await import('../scenes/GameScene');
    
    const config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      parent: 'game-container',
      scene: [GameScene],
      backgroundColor: '#f0e68c',
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    };

    game.value = new Phaser.Game(config);

    game.value.events.once('ready', () => {
      isLoading.value = false;
    });

    window.addEventListener('resize', resizeGame);
  }
});

onUnmounted(() => {
  if (process.client && game.value) {
    game.value.destroy(true);
    window.removeEventListener('resize', resizeGame);
  }
});

function resizeGame() {
  if (game.value) {
    game.value.scale.resize(window.innerWidth, window.innerHeight);
  }
}
</script>

<style scoped>
#game-container {
  width: 100%;
  height: 100%;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-overlay p {
  color: white;
  font-size: 24px;
}
</style>