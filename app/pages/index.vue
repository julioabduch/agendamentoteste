<template>
  <div class="h-full">
    <AgendamentoManage />
  </div>
</template>

<script setup lang="ts">
import AgendamentoManage from '~/components/agendamentos/AgendamentoManage.vue'

// Inicializar o store de agendamento quando a página for montada
const agendamentoStore = useAgendamentoStore()

// O getter diasSemana já é reativo, não precisa de inicialização manual

// Página Agendamentos (Dashboard)
</script>