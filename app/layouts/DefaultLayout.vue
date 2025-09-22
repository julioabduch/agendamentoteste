<template>
  <div class="min-h-screen bg-gray-50 grid grid-cols-[auto_1fr]">
    <!-- Sidebar -->
    <AppSidebar />
    
    <!-- Main Content Area -->
    <main class="flex flex-col">
      <!-- Top Header Bar (opcional) -->
      <header class="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ pageTitle || 'Dashboard' }}</h1>
            <p class="text-sm text-gray-600 mt-1">{{ pageDescription || 'Gerencie seus agendamentos' }}</p>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- Notification Bell -->
            <button class="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <BellIcon class="w-6 h-6" />
            </button>
            
            <!-- Search -->
            <div class="relative">
              <input 
                type="text" 
                placeholder="Buscar..."
                class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
              <MagnifyingGlassIcon class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
        </div>
      </header>
      
      <!-- Page Content -->
      <div class="flex-1 p-6">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { BellIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

interface Props {
  pageTitle?: string
  pageDescription?: string
}

const props = withDefaults(defineProps<Props>(), {
  pageTitle: '',
  pageDescription: ''
})
</script>
