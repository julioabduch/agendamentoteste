<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-6">
          <h1 class="text-3xl font-bold text-gray-900">Relatório de Agendamentos</h1>
          <p class="mt-2 text-sm text-gray-600">
            Visualize e gerencie todos os agendamentos do sistema
          </p>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ListaAgendamentos />
    </div>
  </div>
</template>

<script setup lang="ts">
import ListaAgendamentos from '../components/ListaAgendamentos.vue'

// Página de Relatório de Agendamentos
</script>
