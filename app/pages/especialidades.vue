<template>
  <div class="h-full flex flex-col">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900">Especialidades</h1>
        
        <!-- Botão Adicionar - só aparece para admin -->
        <BaseButton 
          v-if="userStore.isAdmin"
          variant="primary" 
          size="md"
          @click="abrirModalNovo"
        >
          <PlusIcon class="w-5 h-5 mr-2" />
          Adicionar Especialidade
        </BaseButton>
        
        <!-- Mensagem para usuários não-admin -->
        <div v-else class="text-sm text-gray-500 italic">
          Apenas administradores podem gerenciar especialidades
        </div>
      </div>
    </div>
    
    <!-- Conteúdo -->
    <div class="flex-1 p-6">
      <TabelaEspecialidades @editar="abrirModalEdicao" @deletar="abrirModalDeletar" />
    </div>

    <!-- Modal de Especialidade -->
    <ModalEspecialidade
      :is-open="modalAberto"
      :is-edicao="isEdicao"
      :registro-id="registroIdSelecionado"
      @close="fecharModal"
      @success="handleSuccess"
    />

    <!-- Modal de Confirmação para Deletar -->
    <ModalConfirmacao
      :is-open="modalDeletarAberto"
      title="Deletar Especialidade"
      :message="`Tem certeza que deseja deletar a especialidade selecionada?`"
      description="Esta ação não pode ser desfeita."
      confirm-text="Deletar"
      cancel-text="Cancelar"
      variant="danger"
      :is-loading="deletandoEspecialidade"
      @close="fecharModalDeletar"
      @confirm="confirmarDeletar"
    />
  </div>
</template>

<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline'

// Usar o store do usuário para verificar permissões
const userStore = useUserStore()

// Composable para toasts
const toast = useToast()

// Estado do modal de especialidade
const modalAberto = ref(false)
const isEdicao = ref(false)
const registroIdSelecionado = ref<number | null>(null)

// Estado do modal de deletar
const modalDeletarAberto = ref(false)
const deletandoEspecialidade = ref(false)
const especialidadeParaDeletar = ref<number | null>(null)

// Composable para especialidades
const { fetchEspecialidades, deletarEspecialidade } = useProfissionais()

// Funções para controlar o modal de especialidade
const abrirModalNovo = () => {
  if (!userStore.isAdmin) {
    toast.warning(
      'Acesso negado',
      'Apenas administradores podem adicionar especialidades'
    )
    return
  }
  
  isEdicao.value = false
  registroIdSelecionado.value = null
  modalAberto.value = true
}

const abrirModalEdicao = async (id: number) => {
  if (!userStore.isAdmin) {
    toast.warning(
      'Acesso negado',
      'Apenas administradores podem editar especialidades'
    )
    return
  }
  
  // Configurar estado antes de abrir o modal
  isEdicao.value = true
  registroIdSelecionado.value = id
  
  // Abrir modal (os dados serão carregados automaticamente via watcher)
  modalAberto.value = true
}

const fecharModal = () => {
  modalAberto.value = false
  isEdicao.value = false
  registroIdSelecionado.value = null
}

const handleSuccess = async () => {
  fecharModal()
  // Recarregar a lista de especialidades após sucesso
  await fetchEspecialidades()
  // Toast já é mostrado no modal, não precisa repetir aqui
}

// Funções para controlar o modal de deletar
const abrirModalDeletar = (id: number) => {
  if (!userStore.isAdmin) {
    toast.warning(
      'Acesso negado',
      'Apenas administradores podem deletar especialidades'
    )
    return
  }
  
  especialidadeParaDeletar.value = id
  modalDeletarAberto.value = true
}

const fecharModalDeletar = () => {
  modalDeletarAberto.value = false
  especialidadeParaDeletar.value = null
}

const confirmarDeletar = async () => {
  if (!especialidadeParaDeletar.value) return
  
  try {
    deletandoEspecialidade.value = true
    
    // Usar o composable para deletar
    const resultado = await deletarEspecialidade(especialidadeParaDeletar.value)
    
    if (resultado.success) {
      // Toast de sucesso
      toast.success(
        'Especialidade deletada!',
        resultado.message
      )
      
      // Fechar modal
      fecharModalDeletar()
    } else {
      // Toast de erro
      toast.error(
        'Erro ao deletar',
        resultado.message
      )
    }
    
  } catch (error: any) {
    console.error('Erro ao deletar especialidade:', error)
    
    // Toast de erro
    toast.error(
      'Erro ao deletar',
      error.message || 'Não foi possível deletar a especialidade'
    )
  } finally {
    deletandoEspecialidade.value = false
  }
}
</script>
