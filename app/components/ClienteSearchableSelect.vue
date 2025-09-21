<template>
  <div class="relative">
    <!-- Input de busca -->
    <input
      ref="inputRef"
      v-model="searchTerm"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown="handleKeydown"
      :placeholder="placeholder"
      :required="required"
      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      autocomplete="off"
      type="text"
    />

    <!-- Dropdown com resultados -->
    <div
      v-if="isOpen && (filteredClientes.length > 0 || searchTerm)"
      class="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
    >
      <!-- Opção para limpar seleção -->
      <div
        v-if="showClearOption"
        @mousedown.prevent="selectCliente(null)"
        class="px-3 py-2 cursor-pointer hover:bg-gray-100 text-gray-500 border-b"
      >
        Limpar seleção
      </div>

      <!-- Lista de clientes filtrados -->
      <div
        v-for="cliente in filteredClientes"
        :key="cliente.id"
        @mousedown.prevent="selectCliente(cliente)"
        class="px-3 py-2 cursor-pointer hover:bg-blue-50 flex justify-between items-center"
        :class="{ 'bg-blue-100': selectedClienteId === cliente.id }"
      >
        <div>
          <div class="font-medium text-gray-900">{{ cliente.nome }}</div>
          <div v-if="cliente.cpf || cliente.telefone" class="text-sm text-gray-500">
            <span v-if="cliente.cpf">CPF: {{ cliente.cpf }}</span>
            <span v-if="cliente.cpf && cliente.telefone"> • </span>
            <span v-if="cliente.telefone">Tel: {{ cliente.telefone }}</span>
          </div>
        </div>
        <CheckIcon v-if="selectedClienteId === cliente.id" class="w-5 h-5 text-blue-600" />
      </div>

      <!-- Mensagem quando não encontra resultados -->
      <div
        v-if="searchTerm && filteredClientes.length === 0"
        class="px-3 py-2 text-gray-500 text-center"
      >
        Nenhum cliente encontrado para "{{ searchTerm }}"
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckIcon } from '@heroicons/vue/24/outline'
import type { Cliente } from '../../shared/types/database'

interface Props {
  modelValue: number | string | null
  clientes: Cliente[]
  placeholder?: string
  required?: boolean
  showClearOption?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Pesquisar cliente...',
  required: false,
  showClearOption: true
})

const emit = defineEmits<{
  'update:modelValue': [value: number | string | null]
}>()

// Refs
const inputRef = ref<HTMLInputElement>()

// Estado
const searchTerm = ref('')
const isOpen = ref(false)

// Computed
const selectedClienteId = computed(() => props.modelValue)

const selectedCliente = computed(() => {
  if (!props.modelValue) return null
  return props.clientes.find(cliente => cliente.id === props.modelValue)
})

const filteredClientes = computed(() => {
  if (!searchTerm.value) return props.clientes

  const term = searchTerm.value.toLowerCase()
  return props.clientes.filter(cliente => {
    const nome = (cliente.nome || '').toLowerCase()
    const cpf = (cliente.cpf || '').toLowerCase()
    const telefone = (cliente.telefone || '').toLowerCase()
    const email = (cliente.email || '').toLowerCase()
    
    return nome.includes(term) || 
           cpf.includes(term) || 
           telefone.includes(term) || 
           email.includes(term)
  })
})

// Watchers
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    const cliente = props.clientes.find(c => c.id === newValue)
    searchTerm.value = cliente?.nome || ''
  } else {
    searchTerm.value = ''
  }
}, { immediate: true })

watch(() => props.clientes, () => {
  // Atualizar texto se cliente foi carregado após seleção
  if (props.modelValue && selectedCliente.value) {
    searchTerm.value = selectedCliente.value.nome || ''
  }
})

// Functions
function handleInput() {
  if (!isOpen.value) {
    isOpen.value = true
  }
}

function handleFocus() {
  isOpen.value = true
}

function handleBlur() {
  setTimeout(() => {
    isOpen.value = false
    
    // Se não há seleção válida, limpar o campo ou manter o nome do cliente selecionado
    if (!selectedCliente.value) {
      // Tentar encontrar match exato
      const exactMatch = props.clientes.find(cliente => 
        (cliente.nome || '').toLowerCase() === searchTerm.value.toLowerCase()
      )
      
      if (exactMatch) {
        selectCliente(exactMatch)
      } else {
        searchTerm.value = ''
        emit('update:modelValue', null)
      }
    } else {
      searchTerm.value = selectedCliente.value.nome || ''
    }
  }, 150)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    isOpen.value = false
    inputRef.value?.blur()
  }
}

function selectCliente(cliente: Cliente | null) {
  if (cliente) {
    searchTerm.value = cliente.nome || ''
    emit('update:modelValue', cliente.id)
  } else {
    searchTerm.value = ''
    emit('update:modelValue', null)
  }
  isOpen.value = false
  inputRef.value?.blur()
}
</script>
