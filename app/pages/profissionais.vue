<template>
  <div class="h-full flex flex-col">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900">Profissionais</h1>
        
        <!-- Botão Adicionar - só aparece para admin -->
        <BaseButton 
          v-if="userStore.isAdmin"
          variant="primary" 
          size="md"
          @click="abrirModalNovo"
        >
          <PlusIcon class="w-5 h-5 mr-2" />
          Adicionar Profissional
        </BaseButton>
        
        <!-- Mensagem para usuários não-admin -->
        <div v-else class="text-sm text-gray-500 italic">
          Apenas administradores podem gerenciar profissionais
        </div>
      </div>
    </div>
    
    <!-- Conteúdo -->
    <div class="flex-1 p-6">
      <TabelaProfissionais @editar="abrirModalEdicao" @deletar="abrirModalDeletar" />
    </div>

    <!-- TODO: Modais serão implementados posteriormente -->
    <!-- Modal de Profissional -->
    <!-- <ModalProfissional
      :is-open="modalAberto"
      :is-edicao="isEdicao"
      :registro-id="registroIdSelecionado"
      @close="fecharModal"
      @success="handleSuccess"
    /> -->

    <!-- Modal de Confirmação para Deletar -->
    <!-- <ModalConfirmacao
      :is-open="modalDeletarAberto"
      title="Deletar Profissional"
      :message="`Tem certeza que deseja deletar o profissional selecionado?`"
      description="Esta ação não pode ser desfeita."
      confirm-text="Deletar"
      cancel-text="Cancelar"
      variant="danger"
      :is-loading="deletandoProfissional"
      @close="fecharModalDeletar"
      @confirm="confirmarDeletar"
    /> -->
  </div>
</template>

<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline'

// Usar o store do usuário para verificar permissões
const userStore = useUserStore()

// Composable para toasts
const toast = useToast()

// Estado do modal de profissional (para implementação futura)
const modalAberto = ref(false)
const isEdicao = ref(false)
const registroIdSelecionado = ref<number | null>(null)

// Estado do modal de deletar (para implementação futura)
const modalDeletarAberto = ref(false)
const deletandoProfissional = ref(false)
const profissionalParaDeletar = ref<number | null>(null)

// Composable para profissionais
const { fetchProfissionais } = useProfissionais()

// Funções para controlar o modal de profissional (placeholder para implementação futura)
const abrirModalNovo = () => {
  if (!userStore.isAdmin) {
    toast.warning(
      'Acesso negado',
      'Apenas administradores podem adicionar profissionais'
    )
    return
  }
  
  // TODO: Implementar modal de criação
  toast.info(
    'Em desenvolvimento',
    'Modal de criação de profissional será implementado em breve'
  )
}

const abrirModalEdicao = async (id: number) => {
  if (!userStore.isAdmin) {
    toast.warning(
      'Acesso negado',
      'Apenas administradores podem editar profissionais'
    )
    return
  }
  
  // TODO: Implementar modal de edição
  toast.info(
    'Em desenvolvimento',
    `Modal de edição do profissional ID ${id} será implementado em breve`
  )
}

const abrirModalDeletar = (id: number) => {
  if (!userStore.isAdmin) {
    toast.warning(
      'Acesso negado',
      'Apenas administradores podem deletar profissionais'
    )
    return
  }
  
  // TODO: Implementar modal de confirmação
  toast.info(
    'Em desenvolvimento',
    `Modal de exclusão do profissional ID ${id} será implementado em breve`
  )
}

// Funções placeholder para implementação futura
const fecharModal = () => {
  modalAberto.value = false
  isEdicao.value = false
  registroIdSelecionado.value = null
}

const handleSuccess = async () => {
  fecharModal()
  // Recarregar a lista de profissionais após sucesso
  await fetchProfissionais()
}

const fecharModalDeletar = () => {
  modalDeletarAberto.value = false
  profissionalParaDeletar.value = null
}
</script>
