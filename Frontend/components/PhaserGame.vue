<template>
  <div ref="gameContainer" class="game-container"></div>
</template>

<script>
import Phaser from 'phaser'

export default {
  props: {
    scenes: {
      type: Array,
      required: true
    }
  },
  methods: {
    initGame(scenes) {
      if (typeof window !== 'undefined') {
        const config = {
          type: Phaser.AUTO,
          width: 800,
          height: 600,
          scene: scenes,
          parent: this.$refs.gameContainer
        }
        new Phaser.Game(config)
      }
    }
  }
}
</script>

<style scoped>
.game-container {
  width: 100%;
  height: 100%;
}
</style>