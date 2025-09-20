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
        <!-- Campo Nome da Especialidade -->
        <div>
          <label for="especialidade" class="block text-sm font-medium text-gray-700 mb-2">
            Nome da Especialidade *
          </label>
          <BaseInput
            id="especialidade"
            v-model="form.especialidade"
            type="text"
            placeholder="Digite o nome da especialidade"
            :disabled="isLoading"
            required
          />
          <p v-if="errors.especialidade" class="mt-1 text-sm text-red-600">
            {{ errors.especialidade }}
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
  especialidade: ''
})

// Estado de erros
const errors = reactive({
  especialidade: ''
})

// Estado de loading
const isLoading = ref(false)

// Composable para especialidades
const { fetchEspecialidades, adicionarEspecialidade, editarEspecialidade } = useProfissionais()

// Composable para toasts
const toast = useToast()

// Computed properties
const modalTitle = computed(() => 
  props.isEdicao ? 'Editar Especialidade' : 'Nova Especialidade'
)

const confirmText = computed(() => 
  props.isEdicao ? 'Salvar Alterações' : 'Criar Especialidade'
)

// Funções de validação
const validateForm = (): boolean => {
  let isValid = true
  
  // Reset errors
  errors.especialidade = ''
  
  // Validar especialidade
  if (!form.especialidade.trim()) {
    errors.especialidade = 'Nome da especialidade é obrigatório'
    isValid = false
  } else if (form.especialidade.trim().length < 2) {
    errors.especialidade = 'Nome deve ter pelo menos 2 caracteres'
    isValid = false
  }
  
  return isValid
}

// Buscar dados do registro para edição
const loadEspecialidade = async () => {
  if (!props.isEdicao || !props.registroId) return
  
  try {
    isLoading.value = true
    
    const supabase = useSupabaseClient<any>()
    const { data, error } = await supabase
      .from('ag_especialidades')
      .select('*')
      .eq('id', props.registroId)
      .single()
    
    if (error) throw error
    
    if (data) {
      form.especialidade = data.especialidade || ''
    }
  } catch (error) {
    console.error('Erro ao carregar especialidade:', error)
    // TODO: Mostrar notificação de erro
  } finally {
    isLoading.value = false
  }
}

// Reset do formulário
const resetForm = () => {
  form.especialidade = ''
  errors.especialidade = ''
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
      // Atualizar registro existente usando RPC function
      const resultado = await editarEspecialidade(
        props.registroId,
        form.especialidade.trim()
      )
      
      if (!resultado.success) {
        throw new Error(resultado.message)
      }
      
      // Toast de sucesso para edição
      toast.success(
        'Especialidade atualizada!',
        resultado.message
      )
    } else {
      // Criar novo registro usando RPC function
      const resultado = await adicionarEspecialidade(form.especialidade.trim())
      
      if (!resultado.success) {
        throw new Error(resultado.message)
      }
      
      // Toast de sucesso para criação
      toast.success(
        'Especialidade criada!',
        resultado.message
      )
    }
    
    // Reset e fechar
    resetForm()
    emit('success')
    
  } catch (error: any) {
    console.error('Erro ao salvar especialidade:', error)
    
    // Toast de erro
    const errorMessage = error.message || 'Erro ao salvar especialidade'
    toast.error(
      'Erro ao salvar',
      errorMessage
    )
    
  } finally {
    isLoading.value = false
  }
}

// Watchers
watch(() => props.isOpen, async (isOpen) => {
  if (isOpen && props.isEdicao && props.registroId) {
    // Para modo edição, carregar dados antes de mostrar o modal
    await loadEspecialidade()
  } else if (isOpen && !props.isEdicao) {
    // Para modo criação, apenas resetar o formulário
    resetForm()
  }
})
</script>
