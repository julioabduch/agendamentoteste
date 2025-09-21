<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  
  <!-- Container de Toasts Global -->
  <ToastContainer />
  
  <!-- PWA Install Prompt -->
  <PWAInstallPrompt />
</template>

<script setup lang="ts">
// Meta tags PWA
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'theme-color', content: '#3b82f6' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
    { name: 'apple-mobile-web-app-title', content: 'Agendamentos' },
    { name: 'application-name', content: 'Agendamentos' },
    { name: 'msapplication-TileColor', content: '#3b82f6' },
    { name: 'msapplication-TileImage', content: '/icons/icon-144x144.png' }
  ],
  link: [
    { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
    { rel: 'manifest', href: '/manifest.json' }
  ]
})
</script>
