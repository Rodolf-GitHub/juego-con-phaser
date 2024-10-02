// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/styles.css'],
  modules: ['@nuxt/ui',],

  runtimeConfig:{
    public:{
      backendurl:process.env.BACKEND_URL,
    }
    
  },

  compatibilityDate: '2024-09-02',
})