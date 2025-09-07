<template>
  <div class="max-w-md mx-auto mt-10 space-y-6 p-6 bg-background rounded shadow">
    <h1 class="text-2xl font-bold text-primary mb-4">Testando Componentes Base</h1>
    <BaseInput v-model="inputValue" placeholder="Digite algo..." />
    <BaseButton @click="handleClick">Clique aqui</BaseButton>
    <p class="mt-4 text-secondary">Valor do input: <span class="font-mono">{{ inputValue }}</span></p>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '../components/BaseButton.vue'
import BaseInput from '../components/BaseInput.vue'
import { ref } from 'vue'

const inputValue = ref('')
function handleClick() {
  alert('Botão clicado!')
}
</script>
