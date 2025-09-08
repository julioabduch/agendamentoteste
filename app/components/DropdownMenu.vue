<template>
  <div class="relative" ref="dropdownContainer">
    <!-- Trigger Button -->
    <button 
      @click="toggleDropdown"
      class="w-full flex items-center px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
      :class="[
        { 'bg-gray-100': isOpen },
        props.isCollapsed ? 'justify-center' : 'space-x-3'
      ]"
      :title="props.isCollapsed ? 'Configurações' : ''"
    >
      <CogIcon class="w-5 h-5 flex-shrink-0" />
      <span v-show="!props.isCollapsed" class="transition-opacity duration-300">Configurações</span>
      <ChevronUpIcon 
        v-show="!props.isCollapsed"
        class="w-4 h-4 ml-auto transition-transform duration-200"
        :class="{ 'rotate-180': !isOpen }"
      />
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-show="isOpen"
        class="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
      >
        <div class="py-1">
          <!-- Perfil -->
          <button
            @click="handlePerfil"
            class="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <UserIcon class="w-4 h-4" />
            <span class="text-sm">Perfil</span>
          </button>
          
          <!-- Divisor -->
          <div class="border-t border-gray-100 my-1"></div>
          
          <!-- Sair -->
          <button
            @click="handleSair"
            class="w-full flex items-center space-x-3 px-3 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
          >
            <ArrowRightOnRectangleIcon class="w-4 h-4" />
            <span class="text-sm">Sair</span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { 
  CogIcon, 
  ChevronUpIcon, 
  UserIcon, 
  ArrowRightOnRectangleIcon 
} from '@heroicons/vue/24/outline'

// Props
interface Props {
  isCollapsed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isCollapsed: false
})

const isOpen = ref(false)
const dropdownContainer = ref<HTMLElement>()

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const handlePerfil = () => {
  // Fechar dropdown
  isOpen.value = false
  // Ação do perfil será implementada futuramente
  console.log('Perfil clicado')
}

const handleSair = async () => {
  // Fechar dropdown
  isOpen.value = false
  // Executar logout
  const { signOut } = useAuth()
  await signOut()
}

// Fechar dropdown ao clicar fora
onMounted(() => {
  document.addEventListener('click', (event) => {
    if (dropdownContainer.value && !dropdownContainer.value.contains(event.target as Node)) {
      isOpen.value = false
    }
  })
})

onUnmounted(() => {
  document.removeEventListener('click', (event) => {
    if (dropdownContainer.value && !dropdownContainer.value.contains(event.target as Node)) {
      isOpen.value = false
    }
  })
})
</script>
