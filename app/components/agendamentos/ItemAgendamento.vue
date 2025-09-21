<template>
  <div 
    class="absolute inset-0 rounded-md border-l-2 p-1 text-xs cursor-pointer transition-all duration-200 hover:shadow-sm"
    :class="[
      statusClasses,
      { 'hover:scale-105': !agendamento.cancelado }
    ]"
    @click="handleClick"
  >
    <div class="flex flex-col h-full justify-between">
      <!-- Nome do cliente -->
      <div class="font-medium truncate" :class="textColorClass">
        {{ agendamento.cliente_nome }}
      </div>
      
      <!-- Horário -->
      <div class="text-xs opacity-75" :class="textColorClass">
        {{ formatarHorario(agendamento.horario_inicio) }} - {{ formatarHorario(agendamento.horario_fim) }}
      </div>
      
      <!-- Status (se necessário) -->
      <div v-if="agendamento.cancelado || agendamento.confirmado === false" 
           class="text-xs font-medium">
        <span v-if="agendamento.cancelado" class="text-red-600">
          CANCELADO
        </span>
        <span v-else-if="agendamento.confirmado === false" class="text-yellow-600">
          PENDENTE
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AgendamentoDisplay } from '../../../shared/types/agendamento'

interface Props {
  agendamento: AgendamentoDisplay
}

const props = defineProps<Props>()

// Classes de estilo baseadas no status
const statusClasses = computed(() => {
  if (props.agendamento.cancelado) {
    return 'bg-red-100 border-red-300 opacity-75'
  } else if (props.agendamento.confirmado === false) {
    return 'bg-yellow-100 border-yellow-400'
  } else {
    return 'bg-blue-100 border-blue-400 hover:bg-blue-200'
  }
})

// Cor do texto baseada no status
const textColorClass = computed(() => {
  if (props.agendamento.cancelado) {
    return 'text-red-700'
  } else if (props.agendamento.confirmado === false) {
    return 'text-yellow-800'
  } else {
    return 'text-blue-800'
  }
})

// Formatar horário (assumindo formato HH:MM)
function formatarHorario(horario: string): string {
  return horario.substring(0, 5) // Pega apenas HH:MM
}

// Emitir evento quando clicado
const emit = defineEmits<{
  click: [agendamento: AgendamentoDisplay]
}>()

function handleClick() {
  emit('click', props.agendamento)
}
</script>
