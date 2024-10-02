import Phaser from 'phaser'

export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.provide('phaser', Phaser)
})