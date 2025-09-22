<template>
  <div class="flex flex-col h-full bg-white rounded-lg border border-gray-200 overflow-hidden">
    <!-- Grade de horários - apenas horários, sem cabeçalho de dias -->
    <div class="flex-1 overflow-auto">
      <div class="min-w-[600px] sm:min-w-0">
        <div 
          v-for="hora in horarios" 
          :key="hora"
          class="grid grid-cols-8 border-b border-gray-100 hover:bg-gray-25 transition-colors duration-150"
        >
          <!-- Coluna do horário -->
          <div class="p-2 sm:p-3 border-r border-gray-200 bg-gray-50 flex items-center min-w-[60px] flex-shrink-0">
            <span class="text-xs sm:text-sm font-medium text-gray-700">
              {{ String(hora).padStart(2, '0') }}:00
            </span>
          </div>
          
          <!-- Células dos dias - alinhadas com os dias do header -->
          <div 
            v-for="dayIndex in 7" 
            :key="dayIndex"
            class="p-0.5 sm:p-1 border-r border-gray-100 last:border-r-0 min-h-[40px] sm:min-h-[50px] relative cursor-pointer hover:bg-blue-50 transition-colors duration-150 min-w-[70px] sm:min-w-0 flex-shrink-0"
            @click="handleCellClick(hora, dayIndex - 1)"
          >
            <div class="relative h-full">
              <!-- Exemplo de agendamento (pode ser substituído por dados reais) -->
              <ItemAgendamento
                v-if="getAgendamentoPorHoraDia(hora, dayIndex - 1)"
                :agendamento="getAgendamentoPorHoraDia(hora, dayIndex - 1)!"
                @click="handleAgendamentoClick"
              />
              
              <!-- Placeholder quando não há agendamento -->
              <div 
                v-else
                class="w-full h-full flex items-center justify-center text-xs text-gray-300 hover:text-gray-400 transition-colors"
              >
                +
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ItemAgendamento from './ItemAgendamento.vue'
import type { AgendamentoSchedule, AgendamentoDisplay } from '../../../shared/types/agendamento'

// Props (agendamentos virão do componente pai)
interface Props {
  agendamentos?: AgendamentoSchedule[]
}

const props = withDefaults(defineProps<Props>(), {
  agendamentos: () => []
})

// Emits
const emit = defineEmits<{
  'agendamento-clicado': [agendamento: AgendamentoDisplay]
}>()

// Gerar array de horários de 8h às 22h
const horarios = computed(() => {
  const horas = []
  for (let i = 8; i <= 22; i++) {
    horas.push(i)
  }
  return horas
})

// Função para buscar agendamento por hora e dia
function getAgendamentoPorHoraDia(hora: number, dayIndex: number): AgendamentoDisplay | null {
  const agendamento = props.agendamentos.find(agendamento => {
    const horaAgendamento = parseInt(agendamento.horario_inicio?.split(':')[0] || '0')
    return horaAgendamento === hora && agendamento.dia_semana === dayIndex
  })
  
  // Converter para o tipo de exibição (sem dia_semana)
  if (agendamento) {
    return {
      id: agendamento.id,
      cliente_nome: agendamento.cliente_nome,
      horario_inicio: agendamento.horario_inicio,
      horario_fim: agendamento.horario_fim,
      confirmado: agendamento.confirmado,
      cancelado: agendamento.cancelado,
      observacoes: agendamento.observacoes
    }
  }
  
  return null
}

// Função para lidar com clique na célula
function handleCellClick(hora: number, dayIndex: number) {
  console.log(`Clicou no horário ${hora}:00 do dia ${dayIndex + 1} da semana`)
  // TODO: Implementar modal de agendamento
}

// Função para lidar com clique no agendamento
function handleAgendamentoClick(agendamento: AgendamentoDisplay) {
  console.log('🖱️ Clicou no agendamento:', agendamento)
  emit('agendamento-clicado', agendamento)
}
</script>
