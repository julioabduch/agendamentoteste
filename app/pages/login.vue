<template>
  <div class="min-h-screen flex flex-col lg:flex-row">
    <!-- Mobile: Formulário aparece primeiro -->
    <div class="w-full lg:w-1/2 bg-gray-50 flex items-center justify-center p-6 lg:p-12 order-2 lg:order-1 min-h-[50vh] lg:min-h-screen">
      <LoginForm />
    </div>

    <!-- Mobile: Branding simplificado / Desktop: Branding completo -->
    <div class="w-full lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 flex items-center justify-center p-6 lg:p-12 relative overflow-hidden order-1 lg:order-2 min-h-[30vh] lg:min-h-screen">
      <!-- Elementos decorativos -->
      <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      <div class="absolute top-1/4 right-1/4 w-32 h-32 lg:w-64 lg:h-64 bg-white/5 rounded-full blur-3xl"></div>
      <div class="absolute bottom-1/4 left-1/4 w-24 h-24 lg:w-48 lg:h-48 bg-white/5 rounded-full blur-2xl"></div>
      
      <!-- Mobile: Versão compacta -->
      <div class="relative text-center text-white max-w-lg z-10 block lg:hidden">
        <h1 class="text-2xl font-bold mb-3 leading-tight">AgendaPro</h1>
        <p class="text-sm opacity-90">
          Sistema de Agendamento Profissional
        </p>
      </div>
      
      <!-- Desktop: Versão completa -->
      <div class="relative text-center text-white max-w-lg z-10 hidden lg:block">
        <h1 class="text-5xl font-bold mb-6 leading-tight">Sistema de Agendamento</h1>
        <p class="text-xl mb-10 leading-relaxed opacity-90">
          Gerencie seus agendamentos de forma simples e eficiente. Organize sua agenda e otimize seu tempo.
        </p>
        
        <div class="space-y-6 text-left">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-green-800" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <span class="text-lg font-medium">Agendamentos em tempo real</span>
          </div>
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-green-800" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <span class="text-lg font-medium">Notificações automáticas</span>
          </div>
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-green-800" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <span class="text-lg font-medium">Relatórios detalhados</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginForm from '../components/LoginForm.vue'
definePageMeta({ 
  layout: 'auth' as any
})
</script>
