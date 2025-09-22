<template>
  <div class="h-full flex flex-col overflow-hidden">
    <!-- Header - altura fixa para mobile -->
    <div class="border-2 border-dashed border-blue-500 p-2 sm:p-4 mb-2 sm:mb-4 flex-shrink-0">
      <!-- Primeira linha: Controlador, Profissional e Botão Novo -->
      <div class="flex flex-col gap-2 mb-2">
        <!-- Mobile: Layout empilhado -->
        <div class="block sm:hidden">
          <!-- Avatar e Botão Novo (primeira linha no mobile) -->
          <div class="flex items-center justify-between mb-3">
            <!-- Avatar Upload -->
            <AvatarUpload 
              :avatar-url="null"
              :user-name="userStore.profile?.nome"
              @upload="handleAvatarUpload"
            />
            
            <!-- Botão Novo -->
            <BaseButton 
              @click="novoAgendamento"
              variant="primary"
              size="sm"
              class="flex items-center gap-2"
            >
              <PlusIcon class="w-4 h-4" />
              <span>Novo</span>
            </BaseButton>
          </div>
          
          <!-- Informações do profissional (segunda linha no mobile) -->
          <div class="mb-3">
            <ProfissionalInfo />
          </div>
          
          <!-- Controlador de semana (terceira linha no mobile) -->
          <div>
            <SemanaController />
          </div>
        </div>
        
        <!-- Desktop: Layout horizontal -->
        <div class="hidden sm:flex items-center justify-between gap-3">
          <!-- Lado esquerdo: Controlador de semana -->
          <div class="flex-shrink-0">
            <SemanaController />
          </div>
          
          <!-- Centro: Informações do profissional -->
          <div class="flex-1 flex justify-center">
            <ProfissionalInfo />
          </div>
          
          <!-- Lado direito: Avatar e Botão Novo Agendamento -->
          <div class="flex-shrink-0 flex items-center gap-3">
            <!-- Avatar Upload -->
            <AvatarUpload 
              :avatar-url="null"
              :user-name="userStore.profile?.nome"
              @upload="handleAvatarUpload"
            />
            
            <!-- Botão Novo -->
            <BaseButton 
              @click="novoAgendamento"
              variant="primary"
              size="sm"
              class="flex items-center gap-2"
            >
              <PlusIcon class="w-4 h-4" />
              <span>Novo</span>
            </BaseButton>
          </div>
        </div>
      </div>
      
      <!-- Lista de dias -->
      <div class="w-full">
        <ListaDias :dias="agendamentoStore.diasSemana" />
      </div>
    </div>
    
    <!-- Corpo - ocupa o restante do espaço com scroll -->
    <div class="flex-1 overflow-hidden">
      <div class="h-full p-2 sm:p-4">
        <!-- Estado de carregamento -->
        <div v-if="agendamentoStore.carregandoAgendamentos" class="flex items-center justify-center h-full">
          <div class="text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p class="text-gray-500">Carregando agendamentos...</p>
          </div>
        </div>
        
        <!-- Estado de erro -->
        <div v-else-if="agendamentoStore.erroAgendamentos" class="flex items-center justify-center h-full">
          <div class="text-center">
            <p class="text-red-500 mb-2">{{ agendamentoStore.erroAgendamentos }}</p>
            <BaseButton @click="carregarAgendamentos" variant="outline" size="sm">
              Tentar novamente
            </BaseButton>
          </div>
        </div>
        
        <!-- Grade de agendamentos -->
        <ReguaHorarios 
          v-else 
          :agendamentos="agendamentosExemplo" 
          @agendamento-clicado="handleAgendamentoClicado"
        />
      </div>
    </div>

    <!-- Modal Novo Agendamento -->
    <ModalNovoAgendamento
      :isOpen="modalNovoAberto"
      :profissional="profissionalAtual"
      :clientes="clientes"
      :diasSemana="agendamentoStore.diasSemana"
      :agendamentosExistentes="agendamentoStore.agendamentos"
      @close="fecharModalNovo"
      @submit="handleSubmitNovoAgendamento"
      @openNovoCliente="handleAbrirModalNovoCliente"
    />

    <!-- Modal Agendamento Existente -->
    <ModalAgendamento
      :isOpen="modalAgendamentoAberto"
      :agendamento="agendamentoSelecionado"
      :profissionalId="profissionalAtual?.profissional_id"
      @close="fecharModalAgendamento"
      @updated="handleAgendamentoAtualizado"
      @cancelled="handleAgendamentoCancelado"
    />

    <!-- Modal Novo Cliente -->
    <ModalCliente
      :isOpen="modalNovoClienteAberto"
      @close="fecharModalNovoCliente"
      @cliente-criado="handleClienteCriado"
    />
  </div>
</template>

<script setup lang="ts">
import SemanaController from './SemanaController.vue'
import ProfissionalInfo from './ProfissionalInfo.vue'
import ListaDias from './ListaDias.vue'
import ReguaHorarios from './ReguaHorarios.vue'
import BaseButton from '../BaseButton.vue'
import ModalNovoAgendamento from '../ModalNovoAgendamento.vue'
import ModalAgendamento from '../ModalAgendamento.vue'
import ModalCliente from '../ModalCliente.vue'
import AvatarUpload from '../AvatarUpload.vue'
import { PlusIcon } from '@heroicons/vue/24/outline'
import type { AgendamentoSchedule } from '../../../shared/types/agendamento'
import type { Agendamento } from '../../../shared/types/database'

