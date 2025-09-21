<template>
  <div class="text-center">
    <h2 class="text-base font-semibold text-gray-800 leading-tight">
      {{ profissionalAtual?.nome_profissional || 'Selecionar Profissional' }}
    </h2>
    <p class="text-sm text-gray-500 mt-1">
      {{ profissionalAtual?.especialidade || 'Nenhuma especialidade' }}
    </p>
  </div>
</template>

<script setup lang="ts">
// Usar o composable de profissionais
const { profissionais, fetchProfissionais } = useProfissionais()

// Computed para pegar o primeiro profissional da lista
const profissionalAtual = computed(() => {
  return profissionais.value.length > 0 ? profissionais.value[0] : null
})

// Buscar profissionais quando o componente for montado
onMounted(async () => {
  if (profissionais.value.length === 0) {
    await fetchProfissionais()
  }
})
</script>
