// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/tailwindcss', 
    '@nuxtjs/supabase', 
    '@pinia/nuxt',
    '@vite-pwa/nuxt'
  ],
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/teste'], // Páginas que não precisam de autenticação
      saveRedirectToCookie: true
    }
  },
  ssr: true,
  nitro: {
    experimental: {
      wasm: true
    }
  },
  vite: {
    server: {
      hmr: {
        port: 24678
      }
    }
  }
})