// Acessar o store de agendamento
const agendamentoStore = useAgendamentoStore()

// Acessar o store do usuário
const userStore = useUserStore()

// Usar o composable de profissionais para ter acesso ao profissional atual
const { profissionais, fetchProfissionais, clientes, fetchClientes } = useProfissionais()

// Estado do modal
const modalNovoAberto = ref(false)
const modalNovoClienteAberto = ref(false)
const modalAgendamentoAberto = ref(false)
const agendamentoSelecionado = ref<Agendamento | null>(null)

// Computed para pegar o primeiro profissional da lista
const profissionalAtual = computed(() => {
  return profissionais.value.length > 0 ? profissionais.value[0] : null
})

// Computed para converter os agendamentos do banco para o formato de exibição
// Agora usa os agendamentos filtrados por semana automaticamente
const agendamentosExemplo = computed<AgendamentoSchedule[]>(() => {
  return agendamentoStore.agendamentosSemanaAtual.map(agendamento => {
    // Calcular o dia da semana baseado na data do agendamento
    // IMPORTANTE: Usar construtor específico para evitar problemas de timezone
    let diaSemana = 0
    if (agendamento.data) {
      // Parse manual da data para evitar problemas de timezone
      const [ano, mes, dia] = agendamento.data.split('-').map(Number)
      if (ano && mes && dia) {
        const dataLocal = new Date(ano, mes - 1, dia) // mes-1 porque Date usa índice 0-11 para meses
        diaSemana = dataLocal.getDay()
      }
    }
    
    return {
      id: String(agendamento.id),
      cliente_nome: agendamento.titulo || 'Cliente não informado', // Temporário até relacionar com tabela de clientes
      horario_inicio: agendamento.hora_inicio ? agendamento.hora_inicio.substring(0, 5) : '00:00',
      horario_fim: agendamento.hora_fim ? agendamento.hora_fim.substring(0, 5) : '00:00',
      dia_semana: diaSemana,
      confirmado: !agendamento.cancelado, // Por enquanto, consideramos confirmado se não estiver cancelado
      cancelado: agendamento.cancelado || false,
      observacoes: agendamento.descricao || undefined
    }
  })
})

// Função para criar novo agendamento
function novoAgendamento() {
  modalNovoAberto.value = true
}

// Funções do modal
function fecharModalNovo() {
  modalNovoAberto.value = false
}

function handleSubmitNovoAgendamento(formData: any) {
  console.log('📝 Dados do novo agendamento:', formData)
  // TODO: Implementar lógica de criação
  fecharModalNovo()
}

// Funções do modal de cliente
function handleAbrirModalNovoCliente() {
  modalNovoClienteAberto.value = true
}

function fecharModalNovoCliente() {
  modalNovoClienteAberto.value = false
}

function handleClienteCriado(novoCliente: any) {
  console.log('👤 Novo cliente criado:', novoCliente)
  // Fechar modal de cliente
  fecharModalNovoCliente()
  // Recarregar lista de clientes
  fetchClientes()
  // TODO: Selecionar automaticamente o novo cliente no modal de agendamento
}

// Funções do modal de agendamento existente
function fecharModalAgendamento() {
  modalAgendamentoAberto.value = false
  agendamentoSelecionado.value = null
}

function handleAgendamentoClicado(agendamentoDisplay: any) {
  // Buscar o agendamento completo do banco baseado no ID
  const agendamentoCompleto = agendamentoStore.agendamentos.find(
    ag => ag.id === Number(agendamentoDisplay.id)
  )
  
  if (agendamentoCompleto) {
    agendamentoSelecionado.value = agendamentoCompleto
    modalAgendamentoAberto.value = true
  }
}

function handleAgendamentoAtualizado(agendamentoAtualizado: Agendamento) {
  console.log('📝 Agendamento atualizado:', agendamentoAtualizado)
  // O cache já foi atualizado pelo modal, apenas log
}

function handleAgendamentoCancelado(agendamentoId: number) {
  console.log('🗑️ Agendamento cancelado:', agendamentoId)
  // O cache já foi atualizado pelo modal, apenas log
}

// Função para buscar agendamentos do profissional atual
async function carregarAgendamentos() {
  if (profissionalAtual.value?.profissional_id) {
    await agendamentoStore.fetchAgendamentosByProfissional(profissionalAtual.value.profissional_id)
  }
}

// Buscar dados quando o componente for montado
onMounted(async () => {
  // Primeiro buscar profissionais
  if (profissionais.value.length === 0) {
    await fetchProfissionais()
  }
  // Buscar clientes para o dropdown
  if (clientes.value.length === 0) {
    await fetchClientes()
  }
  // Depois buscar agendamentos do primeiro profissional
  await carregarAgendamentos()
})

// Função para lidar com upload de avatar
function handleAvatarUpload(file: File) {
  console.log('Avatar uploaded:', file.name, file.size)
  // TODO: Implementar upload real para Supabase Storage
  // Por enquanto apenas log para demonstração
}

// Componente principal para gerenciar agendamentos
</script>
