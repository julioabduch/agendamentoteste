<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
      <div v-if="isLoading" class="space-y-4">
        <div class="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
        <h2 class="text-2xl font-bold text-gray-800">Confirmando login...</h2>
        <p class="text-gray-600">Aguarde enquanto verificamos suas credenciais.</p>
      </div>

      <div v-else-if="error" class="space-y-4">
        <div class="text-red-500">
          <svg class="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-800">Erro na confirmação</h2>
        <p class="text-gray-600">{{ error }}</p>
        <BaseButton @click="redirectToLogin" class="mt-4">
          Voltar ao Login
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ 
  layout: 'auth' as any
})
const user = useSupabaseUser()
const redirectInfo = useSupabaseCookieRedirect()

const isLoading = ref(true)
const error = ref<string | null>(null)

// Observar mudanças no usuário
watch(user, () => {
  if (user.value) {
    // Usuário autenticado, redirecionar
    const path = redirectInfo.pluck() // Pega e limpa o cookie de redirecionamento
    navigateTo(path || '/')
  } else {
    // Sem usuário após um tempo, mostrar erro
    setTimeout(() => {
      if (!user.value) {
        isLoading.value = false
        error.value = 'Não foi possível confirmar sua autenticação. Tente fazer login novamente.'
      }
    }, 5000) // 5 segundos de timeout
  }
}, { immediate: true })

const redirectToLogin = () => {
  navigateTo('/login')
}
</script>
