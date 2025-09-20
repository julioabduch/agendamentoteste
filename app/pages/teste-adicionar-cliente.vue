<template>
  <div class="p-6 max-w-md mx-auto">
    <h1 class="text-2xl font-bold mb-6">Teste - Adicionar Cliente</h1>
    
    <form @submit.prevent="adicionarNovoCliente" class="space-y-4">
      <!-- Campo CPF (obrigatório) -->
      <div>
        <label for="cpf" class="block text-sm font-medium text-gray-700 mb-1">
          CPF <span class="text-red-500">*</span>
        </label>
        <input
          id="cpf"
          v-model="form.cpf"
          type="text"
          required
          placeholder="000.000.000-00"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Campo Nome (obrigatório) -->
      <div>
        <label for="nome" class="block text-sm font-medium text-gray-700 mb-1">
          Nome <span class="text-red-500">*</span>
        </label>
        <input
          id="nome"
          v-model="form.nome"
          type="text"
          required
          placeholder="Nome completo"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Campo Email (opcional) -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          placeholder="email@exemplo.com"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Campo Telefone (opcional) -->
      <div>
        <label for="telefone" class="block text-sm font-medium text-gray-700 mb-1">
          Telefone
        </label>
        <input
          id="telefone"
          v-model="form.telefone"
          type="tel"
          placeholder="(00) 00000-0000"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Campo Endereço (opcional) -->
      <div>
        <label for="endereco" class="block text-sm font-medium text-gray-700 mb-1">
          Endereço
        </label>
        <textarea
          id="endereco"
          v-model="form.endereco"
          rows="3"
          placeholder="Endereço completo"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>

      <!-- Botão Submit -->
      <button
        type="submit"
        :disabled="loading || !form.cpf || !form.nome"
        class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ loading ? 'Adicionando...' : 'Adicionar Cliente' }}
      </button>
    </form>

    <!-- Mensagem de sucesso -->
    <div v-if="mensagem" class="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
      {{ mensagem }}
    </div>

    <!-- Mensagem de erro -->
    <div v-if="erro" class="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
      {{ erro }}
    </div>
  </div>
</template>

<script setup lang="ts">
// Usar o composable para adicionar cliente
const { adicionarCliente } = useProfissionais()

// Estados do formulário
const form = reactive({
  cpf: '',
  nome: '',
  email: '',
  telefone: '',
  endereco: ''
})

const loading = ref(false)
const mensagem = ref('')
const erro = ref('')

// Função para adicionar novo cliente
const adicionarNovoCliente = async () => {
  try {
    loading.value = true
    mensagem.value = ''
    erro.value = ''

    // Preparar dados (apenas campos não vazios)
    const dadosCliente: any = {
      cpf: form.cpf,
      nome: form.nome
    }

    if (form.email) dadosCliente.email = form.email
    if (form.telefone) dadosCliente.telefone = form.telefone
    if (form.endereco) dadosCliente.endereco = form.endereco

    // Chamar a função do composable
    const resultado = await adicionarCliente(dadosCliente)
    
    if (resultado.success) {
      mensagem.value = `Cliente "${form.nome}" adicionado com sucesso!`
      
      // Limpar formulário
      form.cpf = ''
      form.nome = ''
      form.email = ''
      form.telefone = ''
      form.endereco = ''
    }

  } catch (error: any) {
    erro.value = error.message || 'Erro ao adicionar cliente'
    console.error('Erro:', error)
    
  } finally {
    loading.value = false
  }
}
</script>
