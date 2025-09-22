<template>
  <div class="h-screen flex overflow-hidden bg-gray-50">
    <!-- Mobile backdrop -->
    <div 
      v-if="sidebarOpen" 
      class="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
      @click="closeSidebar"
    ></div>
    
    <!-- Sidebar -->
    <div :class="[
      'fixed inset-y-0 left-0 z-30 w-64 flex-shrink-0 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    ]">
      <AppSidebarMobile @close="closeSidebar" />
    </div>
    
    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col overflow-hidden lg:ml-0">
      <!-- Mobile header -->
      <div class="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button
          @click="openSidebar"
          class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
        >
          <Bars3Icon class="h-6 w-6" />
        </button>
        <h1 class="text-lg font-semibold text-gray-900">AgendaPro</h1>
        <div class="w-10"></div> <!-- Spacer for alignment -->
      </div>
      
      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto p-3 lg:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Bars3Icon } from '@heroicons/vue/24/outline'

// Estado da sidebar para mobile
const sidebarOpen = ref(false)

function openSidebar() {
  sidebarOpen.value = true
}

function closeSidebar() {
  sidebarOpen.value = false
}

// Fechar sidebar quando clicar em links (mobile)
provide('closeSidebar', closeSidebar)
</script>
