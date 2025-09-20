<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click="handleOverlayClick"
      >
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
        
        <!-- Modal Container -->
        <div class="flex min-h-full items-center justify-center p-4">
          <Transition
            enter-active-class="transition ease-out duration-300"
            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="transition ease-in duration-200"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              v-if="isOpen"
              class="relative w-full max-w-lg transform overflow-hidden rounded-lg bg-white shadow-xl transition-all"
              @click.stop
            >
              <!-- Header -->
              <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ title }}
                </h3>
                <button
                  @click="close"
                  class="text-gray-400 hover:text-gray-600 transition-colors"
                  type="button"
                >
                  <XMarkIcon class="h-6 w-6" />
                </button>
              </div>

              <!-- Content -->
              <div class="px-6 py-4">
                <slot name="content" />
              </div>

              <!-- Footer -->
              <div class="flex items-center justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                <slot name="footer">
                  <!-- Botões padrão -->
                  <BaseButton
                    variant="outline"
                    @click="close"
                    :disabled="isLoading"
                  >
                    {{ cancelText }}
                  </BaseButton>
                  
                  <BaseButton
                    variant="primary"
                    @click="confirm"
                    :loading="isLoading"
                    :disabled="isLoading"
                  >
                    {{ confirmText }}
                  </BaseButton>
                </slot>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'

interface Props {
  isOpen: boolean
  title: string
  confirmText?: string
  cancelText?: string
  isLoading?: boolean
  closeOnOverlay?: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'confirm'): void
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  isLoading: false,
  closeOnOverlay: true
})

const emit = defineEmits<Emits>()

const close = () => {
  emit('close')
}

const confirm = () => {
  emit('confirm')
}

const handleOverlayClick = () => {
  if (props.closeOnOverlay && !props.isLoading) {
    close()
  }
}

// Prevenir scroll do body quando modal está aberto
watch(() => props.isOpen, (isOpen) => {
  if (process.client) {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
})

// Cleanup no unmount
onUnmounted(() => {
  if (process.client) {
    document.body.style.overflow = ''
  }
})
</script>
