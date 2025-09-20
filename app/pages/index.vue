<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
    
    <!-- Teste: Dados do usuário do Pinia -->
    <ClientOnly>
      <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h2 class="text-lg font-semibold text-blue-900 mb-2">Dados do Usuário (Pinia)</h2>
        <div class="space-y-2 text-sm">
          <p><strong>Nome:</strong> {{ userName }}</p>
          <p><strong>Role:</strong> {{ userRole }}</p>
          <p><strong>Admin:</strong> {{ isAdmin ? 'Sim' : 'Não' }}</p>
          <p><strong>Perfil carregado:</strong> {{ isProfileLoaded ? 'Sim' : 'Não' }}</p>
          <p><strong>Loading:</strong> {{ loading ? 'Sim' : 'Não' }}</p>
          <p v-if="error" class="text-red-600"><strong>Erro:</strong> {{ error }}</p>
        </div>
      </div>
      <template #fallback>
        <div class="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p class="text-gray-600">Carregando dados do usuário...</p>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
// Página Dashboard
const { userName, userRole, isAdmin, isProfileLoaded, loading, error } = useUser()
</script>