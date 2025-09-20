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
      :value="displayValue"
      @input="handleInput"
      @paste="handlePaste"
      @keypress="handleKeypress"
      @blur="handleBlur"
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
import { inputMasks, inputValidations } from '../utils/inputMasks'

interface Props {
  modelValue: string
  type?: string
  placeholder?: string
  disabled?: boolean
  icon?: any
  mask?: 'cpf' | 'telefone' | 'none'
  validate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  mask: 'none',
  validate: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'validation-change': [isValid: boolean]
}>()

const showPassword = ref(false)

const showPasswordToggle = computed(() => props.type === 'password')

const actualType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type
})

// Valor exibido com máscara aplicada
const displayValue = computed(() => {
  if (props.mask === 'none') return props.modelValue
  
  switch (props.mask) {
    case 'cpf':
      return inputMasks.cpf(props.modelValue)
    case 'telefone':
      return inputMasks.telefone(props.modelValue)
    default:
      return props.modelValue
  }
})

// Função para aplicar máscara
function applyMask(value: string): string {
  if (props.mask === 'none') return value
  
  switch (props.mask) {
    case 'cpf':
      return inputMasks.cpf(value)
    case 'telefone':
      return inputMasks.telefone(value)
    default:
      return value
  }
}

// Função para obter valor limpo (sem máscara)
function getCleanValue(maskedValue: string): string {
  if (props.mask === 'none') return maskedValue
  return maskedValue.replace(/\D/g, '')
}

// Função para validar valor
function validateValue(value: string): boolean {
  if (!props.validate) return true
  
  switch (props.mask) {
    case 'cpf':
      return inputValidations.cpf(value)
    case 'telefone':
      return inputValidations.telefone(value)
    default:
      if (props.type === 'email') {
        return inputValidations.email(value)
      }
      return true
  }
}

function handleKeypress(event: KeyboardEvent) {
  // Para campos com máscara CPF e telefone, permite apenas números
  if (props.mask === 'cpf' || props.mask === 'telefone') {
    const char = String.fromCharCode(event.which)
    if (!/[0-9]/.test(char)) {
      event.preventDefault()
    }
  }
}

function handlePaste(event: ClipboardEvent) {
  // Para campos com máscara, filtra o conteúdo colado
  if (props.mask === 'cpf' || props.mask === 'telefone') {
    event.preventDefault()
    
    const pastedData = event.clipboardData?.getData('text') || ''
    const numbersOnly = pastedData.replace(/\D/g, '')
    
    // Aplica a máscara no conteúdo colado
    const maskedValue = applyMask(numbersOnly)
    const cleanValue = getCleanValue(maskedValue)
    
    // Atualiza o valor do input
    const target = event.target as HTMLInputElement
    target.value = maskedValue
    
    // Emite o valor limpo
    emit('update:modelValue', cleanValue)
    
    // Valida se necessário
    if (props.validate) {
      const isValid = validateValue(maskedValue)
      emit('validation-change', isValid)
    }
  }
}

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  let inputValue = target.value
  
  // Para campos com máscara CPF e telefone, filtra apenas números primeiro
  if (props.mask === 'cpf' || props.mask === 'telefone') {
    inputValue = inputValue.replace(/\D/g, '')
  }
  
  // Aplica máscara se necessário
  const maskedValue = applyMask(inputValue)
  
  // Atualiza o valor do input com a máscara aplicada
  if (target.value !== maskedValue) {
    target.value = maskedValue
  }
  
  // Obtém valor limpo para emitir
  const cleanValue = getCleanValue(maskedValue)
  
  // Valida se necessário
  if (props.validate) {
    const isValid = validateValue(maskedValue)
    emit('validation-change', isValid)
  }
  
  // Emite o valor limpo (sem máscara) para o v-model
  emit('update:modelValue', cleanValue)
}

function handleBlur(event: Event) {
  // Pode ser usado para validações on blur se necessário
  if (props.validate) {
    const isValid = validateValue(displayValue.value)
    emit('validation-change', isValid)
  }
}

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value
}
</script>
