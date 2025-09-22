<template>
  <div class="flex flex-col items-center justify-center p-1 sm:p-2 bg-white rounded border shadow-sm flex-1 min-h-[50px] sm:min-h-[60px]">
    <span class="text-sm sm:text-lg font-bold text-gray-800">{{ numeroDay }}</span>
    <span class="text-xs text-gray-600 text-center leading-tight hidden sm:inline">{{ nomeCompleto }}</span>
    <span class="text-xs text-gray-600 text-center leading-tight sm:hidden">{{ nomeAbreviado }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  data: Date
}

const props = defineProps<Props>()

// Computed para pegar o número do dia
const numeroDay = computed(() => {
  return props.data.getDate()
})

// Computed para pegar o nome do dia por extenso
const nomeCompleto = computed(() => {
  const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
  return diasSemana[props.data.getDay()]
})

// Computed para pegar o nome abreviado do dia
const nomeAbreviado = computed(() => {
  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  return diasSemana[props.data.getDay()]
})
</script>
