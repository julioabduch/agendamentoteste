<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Teste - Buscar Clientes</h1>
    
    <div class="mb-4">
      <button 
        @click="buscarClientes" 
        :disabled="loadingClientes"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {{ loadingClientes ? 'Carregando...' : 'Buscar Clientes' }}
      </button>
    </div>

    <div v-if="errorClientes" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      Erro: {{ errorClientes }}
    </div>

    <div v-if="clientes.length > 0" class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPF</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="cliente in clientes" :key="cliente.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ cliente.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ cliente.nome || '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ cliente.cpf || '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ cliente.email || '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ cliente.telefone || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else-if="!loadingClientes && !errorClientes" class="text-gray-500">
      Nenhum cliente encontrado. Clique no botão para buscar.
    </div>
  </div>
</template>

<script setup lang="ts">
// Usar o composable para buscar clientes
const { 
  clientes, 
  loadingClientes, 
  errorClientes, 
  fetchClientes 
} = useProfissionais()

const buscarClientes = async () => {
  await fetchClientes()
}
</script>
