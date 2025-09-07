<template>
  <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold text-gray-800 mb-3">Bem-vindo de volta</h2>
      <p class="text-gray-500 text-lg">Entre com suas credenciais para acessar sua conta</p>
    </div>

    <form class="space-y-6" @submit.prevent>
      <div class="space-y-5">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-3">
            E-mail *
          </label>
          <BaseInput 
            v-model="email"
            type="email"
            placeholder="seu@email.com"
            :icon="EnvelopeIcon"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-3">
            Senha *
          </label>
          <BaseInput 
            v-model="password"
            type="password"
            placeholder="Digite sua senha"
            :icon="LockClosedIcon"
          />
        </div>
      </div>

      <div class="pt-2">
        <BaseButton>
          Entrar
        </BaseButton>
      </div>

      <div class="text-center pt-4">
        <a href="#" class="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
          Esqueceu sua senha?
        </a>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/vue/24/outline'
import BaseInput from './BaseInput.vue'
import BaseButton from './BaseButton.vue'

const email = ref('')
const password = ref('')
</script>
