<template>
  <div class="relative">
    <!-- Input de busca -->
    <div class="relative">
      <input
        v-model="searchTerm"
        @focus="isOpen = true"
        @blur="handleBlur"
        @keydown="handleKeydown"
        :placeholder="placeholder"
        :required="required"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-8"
        autocomplete="off"
      />
      
      <!-- Ícone dropdown -->
      <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <ChevronUpDownIcon class="h-5 w-5 text-gray-400" />
      </div>
    </div>

    <!-- Lista de opções -->
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen && (filteredOptions.length > 0 || searchTerm)"
        class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
      >
        <!-- Opção vazia quando não há busca -->
        <div
          v-if="!searchTerm && showEmptyOption"
          @mousedown.prevent="selectOption(null)"
          class="cursor-pointer select-none relative py-2 pl-3 pr-9 text-gray-500 hover:bg-blue-50"
        >
          {{ emptyText }}
        </div>

        <!-- Opções filtradas -->
        <div
          v-for="(option, index) in filteredOptions"
          :key="option[valueKey]"
          @mousedown.prevent="selectOption(option)"
          :class="[
            'cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50 transition-colors',
            {
              'bg-blue-100': highlightedIndex === index,
              'text-blue-900': highlightedIndex === index,
              'text-gray-900': highlightedIndex !== index
            }
          ]"
        >
          <span class="block truncate">
            {{ option[displayKey] }}
          </span>
          
          <!-- Checkmark se selecionado -->
          <span
            v-if="selectedOption && selectedOption[valueKey] === option[valueKey]"
            class="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600"
          >
            <CheckIcon class="h-5 w-5" />
          </span>
        </div>

        <!-- Mensagem quando não encontra resultados -->
        <div
          v-if="searchTerm && filteredOptions.length === 0"
          class="cursor-default select-none relative py-2 pl-3 pr-9 text-gray-500"
        >
          Nenhum resultado encontrado para "{{ searchTerm }}"
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/vue/24/outline'

interface Option {
  [key: string]: any
}

interface Props {
  options: Option[]
  modelValue: any
  displayKey?: string
  valueKey?: string
  placeholder?: string
  emptyText?: string
  showEmptyOption?: boolean
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  displayKey: 'name',
  valueKey: 'id',
  placeholder: 'Pesquisar...',
  emptyText: 'Selecione uma opção',
  showEmptyOption: true,
  required: false
})

const emit = defineEmits<{
  'update:modelValue': [value: any]
}>()

// Estado do componente
const searchTerm = ref('')
const isOpen = ref(false)
const highlightedIndex = ref(-1)

// Opção selecionada
const selectedOption = computed(() => {
  if (!props.modelValue) return null
  return props.options.find(option => option[props.valueKey] === props.modelValue)
})

// Opções filtradas pela busca
const filteredOptions = computed(() => {
  if (!searchTerm.value) return props.options
  
  return props.options.filter(option => {
    const displayValue = String(option[props.displayKey] || '').toLowerCase()
    const search = searchTerm.value.toLowerCase()
    return displayValue.includes(search)
  })
})

// Atualizar campo de busca quando valor externo muda
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    const option = props.options.find(opt => opt[props.valueKey] === newValue)
    searchTerm.value = option ? String(option[props.displayKey] || '') : ''
  } else {
    searchTerm.value = ''
  }
}, { immediate: true })

// Atualizar opções quando props.options muda
watch(() => props.options, () => {
  // Se havia uma opção selecionada, manter o texto
  if (props.modelValue && selectedOption.value) {
    searchTerm.value = String(selectedOption.value[props.displayKey] || '')
  }
})

// Funções
function selectOption(option: Option | null) {
  if (option) {
    searchTerm.value = String(option[props.displayKey] || '')
    emit('update:modelValue', option[props.valueKey])
  } else {
    searchTerm.value = ''
    emit('update:modelValue', null)
  }
  isOpen.value = false
  highlightedIndex.value = -1
}

function handleBlur() {
  // Delay para permitir clique na opção
  setTimeout(() => {
    isOpen.value = false
    highlightedIndex.value = -1
    
    // Se não encontrou exatamente o que foi digitado, limpar ou manter seleção anterior
    if (searchTerm.value && !selectedOption.value) {
      const exactMatch = props.options.find(option => 
        String(option[props.displayKey] || '').toLowerCase() === searchTerm.value.toLowerCase()
      )
      
      if (exactMatch) {
        selectOption(exactMatch)
      } else {
        // Manter texto da seleção anterior ou limpar
        if (selectedOption.value) {
          searchTerm.value = String(selectedOption.value[props.displayKey] || '')
        } else {
          searchTerm.value = ''
        }
      }
    }
  }, 150)
}

function handleKeydown(event: KeyboardEvent) {
  if (!isOpen.value && ['ArrowDown', 'ArrowUp', 'Enter'].includes(event.key)) {
    isOpen.value = true
    return
  }

  if (!isOpen.value) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      highlightedIndex.value = Math.min(highlightedIndex.value + 1, filteredOptions.value.length - 1)
      break
      
    case 'ArrowUp':
      event.preventDefault()
      highlightedIndex.value = Math.max(highlightedIndex.value - 1, -1)
      break
      
    case 'Enter':
      event.preventDefault()
      if (highlightedIndex.value >= 0 && filteredOptions.value[highlightedIndex.value]) {
        const selectedOption = filteredOptions.value[highlightedIndex.value]
        if (selectedOption) {
          selectOption(selectedOption)
        }
      } else if (highlightedIndex.value === -1 && props.showEmptyOption) {
        selectOption(null)
      }
      break
      
    case 'Escape':
      event.preventDefault()
      isOpen.value = false
      highlightedIndex.value = -1
      break
  }
}

// Reset highlight quando filtro muda
watch(filteredOptions, () => {
  highlightedIndex.value = -1
})
</script>
