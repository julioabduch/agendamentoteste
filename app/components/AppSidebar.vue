<template>
  <aside 
    class="h-full bg-white border-r border-gray-200 shadow-sm flex flex-col transition-all duration-300"
    :class="isCollapsed ? 'w-16' : 'w-64'"
  >
    <!-- Header -->
    <div class="p-4 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3 min-w-0">
          <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
            </svg>
          </div>
          <div v-show="!isCollapsed" class="min-w-0 transition-opacity duration-300">
            <h1 class="text-lg font-bold text-gray-900 truncate">AgendaPro</h1>
            <p class="text-sm text-gray-500 truncate">Sistema de Agendamento</p>
          </div>
        </div>
        
        <!-- Toggle Button -->
        <button 
          @click="toggleSidebar"
          class="p-1 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
          :title="isCollapsed ? 'Expandir sidebar' : 'Recolher sidebar'"
        >
          <ChevronLeftIcon 
            class="w-5 h-5 text-gray-600 transition-transform duration-300"
            :class="isCollapsed ? 'rotate-180' : ''"
          />
        </button>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 p-4 space-y-1">
      <button 
        class="w-full flex items-center px-3 py-2 rounded-lg text-left text-gray-700 hover:bg-gray-100 transition-colors"
        :class="[
          { 'bg-primary-50 text-primary-700 border-r-2 border-primary-600': $route.path === '/' },
          isCollapsed ? 'justify-center' : 'space-x-3'
        ]"
        @click="navigateTo('/')"
        :title="isCollapsed ? 'Dashboard' : ''"
      >
        <HomeIcon class="w-5 h-5 flex-shrink-0" />
        <span v-show="!isCollapsed" class="transition-opacity duration-300">Dashboard</span>
      </button>
      
      <button 
        class="w-full flex items-center px-3 py-2 rounded-lg text-left text-gray-700 hover:bg-gray-100 transition-colors"
        :class="[
          { 'bg-primary-50 text-primary-700 border-r-2 border-primary-600': $route.path === '/especialidades' },
          isCollapsed ? 'justify-center' : 'space-x-3'
        ]"
        @click="navigateTo('/especialidades')"
        :title="isCollapsed ? 'Especialidades' : ''"
      >
        <AcademicCapIcon class="w-5 h-5 flex-shrink-0" />
        <span v-show="!isCollapsed" class="transition-opacity duration-300">Especialidades</span>
      </button>
      
      <button 
        class="w-full flex items-center px-3 py-2 rounded-lg text-left text-gray-700 hover:bg-gray-100 transition-colors"
        :class="[
          { 'bg-primary-50 text-primary-700 border-r-2 border-primary-600': $route.path === '/agendamentos' },
          isCollapsed ? 'justify-center' : 'space-x-3'
        ]"
        @click="navigateTo('/agendamentos')"
        :title="isCollapsed ? 'Agendamentos' : ''"
      >
        <CalendarIcon class="w-5 h-5 flex-shrink-0" />
        <span v-show="!isCollapsed" class="transition-opacity duration-300">Agendamentos</span>
      </button>
      
      <button 
        class="w-full flex items-center px-3 py-2 rounded-lg text-left text-gray-700 hover:bg-gray-100 transition-colors"
        :class="[
          { 'bg-primary-50 text-primary-700 border-r-2 border-primary-600': $route.path === '/clientes' },
          isCollapsed ? 'justify-center' : 'space-x-3'
        ]"
        @click="navigateTo('/clientes')"
        :title="isCollapsed ? 'Clientes' : ''"
      >
        <UsersIcon class="w-5 h-5 flex-shrink-0" />
        <span v-show="!isCollapsed" class="transition-opacity duration-300">Clientes</span>
      </button>
      
      <button 
        class="w-full flex items-center px-3 py-2 rounded-lg text-left text-gray-700 hover:bg-gray-100 transition-colors"
        :class="[
          { 'bg-primary-50 text-primary-700 border-r-2 border-primary-600': $route.path === '/profissionais' },
          isCollapsed ? 'justify-center' : 'space-x-3'
        ]"
        @click="navigateTo('/profissionais')"
        :title="isCollapsed ? 'Profissionais' : ''"
      >
        <UserGroupIcon class="w-5 h-5 flex-shrink-0" />
        <span v-show="!isCollapsed" class="transition-opacity duration-300">Profissionais</span>
      </button>
    </nav>

    <!-- Footer -->
    <div class="p-4 border-t border-gray-200">
      <DropdownMenu :is-collapsed="isCollapsed" />
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { 
  HomeIcon, 
  CalendarIcon, 
  UsersIcon, 
  UserGroupIcon,
  AcademicCapIcon,
  ChevronLeftIcon
} from '@heroicons/vue/24/outline'

// Emits
const emit = defineEmits<{
  'width-changed': [width: number]
}>()

// Estado do sidebar colapsado
const isCollapsed = ref(false)

// Função para alternar o estado do sidebar
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

// Watch para emitir mudanças de largura
watch(isCollapsed, (collapsed) => {
  const width = collapsed ? 64 : 256 // w-16 = 64px, w-64 = 256px
  emit('width-changed', width)
}, { immediate: true })
</script>
