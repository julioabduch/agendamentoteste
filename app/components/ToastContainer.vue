<template>
  <Teleport to="body">
    <TransitionGroup
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
      tag="div"
      class="fixed top-4 right-4 z-50 space-y-4 pointer-events-none"
      style="max-width: 420px; width: 100%;"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden"
      >
        <div class="p-4">
          <div class="flex items-start">
            <!-- Ícone -->
            <div class="flex-shrink-0">
              <component
                :is="getIcon(toast.type)"
                :class="[
                  'h-6 w-6',
                  toast.type === 'success' ? 'text-green-500' : '',
                  toast.type === 'error' ? 'text-red-500' : '',
                  toast.type === 'warning' ? 'text-yellow-500' : '',
                  toast.type === 'info' ? 'text-blue-500' : ''
                ]"
              />
            </div>
            
            <!-- Conteúdo -->
            <div class="ml-3 w-0 flex-1">
              <p class="text-sm font-semibold text-gray-900 leading-5">
                {{ toast.title }}
              </p>
              <p v-if="toast.message" class="mt-1 text-sm text-gray-600 leading-5">
                {{ toast.message }}
              </p>
            </div>
            
            <!-- Botão fechar -->
            <div class="ml-4 flex-shrink-0">
              <button
                @click="removeToast(toast.id)"
                class="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md p-1"
                type="button"
              >
                <span class="sr-only">Fechar</span>
                <XMarkIcon class="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        
        <!-- Barra de progresso (auto-close) -->
        <div 
          v-if="toast.autoClose !== false"
          class="h-1 bg-gray-100"
        >
          <div
            :class="[
              'h-full transition-all ease-linear',
              toast.type === 'success' ? 'bg-green-500' : '',
              toast.type === 'error' ? 'bg-red-500' : '',
              toast.type === 'warning' ? 'bg-yellow-500' : '',
              toast.type === 'info' ? 'bg-blue-500' : ''
            ]"
            :style="{ 
              width: `${toast.progress}%`,
              transitionDuration: '100ms'
            }"
          ></div>
        </div>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<script setup lang="ts">
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  autoClose?: boolean
  duration?: number
  progress?: number
}

// Estado global dos toasts
const toasts = ref<Toast[]>([])

// Mapa de ícones por tipo
const iconMap = {
  success: CheckCircleIcon,
  error: ExclamationCircleIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon
}

const getIcon = (type: Toast['type']) => iconMap[type]

// Função para remover toast
const removeToast = (id: string) => {
  const index = toasts.value.findIndex(toast => toast.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

// Função para adicionar toast
const addToast = (toast: Omit<Toast, 'id' | 'progress'>) => {
  const id = Math.random().toString(36).substr(2, 9)
  const newToast: Toast = {
    ...toast,
    id,
    progress: 100,
    autoClose: toast.autoClose !== false,
    duration: toast.duration || 5000
  }
  
  toasts.value.push(newToast)
  
  // Auto-close com barra de progresso
  if (newToast.autoClose) {
    let progress = 100
    const interval = setInterval(() => {
      progress -= (100 / (newToast.duration! / 100))
      newToast.progress = Math.max(0, progress)
      
      if (progress <= 0) {
        clearInterval(interval)
        removeToast(id)
      }
    }, 100)
  }
  
  return id
}

// Função para limpar todos os toasts
const clearToasts = () => {
  toasts.value = []
}

// Expor funções globalmente
provide('toast', {
  add: addToast,
  remove: removeToast,
  clear: clearToasts
})

// Também disponibilizar via window para uso global
if (process.client) {
  ;(window as any).$toast = {
    add: addToast,
    remove: removeToast,
    clear: clearToasts
  }
}
</script>
