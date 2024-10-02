<template>

    <div>

      <ClientOnly>
        <div id="game-container"></div>
      </ClientOnly>
    </div>
  </template>
  
  <script setup>
  import { onMounted, onUnmounted, ref } from 'vue';

  const game = ref(null);

  onMounted(async () => {
    if (process.client) {
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
  </style>