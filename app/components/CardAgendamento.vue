<template>
  <div class="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200">
    <!-- Header do Card -->
    <div class="px-6 py-4 border-b border-gray-200">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <div class="flex items-center space-x-3">
            <!-- Status Badge -->
            <span
              :class="{
                'bg-green-100 text-green-800': !agendamento.cancelado,
                'bg-red-100 text-red-800': agendamento.cancelado
              }"
              class="inline-flex px-2 py-1 text-xs font-medium rounded-full"
            >
              {{ agendamento.cancelado ? 'Cancelado' : 'Ativo' }}
            </span>
            
            <!-- Data -->
            <div class="text-sm text-gray-500">
              {{ formatarData(agendamento.data) }}
            </div>
          </div>
          
          <!-- Título -->
          <h3 class="mt-2 text-lg font-medium text-gray-900">
            {{ agendamento.titulo || 'Sem título' }}
          </h3>
        </div>

        <!-- Horário -->
        <div class="text-right">
          <div class="flex items-center text-gray-500">
            <ClockIcon class="h-4 w-4 mr-1" />
            <span class="text-sm font-medium">
              {{ formatarHorario(agendamento.hora_inicio) }} - 
              {{ formatarHorario(agendamento.hora_fim) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Conteúdo Principal -->
    <div class="px-6 py-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Informações do Cliente -->
        <div>
          <h4 class="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <UserIcon class="h-4 w-4 mr-2 text-gray-400" />
            Cliente
          </h4>
          
          <div class="space-y-2">
            <div>
              <span class="text-sm font-medium text-gray-900">
                {{ agendamento.cliente_nome || 'Cliente não informado' }}
              </span>
            </div>
            
            <div v-if="agendamento.cliente_cpf" class="text-xs text-gray-600">
              CPF: {{ formatarCPF(agendamento.cliente_cpf) }}
            </div>
            
            <div v-if="agendamento.cliente_telefone" class="text-xs text-gray-600 flex items-center">
              <PhoneIcon class="h-3 w-3 mr-1" />
              {{ formatarTelefone(agendamento.cliente_telefone) }}
            </div>
            
            <div v-if="agendamento.cliente_email" class="text-xs text-gray-600 flex items-center">
              <EnvelopeIcon class="h-3 w-3 mr-1" />
              {{ agendamento.cliente_email }}
            </div>
          </div>
        </div>

        <!-- Informações do Profissional -->
        <div>
          <h4 class="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <UserCircleIcon class="h-4 w-4 mr-2 text-gray-400" />
            Profissional
          </h4>
          
          <div class="space-y-2">
            <div>
              <span class="text-sm font-medium text-gray-900">
                {{ agendamento.profissional_nome || 'Profissional não informado' }}
              </span>
            </div>
            
            <div v-if="agendamento.profissional_especialidade" class="text-xs text-gray-600">
              {{ agendamento.profissional_especialidade }}
            </div>
          </div>
        </div>
      </div>

      <!-- Descrição -->
      <div v-if="agendamento.descricao" class="mt-4 pt-4 border-t border-gray-100">
        <h4 class="text-sm font-medium text-gray-900 mb-2">Observações</h4>
        <p class="text-sm text-gray-600">{{ agendamento.descricao }}</p>
      </div>

      <!-- Informações de Cancelamento -->
      <div v-if="agendamento.cancelado && agendamento.cancelado_as" 
           class="mt-4 pt-4 border-t border-red-100 bg-red-50 -mx-6 -mb-4 px-6 py-3 rounded-b-lg">
        <p class="text-xs text-red-600">
          <ExclamationTriangleIcon class="h-3 w-3 inline mr-1" />
          Cancelado em: {{ formatarDataHora(agendamento.cancelado_as) }}
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div class="px-6 py-3 bg-gray-50 rounded-b-lg">
      <div class="flex items-center justify-between">
        <div class="text-xs text-gray-500">
          ID: #{{ agendamento.agendamento_id }}
        </div>
        
        <div class="text-xs text-gray-500">
          Criado em: {{ formatarDataHora(agendamento.agendamento_criado_em) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AgendamentoRelatorio } from '../../shared/types/database'
import {
  ClockIcon,
  UserIcon,
  UserCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

interface Props {
  agendamento: AgendamentoRelatorio
}

defineProps<Props>()

// Funções de formatação
function formatarData(data: string | null): string {
  if (!data) return 'Data não informada'
  
  try {
    const [ano, mes, dia] = data.split('-').map(Number)
    if (ano && mes && dia) {
      const dataObj = new Date(ano, mes - 1, dia)
      return dataObj.toLocaleDateString('pt-BR', {
        weekday: 'short',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    }
    return data
  } catch {
    return data
  }
}

function formatarHorario(horario: string | null): string {
  if (!horario) return '--:--'
  return horario.substring(0, 5) // Pega apenas HH:MM
}

function formatarDataHora(dataHora: string | null): string {
  if (!dataHora) return 'Data não informada'
  
  try {
    const data = new Date(dataHora)
    return data.toLocaleString('pt-BR')
  } catch {
    return dataHora
  }
}

function formatarCPF(cpf: string): string {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

function formatarTelefone(telefone: string): string {
  const apenasNumeros = telefone.replace(/\D/g, '')
  
  if (apenasNumeros.length === 11) {
    return apenasNumeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  } else if (apenasNumeros.length === 10) {
    return apenasNumeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  
  return telefone
}
</script>
