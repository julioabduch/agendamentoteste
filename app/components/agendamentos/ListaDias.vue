<template>
  <div class="border-2 border-red-500 p-2 mt-2 rounded bg-gray-50">
    <div class="grid grid-cols-8 w-full">
      <!-- Célula vazia para alinhar com a coluna dos horários -->
      <div class="p-3 border-r border-gray-200"></div>
      
      <!-- Dias da semana -->
      <DiaItem 
        v-for="(dia, index) in dias" 
        :key="index"
        :data="dia.data"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import DiaItem from './DiaItem.vue'

interface DiaSemana {
  data: Date
  dia: number
  nome: string
  nomeCompleto: string
}

interface Props {
  dias: DiaSemana[]
}

const props = defineProps<Props>()
</script>
