<template>
  <BaseModal
    :isOpen="isOpen"
    title="Detalhes do Agendamento"
    @close="emit('close')"
    size="lg"
  >
    <template #content>
      <div v-if="agendamento" class="space-y-6">
        <!-- Informações do Cliente -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h3 class="text-sm font-medium text-gray-900 mb-2">Cliente</h3>
          <p class="text-gray-700">{{ agendamento.titulo || 'Título não informado' }}</p>
        </div>

        <!-- Data e Horário -->
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-sm font-medium text-gray-900 mb-2">Data</h3>
            <p class="text-gray-700">{{ formatarData(agendamento.data) }}</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-sm font-medium text-gray-900 mb-2">Horário</h3>
            <p class="text-gray-700">{{ agendamento.hora_inicio?.substring(0, 5) }} - {{ agendamento.hora_fim?.substring(0, 5) }}</p>
          </div>
        </div>

        <!-- Título (editável) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Título *
          </label>
          <BaseInput
            v-model="formEdicao.titulo"
            :disabled="!modoEdicao"
            placeholder="Título do agendamento"
            class="w-full"
          />
        </div>

        <!-- Descrição (editável) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Descrição
          </label>
          <textarea
            v-model="formEdicao.descricao"
            :disabled="!modoEdicao"
            placeholder="Observações adicionais (opcional)"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
            :class="{ 'bg-gray-100 text-gray-500': !modoEdicao }"
            rows="3"
          />
        </div>

        <!-- Status -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h3 class="text-sm font-medium text-gray-900 mb-2">Status</h3>
          <div class="flex items-center space-x-2">
            <span
              :class="{
                'bg-green-100 text-green-800': !agendamento.cancelado,
                'bg-red-100 text-red-800': agendamento.cancelado
              }"
              class="inline-flex px-2 py-1 text-xs font-medium rounded-full"
            >
              {{ agendamento.cancelado ? 'Cancelado' : 'Ativo' }}
            </span>
            <span v-if="agendamento.cancelado && agendamento.cancelado_as" class="text-xs text-gray-500">
              (Cancelado em: {{ formatarDataHora(agendamento.cancelado_as) }})
            </span>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-else class="flex items-center justify-center py-8">
        <div class="text-gray-500">Carregando...</div>
      </div>
    </template>

    <template #actions>
      <div class="flex justify-between w-full">
        <!-- Botões da esquerda -->
        <div class="flex space-x-3">
          <!-- Botão Editar/Salvar -->
          <BaseButton
            v-if="!agendamento?.cancelado"
            :variant="modoEdicao ? 'primary' : 'outline'"
            :disabled="isProcessing || (modoEdicao && !isFormEdicaoValid)"
            @click="toggleEdicao"
          >
            <span v-if="isProcessing && modoEdicao">Salvando...</span>
            <span v-else-if="modoEdicao">Salvar</span>
            <span v-else>Editar</span>
          </BaseButton>

          <!-- Botão Cancelar Edição -->
          <BaseButton
            v-if="modoEdicao"
            variant="outline"
            :disabled="isProcessing"
            @click="cancelarEdicao"
          >
            Cancelar
          </BaseButton>
        </div>

        <!-- Botões da direita -->
        <div class="flex space-x-3">
          <!-- Botão Cancelar Agendamento -->
          <BaseButton
            v-if="!agendamento?.cancelado"
            class="bg-red-600 hover:bg-red-700 text-white"
            :disabled="isProcessing"
            @click="confirmarCancelamento"
          >
            <span v-if="isProcessing && operacaoAtual === 'cancelar'">Cancelando...</span>
            <span v-else>Cancelar Agendamento</span>
          </BaseButton>

          <!-- Botão Fechar -->
          <BaseButton
            variant="outline"
            :disabled="isProcessing"
            @click="emit('close')"
          >
            Fechar
          </BaseButton>
        </div>
      </div>
    </template>
  </BaseModal>

  <!-- Modal de Confirmação de Cancelamento -->
  <ModalConfirmacao
    :isOpen="modalConfirmacaoAberto"
    title="Cancelar Agendamento"
    message="Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita."
    confirmText="Sim, Cancelar"
    cancelText="Não, Manter"
    @confirm="executarCancelamento"
    @cancel="modalConfirmacaoAberto = false"
  />
</template>

<script setup lang="ts">
import BaseModal from './BaseModal.vue'
import BaseInput from './BaseInput.vue'
import BaseButton from './BaseButton.vue'
import ModalConfirmacao from './ModalConfirmacao.vue'
import { useAgendamento } from '../composables/useAgendamento'
import { useToast } from '../composables/useToast'
import { useAgendamentoStore } from '../stores/agendamento'
import type { Agendamento } from '../../shared/types/database'

interface Props {
  isOpen: boolean
  agendamento: Agendamento | null
  profissionalId?: number
}

