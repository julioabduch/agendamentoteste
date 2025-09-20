<template>
  <BaseModal
    :is-open="isOpen"
    :title="modalTitle"
    :confirm-text="confirmText"
    :is-loading="isLoading"
    @close="handleClose"
    @confirm="handleConfirm"
  >
    <template #content>
      <form @submit.prevent="handleConfirm" class="space-y-4">
        <!-- Campo CPF -->
        <div>
          <label for="cpf" class="block text-sm font-medium text-gray-700 mb-2">
            CPF *
          </label>
          <BaseInput
            id="cpf"
            v-model="form.cpf"
            type="text"
            mask="cpf"
            :validate="true"
            placeholder="000.000.000-00"
            :disabled="isLoading"
            required
            @validation-change="handleCpfValidation"
          />
          <p v-if="errors.cpf" class="mt-1 text-sm text-red-600">
            {{ errors.cpf }}
          </p>
        </div>

        <!-- Campo Nome -->
        <div>
          <label for="nome" class="block text-sm font-medium text-gray-700 mb-2">
            Nome *
          </label>
          <BaseInput
            id="nome"
            v-model="form.nome"
            type="text"
            placeholder="Nome completo do cliente"
            :disabled="isLoading"
            required
          />
          <p v-if="errors.nome" class="mt-1 text-sm text-red-600">
            {{ errors.nome }}
          </p>
        </div>

        <!-- Campo Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <BaseInput
            id="email"
            v-model="form.email"
            type="email"
            :validate="true"
            placeholder="email@exemplo.com"
            :disabled="isLoading"
            @validation-change="handleEmailValidation"
          />
          <p v-if="errors.email" class="mt-1 text-sm text-red-600">
            {{ errors.email }}
          </p>
        </div>

        <!-- Campo Telefone -->
        <div>
          <label for="telefone" class="block text-sm font-medium text-gray-700 mb-2">
            Telefone
          </label>
          <BaseInput
            id="telefone"
            v-model="form.telefone"
            type="tel"
            mask="telefone"
            :validate="true"
            placeholder="(00) 00000-0000"
            :disabled="isLoading"
            @validation-change="handleTelefoneValidation"
          />
          <p v-if="errors.telefone" class="mt-1 text-sm text-red-600">
            {{ errors.telefone }}
          </p>
        </div>

        <!-- Campo Endereço -->
        <div>
          <label for="endereco" class="block text-sm font-medium text-gray-700 mb-2">
            Endereço
          </label>
          <textarea
            id="endereco"
            v-model="form.endereco"
            rows="3"
            placeholder="Endereço completo"
            :disabled="isLoading"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
          ></textarea>
          <p v-if="errors.endereco" class="mt-1 text-sm text-red-600">
            {{ errors.endereco }}
          </p>
        </div>

        <!-- Informação sobre campos obrigatórios -->
        <p class="text-xs text-gray-500">
          * Campos obrigatórios
        </p>
      </form>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import type { Cliente } from '../../shared/types/database'

interface Props {
  isOpen: boolean
  isEdicao?: boolean
  registroId?: number | null
}

interface Emits {
  (e: 'close'): void
  (e: 'success'): void
}

const props = withDefaults(defineProps<Props>(), {
  isEdicao: false,
  registroId: null
})

const emit = defineEmits<Emits>()

// Estado do formulário
const form = reactive({
  cpf: '',
  nome: '',
  email: '',
  telefone: '',
  endereco: ''
})

// Estado de erros
const errors = reactive({
  cpf: '',
  nome: '',
  email: '',
  telefone: '',
  endereco: ''
})

// Estado de validação dos campos
const fieldValidation = reactive({
  cpf: true,
  email: true,
  telefone: true
})

// Estado de loading
const isLoading = ref(false)

// Handlers para validação em tempo real
const handleCpfValidation = (isValid: boolean) => {
  fieldValidation.cpf = isValid
  if (!isValid) {
    errors.cpf = 'CPF deve ter 11 dígitos'
  } else if (errors.cpf === 'CPF deve ter 11 dígitos') {
    errors.cpf = ''
  }
}

const handleEmailValidation = (isValid: boolean) => {
  fieldValidation.email = isValid
  if (!isValid && form.email.trim()) {
    errors.email = 'Email deve ter um formato válido'
  } else if (errors.email === 'Email deve ter um formato válido') {
    errors.email = ''
  }
}

const handleTelefoneValidation = (isValid: boolean) => {
  fieldValidation.telefone = isValid
  if (!isValid && form.telefone.trim()) {
    errors.telefone = 'Telefone deve ter formato válido (10 ou 11 dígitos)'
  } else if (errors.telefone === 'Telefone deve ter formato válido (10 ou 11 dígitos)') {
    errors.telefone = ''
  }
}

