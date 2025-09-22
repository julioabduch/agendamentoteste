<template>
  <div class="h-screen flex overflow-hidden bg-gray-50">
    <!-- Mobile backdrop -->
    <div 
      v-if="sidebarOpen" 
      class="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
      @click="closeSidebar"
    ></div>
    
    <!-- Mobile Sidebar -->
    <Transition
      enter-active-class="transform transition ease-in-out duration-300"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transform transition ease-in-out duration-300"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <div 
        v-if="sidebarOpen"
        class="fixed inset-y-0 left-0 z-30 w-64 flex-shrink-0 lg:hidden"
      >
        <AppSidebarMobile @close="closeSidebar" />
      </div>
    </Transition>

    <!-- Desktop Sidebar - Container flexível que se ajusta ao estado colapsado -->
    <div class="hidden lg:block flex-shrink-0" :style="{ width: sidebarWidth + 'px' }">
      <AppSidebar @width-changed="handleSidebarWidthChanged" />
    </div>
    
    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col overflow-hidden min-w-0">
      <!-- Mobile header -->
      <div class="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <button
          @click="openSidebar"
          class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
        >
          <Bars3Icon class="h-6 w-6" />
        </button>
        <h1 class="text-lg font-semibold text-gray-900">Agendamentos</h1>
        <div class="w-10"></div> <!-- Spacer for alignment -->
      </div>
      
      <!-- Main Content -->
      <main class="flex-1 overflow-hidden">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Bars3Icon } from '@heroicons/vue/24/outline'
import AppSidebar from '~/components/AppSidebar.vue'
import AppSidebarMobile from '~/components/AppSidebarMobile.vue'

// Estado da sidebar para mobile
const sidebarOpen = ref(false)

// Estado da largura da sidebar para desktop
const sidebarWidth = ref(256) // 256px = w-64

function openSidebar() {
  sidebarOpen.value = true
}

function closeSidebar() {
  sidebarOpen.value = false
}

// Função para lidar com mudança de largura da sidebar
function handleSidebarWidthChanged(width: number) {
  sidebarWidth.value = width
}

// Fechar sidebar quando clicar em links (mobile)
provide('closeSidebar', closeSidebar)
</script>