interface FormEdicao {
  titulo: string
  descricao: string
}

const props = withDefaults(defineProps<Props>(), {
  agendamento: null,
  profissionalId: undefined
})

const emit = defineEmits<{
  close: []
  updated: [agendamento: Agendamento]
  cancelled: [agendamentoId: number]
}>()

// Composables
const { atualizarAgendamento, cancelarAgendamento } = useAgendamento()
const toast = useToast()
const agendamentoStore = useAgendamentoStore()

// Estado
const modoEdicao = ref(false)
const isProcessing = ref(false)
const operacaoAtual = ref<'editar' | 'cancelar' | null>(null)
const modalConfirmacaoAberto = ref(false)

// Form de edição
const formEdicao = ref<FormEdicao>({
  titulo: '',
  descricao: ''
})

// Dados originais para cancelar edição
const dadosOriginais = ref<FormEdicao>({
  titulo: '',
  descricao: ''
})

// Validação do form de edição
const isFormEdicaoValid = computed(() => {
  return formEdicao.value.titulo.trim().length > 0
})

// Watchers
watch(() => props.agendamento, (novoAgendamento) => {
  if (novoAgendamento) {
    resetarFormEdicao()
  }
}, { immediate: true })

watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    // Reset quando modal fechar
    modoEdicao.value = false
    resetarFormEdicao()
  }
})

// Funções
function resetarFormEdicao() {
  if (props.agendamento) {
    const dados = {
      titulo: props.agendamento.titulo || '',
      descricao: props.agendamento.descricao || ''
    }
    formEdicao.value = { ...dados }
    dadosOriginais.value = { ...dados }
  }
}

function cancelarEdicao() {
  formEdicao.value = { ...dadosOriginais.value }
  modoEdicao.value = false
}

async function toggleEdicao() {
  if (modoEdicao.value) {
    // Salvar edição
    await salvarEdicao()
  } else {
    // Entrar em modo de edição
    modoEdicao.value = true
  }
}

async function salvarEdicao() {
  if (!props.agendamento || !isFormEdicaoValid.value) return

  isProcessing.value = true
  operacaoAtual.value = 'editar'

  try {
    const resultado = await atualizarAgendamento(props.agendamento.id, {
      titulo: formEdicao.value.titulo.trim(),
      descricao: formEdicao.value.descricao.trim() || undefined
    })

    if (resultado.success) {
      toast.success('Agendamento atualizado com sucesso!')
      
      // Atualizar cache se temos profissionalId
      if (props.profissionalId) {
        await agendamentoStore.fetchAgendamentosByProfissional(props.profissionalId, true)
      }
      
      // Emitir evento de atualização
      emit('updated', resultado.data)
      
      // Sair do modo de edição
      modoEdicao.value = false
      dadosOriginais.value = { ...formEdicao.value }
      
    } else {
      toast.error('Erro ao atualizar agendamento', resultado.error)
    }
  } catch (error: any) {
    console.error('❌ Erro inesperado ao salvar:', error)
    toast.error('Erro inesperado', 'Ocorreu um erro ao salvar as alterações.')
  } finally {
    isProcessing.value = false
    operacaoAtual.value = null
  }
}

function confirmarCancelamento() {
  modalConfirmacaoAberto.value = true
}

async function executarCancelamento() {
  if (!props.agendamento) return

  modalConfirmacaoAberto.value = false
  isProcessing.value = true
  operacaoAtual.value = 'cancelar'

  try {
    const resultado = await cancelarAgendamento(props.agendamento.id)

    if (resultado.success) {
      toast.success('Agendamento cancelado com sucesso!')
      
      // Atualizar cache se temos profissionalId
      if (props.profissionalId) {
        await agendamentoStore.fetchAgendamentosByProfissional(props.profissionalId, true)
      }
      
      // Emitir evento de cancelamento
      emit('cancelled', props.agendamento.id)
      
      // Fechar modal
      emit('close')
      
    } else {
      toast.error('Erro ao cancelar agendamento', resultado.error)
    }
  } catch (error: any) {
    console.error('❌ Erro inesperado ao cancelar:', error)
    toast.error('Erro inesperado', 'Ocorreu um erro ao cancelar o agendamento.')
  } finally {
    isProcessing.value = false
    operacaoAtual.value = null
  }
}

function formatarData(data: string | null): string {
  if (!data) return 'Data não informada'
  
  try {
    const [ano, mes, dia] = data.split('-').map(Number)
    if (ano && mes && dia) {
      const dataObj = new Date(ano, mes - 1, dia)
      return dataObj.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
    return data
  } catch {
    return data
  }
}

function formatarDataHora(dataHora: string | null): string {
  if (!dataHora) return 'Data não informada'
  
  try {
    const data = new Date(dataHora)
    return data.toLocaleString('pt-BR')
  } catch {
    return dataHora
  }
}
</script>
