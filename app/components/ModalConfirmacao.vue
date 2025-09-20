<template>
  <BaseModal
    :is-open="isOpen"
    :title="title || 'Confirmar Ação'"
    :confirm-text="confirmText || 'Confirmar'"
    :cancel-text="cancelText || 'Cancelar'"
    :is-loading="isLoading"
    :close-on-overlay="!isLoading"
    @close="$emit('close')"
    @confirm="$emit('confirm')"
  >
    <template #content>
      <div class="flex items-start space-x-3">
        <!-- Ícone de alerta -->
        <div class="flex-shrink-0">
          <component 
            :is="icon || ExclamationTriangleIcon" 
            :class="[
              'h-6 w-6',
              variant === 'danger' ? 'text-red-600' : 'text-yellow-600'
            ]"
          />
        </div>
        
        <!-- Conteúdo da mensagem -->
        <div class="flex-1">
          <p class="text-sm text-gray-900">
            {{ message }}
          </p>
          <p v-if="description" class="mt-2 text-sm text-gray-500">
            {{ description }}
          </p>
        </div>
      </div>
    </template>

    <template #footer>
      <BaseButton
        variant="outline"
        @click="$emit('close')"
        :disabled="isLoading"
      >
        {{ cancelText || 'Cancelar' }}
      </BaseButton>
      
      <BaseButton
        variant="primary"
        @click="$emit('confirm')"
        :loading="isLoading"
        :disabled="isLoading"
        :class="variant === 'danger' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : ''"
      >
        {{ confirmText || 'Confirmar' }}
      </BaseButton>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

interface Props {
  isOpen: boolean
  title?: string
  message: string
  description?: string
  confirmText?: string
  cancelText?: string
  isLoading?: boolean
  variant?: 'primary' | 'danger'
  icon?: any
}

interface Emits {
  (e: 'close'): void
  (e: 'confirm'): void
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  isLoading: false
})

defineEmits<Emits>()
</script>
