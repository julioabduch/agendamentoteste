<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <!-- Header da tabela -->
    <div class="px-6 py-4 border-b border-gray-200">
      <h2 class="text-lg font-semibold text-gray-900">Lista de Clientes</h2>
    </div>

    <!-- Loading state inicial ou durante fetch -->
    <div v-if="!isMounted || loadingClientes" class="p-6 text-center">
      <div class="inline-flex items-center space-x-2">
        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
        <span class="text-gray-600">Carregando clientes...</span>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="errorClientes" class="p-6">
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
          </svg>
          <span class="text-red-800 font-medium">Erro ao carregar clientes</span>
        </div>
        <p class="text-red-700 text-sm mt-2">{{ errorClientes }}</p>
      </div>
    </div>

    <!-- Tabela -->
    <div v-else-if="clientes.length > 0" class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nome
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              CPF
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Telefone
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr 
            v-for="cliente in clientes" 
            :key="cliente.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ cliente.id }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ cliente.nome || 'Sem nome' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ cliente.cpf || '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ cliente.email || '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ cliente.telefone || '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-end space-x-2">
                <!-- Botão Editar -->
                <button
                  type="button"
                  @click="editarCliente(cliente.id)"
                  :disabled="!userStore.isAdmin"
                  :class="[
                    'inline-flex items-center p-2 rounded-lg transition-colors',
                    userStore.isAdmin 
                      ? 'text-blue-600 hover:text-blue-800 hover:bg-blue-50' 
                      : 'text-gray-300 cursor-not-allowed bg-gray-50'
                  ]"
                  :title="userStore.isAdmin ? 'Editar cliente' : 'Apenas administradores podem editar'"
                >
                  <PencilIcon class="w-4 h-4" />
                </button>
                
                <!-- Botão Deletar -->
                <button
                  type="button"
                  @click="deletarCliente(cliente.id)"
                  :disabled="!userStore.isAdmin"
                  :class="[
                    'inline-flex items-center p-2 rounded-lg transition-colors',
                    userStore.isAdmin 
                      ? 'text-red-600 hover:text-red-800 hover:bg-red-50' 
                      : 'text-gray-300 cursor-not-allowed bg-gray-50'
                  ]"
                  :title="userStore.isAdmin ? 'Deletar cliente' : 'Apenas administradores podem deletar'"
                >
                  <TrashIcon class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty state -->
    <div v-else class="p-6 text-center">
      <div class="text-gray-500">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
        <p class="mt-2 text-sm text-gray-600">Nenhum cliente encontrado</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'

interface Emits {
  (e: 'editar', id: number): void
  (e: 'deletar', id: number): void
}

const emit = defineEmits<Emits>()

// Usar o composable para buscar clientes
const { clientes, loadingClientes, errorClientes, fetchClientes } = useProfissionais()

// Usar o store do usuário para verificar permissões
const userStore = useUserStore()

// Estado para controlar se já foi montado no cliente
const isMounted = ref(false)

// Buscar clientes quando o componente for montado
onMounted(async () => {
  isMounted.value = true
  await fetchClientes()
})

// Funções para ações CRUD
const editarCliente = (id: number) => {
  if (!userStore.isAdmin) {
    console.warn('Apenas administradores podem editar clientes')
    return
  }
  
  emit('editar', id)
}

const deletarCliente = (id: number) => {
  if (!userStore.isAdmin) {
    console.warn('Apenas administradores podem deletar clientes')
    return
  }
  
  emit('deletar', id)
}
</script>
