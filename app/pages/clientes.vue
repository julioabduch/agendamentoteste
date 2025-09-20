<template>
  <div class="h-full flex flex-col">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900">Clientes</h1>
        
        <!-- Botão Adicionar - só aparece para admin -->
        <BaseButton 
          v-if="userStore.isAdmin"
          variant="primary" 
          size="md"
          @click="abrirModalNovo"
        >
          <PlusIcon class="w-5 h-5 mr-2" />
          Adicionar Cliente
        </BaseButton>
        
        <!-- Mensagem para usuários não-admin -->
        <div v-else class="text-sm text-gray-500 italic">
          Apenas administradores podem gerenciar clientes
        </div>
      </div>
    </div>
    
    <!-- Conteúdo -->
    <div class="flex-1 p-6">
      <TabelaClientes @editar="abrirModalEdicao" @deletar="abrirModalDeletar" />
    </div>

    <!-- Modal de Cliente -->
    <ModalCliente
      :is-open="modalAberto"
      :is-edicao="isEdicao"
      :registro-id="registroIdSelecionado"
      @close="fecharModal"
      @success="handleSuccess"
    />

    <!-- Modal de Confirmação para Deletar -->
    <ModalConfirmacao
      :is-open="modalDeletarAberto"
      title="Deletar Cliente"
      :message="`Tem certeza que deseja deletar o cliente selecionado?`"
      description="Esta ação não pode ser desfeita."
      confirm-text="Deletar"
      cancel-text="Cancelar"
      variant="danger"
      :is-loading="deletandoCliente"
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

// Estado do modal de cliente
const modalAberto = ref(false)
const isEdicao = ref(false)
const registroIdSelecionado = ref<number | null>(null)

// Estado do modal de deletar
const modalDeletarAberto = ref(false)
const deletandoCliente = ref(false)
const clienteParaDeletar = ref<number | null>(null)

// Composable para clientes
const { fetchClientes, deletarCliente } = useProfissionais()

// Funções para controlar o modal de cliente
const abrirModalNovo = () => {
  if (!userStore.isAdmin) {
    toast.warning(
      'Acesso negado',
      'Apenas administradores podem adicionar clientes'
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
      'Apenas administradores podem editar clientes'
    )
    return
  }
  
  isEdicao.value = true
  registroIdSelecionado.value = id
  modalAberto.value = true
}

const abrirModalDeletar = (id: number) => {
  if (!userStore.isAdmin) {
    toast.warning(
      'Acesso negado',
      'Apenas administradores podem deletar clientes'
    )
    return
  }
  
  clienteParaDeletar.value = id
  modalDeletarAberto.value = true
}

// Funções de controle dos modais
const fecharModal = () => {
  modalAberto.value = false
  isEdicao.value = false
  registroIdSelecionado.value = null
}

const handleSuccess = async () => {
  fecharModal()
  // Recarregar a lista de clientes após sucesso
  await fetchClientes()
}

const fecharModalDeletar = () => {
  modalDeletarAberto.value = false
  clienteParaDeletar.value = null
}

const confirmarDeletar = async () => {
  if (!clienteParaDeletar.value) return
  
  try {
    deletandoCliente.value = true
    
    await deletarCliente(clienteParaDeletar.value)
    
    // Toast de sucesso
    toast.success(
      'Cliente deletado!',
      'Cliente foi removido com sucesso'
    )
    
    fecharModalDeletar()
    
  } catch (error: any) {
    console.error('Erro ao deletar cliente:', error)
    
    // Toast de erro
    const errorMessage = error.message || 'Erro ao deletar cliente'
    toast.error(
      'Erro ao deletar',
      errorMessage
    )
    
  } finally {
    deletandoCliente.value = false
  }
}
</script>