// Composable para clientes
const { adicionarCliente, editarCliente, fetchClientes } = useProfissionais()

// Composable para toasts
const toast = useToast()

// Computed properties
const modalTitle = computed(() => 
  props.isEdicao ? 'Editar Cliente' : 'Novo Cliente'
)

const confirmText = computed(() => 
  props.isEdicao ? 'Atualizar' : 'Criar'
)

// Função para buscar dados do cliente quando é edição
const carregarDadosCliente = async (id: number) => {
  if (!props.isEdicao || !id) return
  
  try {
    isLoading.value = true
    
    const supabase = useSupabaseClient<any>()
    const { data, error } = await supabase
      .from('ag_clientes')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    
    if (data) {
      form.cpf = data.cpf || ''
      form.nome = data.nome || ''
      form.email = data.email || ''
      form.telefone = data.telefone || ''
      form.endereco = data.endereco || ''
    }
  } catch (error) {
    console.error('Erro ao carregar cliente:', error)
    toast.error(
      'Erro ao carregar dados',
      'Não foi possível carregar os dados do cliente'
    )
  } finally {
    isLoading.value = false
  }
}

// Watcher para carregar dados quando abre modal de edição
watch(() => [props.isOpen, props.registroId], async ([isOpen, registroId]) => {
  if (isOpen && props.isEdicao && registroId && typeof registroId === 'number') {
    await carregarDadosCliente(registroId)
  }
}, { immediate: true })

// Função para validar formulário
const validateForm = (): boolean => {
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  let isValid = true

  // Validação CPF (obrigatório e deve ter 11 dígitos)
  if (!form.cpf.trim()) {
    errors.cpf = 'CPF é obrigatório'
    isValid = false
  } else if (!fieldValidation.cpf) {
    errors.cpf = 'CPF deve ter 11 dígitos'
    isValid = false
  }

  // Validação Nome (obrigatório)
  if (!form.nome.trim()) {
    errors.nome = 'Nome é obrigatório'
    isValid = false
  }

  // Validação Email (formato se preenchido)
  if (form.email.trim() && !fieldValidation.email) {
    errors.email = 'Email deve ter um formato válido'
    isValid = false
  }

  // Validação Telefone (formato se preenchido)
  if (form.telefone.trim() && !fieldValidation.telefone) {
    errors.telefone = 'Telefone deve ter formato válido (10 ou 11 dígitos)'
    isValid = false
  }

  return isValid
}

// Reset do formulário
const resetForm = () => {
  form.cpf = ''
  form.nome = ''
  form.email = ''
  form.telefone = ''
  form.endereco = ''
  
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
}

// Handlers
const handleClose = () => {
  if (!isLoading.value) {
    resetForm()
    emit('close')
  }
}

const handleConfirm = async () => {
  if (!validateForm()) return
  
  try {
    isLoading.value = true
    
    if (props.isEdicao && props.registroId) {
      // Editar cliente existente
      const dadosCliente: any = {
        cpf: form.cpf, // CPF já vem limpo do BaseInput
        nome: form.nome.trim()
      }

      // Adicionar campos opcionais apenas se preenchidos
      if (form.email.trim()) dadosCliente.email = form.email.trim()
      if (form.telefone.trim()) dadosCliente.telefone = form.telefone // Telefone já vem limpo
      if (form.endereco.trim()) dadosCliente.endereco = form.endereco.trim()

      const resultado = await editarCliente(props.registroId, dadosCliente)
      
      if (resultado.success) {
        // Toast de sucesso
        toast.success(
          'Cliente atualizado!',
          `Cliente "${form.nome}" foi atualizado com sucesso`
        )
        
        // Reset e fechar
        resetForm()
        emit('success')
      }
    } else {
      // Criar novo cliente
      const dadosCliente: any = {
        cpf: form.cpf, // CPF já vem limpo do BaseInput
        nome: form.nome.trim()
      }

      // Adicionar campos opcionais apenas se preenchidos
      if (form.email.trim()) dadosCliente.email = form.email.trim()
      if (form.telefone.trim()) dadosCliente.telefone = form.telefone // Telefone já vem limpo
      if (form.endereco.trim()) dadosCliente.endereco = form.endereco.trim()

      const resultado = await adicionarCliente(dadosCliente)
      
      if (resultado.success) {
        // Toast de sucesso
        toast.success(
          'Cliente criado!',
          `Cliente "${form.nome}" foi criado com sucesso`
        )
        
        // Reset e fechar
        resetForm()
        emit('success')
      }
    }
    
  } catch (error: any) {
    console.error('Erro ao salvar cliente:', error)
    
    // Toast de erro
    const errorMessage = error.message || 'Erro ao salvar cliente'
    toast.error(
      'Erro ao salvar',
      errorMessage
    )
    
  } finally {
    isLoading.value = false
  }
}
</script>
