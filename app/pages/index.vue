<template>
  <div class="h-full flex flex-col">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900">Agendamentos</h1>
      </div>
    </div>
    
    <!-- Conteúdo -->
    <div class="flex-1 p-6">
      <AgendamentoManage />
    </div>
  </div>
</template>

<script setup lang="ts">
import AgendamentoManage from '~/components/agendamentos/AgendamentoManage.vue'

// Inicializar o store de agendamento quando a página for montada
const agendamentoStore = useAgendamentoStore()

// O getter diasSemana já é reativo, não precisa de inicialização manual

// Página Agendamentos (Dashboard)
</script>