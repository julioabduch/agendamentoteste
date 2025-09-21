<template>
  <div class="space-y-6">
    <!-- Filtros -->
    <div class="bg-white rounded-lg shadow-sm border p-6">
      <h2 class="text-lg font-medium text-gray-900 mb-4">Filtros</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Período -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Data Início
          </label>
          <input
            v-model="filtros.dataInicio"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            @change="aplicarFiltros"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Data Fim
          </label>
          <input
            v-model="filtros.dataFim"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            @change="aplicarFiltros"
          />
        </div>

        <!-- Status -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            v-model="filtros.incluirCancelados"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            @change="aplicarFiltros"
          >
            <option :value="false">Apenas Ativos</option>
            <option :value="true">Todos (incluir cancelados)</option>
          </select>
        </div>

        <!-- Ações -->
        <div class="flex items-end">
          <BaseButton
            @click="limparFiltros"
            variant="outline"
            class="w-full"
          >
            Limpar Filtros
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Estatísticas -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6" v-if="!carregando && agendamentos.length > 0">
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <CalendarIcon class="h-8 w-8 text-blue-500" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total</p>
            <p class="text-2xl font-semibold text-gray-900">{{ agendamentos.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <CheckCircleIcon class="h-8 w-8 text-green-500" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Ativos</p>
            <p class="text-2xl font-semibold text-gray-900">{{ agendamentosAtivos }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <XCircleIcon class="h-8 w-8 text-red-500" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Cancelados</p>
            <p class="text-2xl font-semibold text-gray-900">{{ agendamentosCancelados }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <UserGroupIcon class="h-8 w-8 text-purple-500" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Clientes Únicos</p>
            <p class="text-2xl font-semibold text-gray-900">{{ clientesUnicos }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="carregando" class="bg-white rounded-lg shadow-sm border p-12">
      <div class="flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-gray-600">Carregando agendamentos...</span>
      </div>
    </div>

    <!-- Erro -->
    <div v-else-if="erro" class="bg-white rounded-lg shadow-sm border p-8">
      <div class="text-center">
        <ExclamationTriangleIcon class="mx-auto h-12 w-12 text-red-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">Erro ao carregar dados</h3>
        <p class="mt-1 text-sm text-gray-500">{{ erro }}</p>
        <div class="mt-6">
          <BaseButton @click="buscarDados" variant="primary">
            Tentar Novamente
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Lista de Agendamentos -->
    <div v-else-if="agendamentos.length > 0" class="space-y-4">
      <h2 class="text-lg font-medium text-gray-900">
        Agendamentos Encontrados ({{ agendamentos.length }})
      </h2>
      
      <div class="grid gap-4">
        <CardAgendamento
          v-for="agendamento in agendamentos"
          :key="agendamento.agendamento_id"
          :agendamento="agendamento"
        />
      </div>
    </div>

    <!-- Estado Vazio -->
    <div v-else class="bg-white rounded-lg shadow-sm border p-12">
      <div class="text-center">
        <CalendarIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhum agendamento encontrado</h3>
        <p class="mt-1 text-sm text-gray-500">
          Tente ajustar os filtros ou criar um novo agendamento.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from './BaseButton.vue'
import CardAgendamento from './CardAgendamento.vue'
import { useAgendamento } from '../composables/useAgendamento'
import { useToast } from '../composables/useToast'
import type { AgendamentoRelatorio } from '../../shared/types/database'
import {
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserGroupIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

// Composables
const { buscarRelatorioAgendamentos } = useAgendamento()
const toast = useToast()

// Estado
const agendamentos = ref<AgendamentoRelatorio[]>([])
const carregando = ref(false)
const erro = ref<string | null>(null)

// Filtros
const filtros = ref({
  dataInicio: '',
  dataFim: '',
  incluirCancelados: false
})

// Computed para estatísticas
const agendamentosAtivos = computed(() => 
  agendamentos.value.filter(a => !a.cancelado).length
)

const agendamentosCancelados = computed(() => 
  agendamentos.value.filter(a => a.cancelado).length
)

const clientesUnicos = computed(() => {
  const clientesSet = new Set(
    agendamentos.value
      .filter(a => a.cliente_id)
      .map(a => a.cliente_id)
  )
  return clientesSet.size
})

// Funções
async function buscarDados() {
  carregando.value = true
  erro.value = null

  try {
    const filtrosParaBusca = {
      ...(filtros.value.dataInicio && { dataInicio: filtros.value.dataInicio }),
      ...(filtros.value.dataFim && { dataFim: filtros.value.dataFim }),
      incluirCancelados: filtros.value.incluirCancelados
    }

    const resultado = await buscarRelatorioAgendamentos(filtrosParaBusca)

    if (resultado.success) {
      agendamentos.value = resultado.data || []
    } else {
      erro.value = resultado.error
      toast.error('Erro ao carregar agendamentos', resultado.error)
    }
  } catch (err: any) {
    erro.value = err.message || 'Erro inesperado'
    toast.error('Erro inesperado', 'Ocorreu um erro ao carregar os agendamentos.')
  } finally {
    carregando.value = false
  }
}

function aplicarFiltros() {
  buscarDados()
}

function limparFiltros() {
  filtros.value = {
    dataInicio: '',
    dataFim: '',
    incluirCancelados: false
  }
  buscarDados()
}

// Buscar dados ao montar o componente
onMounted(() => {
  buscarDados()
})
</script>
