<template>
  <div class="relative">
    <!-- Ícone à esquerda (se fornecido) -->
    <div v-if="icon" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <component :is="icon" class="h-5 w-5 text-gray-400" />
    </div>
    
    <!-- Input -->
    <input
      :class="[
        'w-full py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:border-gray-300',
        icon ? 'pl-10' : 'pl-4',
        showPasswordToggle ? 'pr-10' : 'pr-4'
      ]"
      :value="modelValue"
      @input="updateValue(($event.target as HTMLInputElement)?.value || '')"
      :type="actualType"
      :placeholder="placeholder"
      :disabled="disabled"
    />
    
    <!-- Botão toggle senha (se for tipo password) -->
    <div v-if="showPasswordToggle" class="absolute inset-y-0 right-0 pr-3 flex items-center">
      <button
        type="button"
        @click="togglePasswordVisibility"
        class="text-gray-400 hover:text-gray-600 focus:outline-none"
      >
        <EyeIcon v-if="showPassword" class="h-5 w-5" />
        <EyeSlashIcon v-else class="h-5 w-5" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'

interface Props {
  modelValue: string
  type?: string
  placeholder?: string
  disabled?: boolean
  icon?: any
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const showPassword = ref(false)

const showPasswordToggle = computed(() => props.type === 'password')

const actualType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type
})

function updateValue(val: string) {
  emit('update:modelValue', val)
}

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value
}
</script>
