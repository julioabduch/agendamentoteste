<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-2 sm:p-3 min-w-0 w-full sm:min-w-[240px]">
    <!-- Período da semana e navegação em linha única -->
    <div class="flex items-center justify-between">
      <!-- Botão Voltar Semana -->
      <button
        @click="voltarSemana"
        class="group relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 transition-all duration-200 hover:shadow-sm hover:scale-105 active:scale-95 flex-shrink-0"
        title="Semana anterior"
      >
        <ChevronLeftIcon class="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 group-hover:text-blue-700" />
      </button>
      
      <!-- Informações centrais -->
      <div class="text-center flex-1 mx-2 sm:mx-3 min-w-0">
        <h3 class="text-xs sm:text-sm font-semibold text-gray-800 leading-tight truncate">
          {{ periodoSemana }}
        </h3>
        <p class="text-xs text-gray-500 mt-0.5 hidden sm:block">
          {{ mesAnoAtual }}
        </p>
      </div>
      
      <!-- Botão Avançar Semana -->
      <button
        @click="avancarSemana"
        class="group relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 transition-all duration-200 hover:shadow-sm hover:scale-105 active:scale-95 flex-shrink-0"
        title="Próxima semana"
      >
        <ChevronRightIcon class="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 group-hover:text-blue-700" />
      </button>
    </div>
    
    <!-- Indicador visual compacto da semana -->
    <div class="mt-2 flex justify-center hidden sm:flex">
      <div class="flex space-x-0.5">
        <div 
          v-for="(dia, index) in agendamentoStore.diasSemana" 
          :key="index"
          class="w-1 h-1 rounded-full transition-colors duration-200"
          :class="isHoje(dia.data) ? 'bg-blue-500' : 'bg-gray-300'"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

// Acessar o store de agendamento
const agendamentoStore = useAgendamentoStore()

// Usar o composable de profissionais para ter acesso ao profissional atual
const { profissionais } = useProfissionais()

// Computed para pegar o primeiro profissional da lista
const profissionalAtual = computed(() => {
  return profissionais.value.length > 0 ? profissionais.value[0] : null
})

// Computed para mostrar o período da semana
const periodoSemana = computed(() => {
  const diasSemana = agendamentoStore.diasSemana
  
  if (diasSemana.length < 7) {
    return ''
  }
  
  // Primeiro dia (domingo) e último dia (sábado)
  const primeiroDia = diasSemana[0]!
  const ultimoDia = diasSemana[6]!
  
  // Formatar as datas
  const dataInicio = primeiroDia.data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit'
  })
  
  const dataFim = ultimoDia.data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit'
  })
  
  return `${dataInicio} a ${dataFim}`
})

// Computed para mostrar o mês e ano
const mesAnoAtual = computed(() => {
  return agendamentoStore.mesAnoAtual
})

// Função para verificar se é o dia atual
function isHoje(data: Date): boolean {
  const hoje = new Date()
  return (
    data.getDate() === hoje.getDate() &&
    data.getMonth() === hoje.getMonth() &&
    data.getFullYear() === hoje.getFullYear()
  )
}

// Funções para navegação com busca automática de agendamentos
async function voltarSemana() {
  const profissionalId = profissionalAtual.value?.profissional_id
  await agendamentoStore.voltarSemana(profissionalId)
}

async function avancarSemana() {
  const profissionalId = profissionalAtual.value?.profissional_id
  await agendamentoStore.avancarSemana(profissionalId)
}
</script>
