<template>
  <BaseModal
    :isOpen="isOpen"
    :title="'Novo Agendamento'"
    @close="$emit('close')"
  >
    <template #content>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Cliente -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="block text-sm font-medium text-gray-700">
              Cliente *
            </label>
            <BaseButton
              variant="outline"
              size="sm"
              @click="abrirModalNovoCliente"
              class="text-xs"
            >
              <PlusIcon class="w-3 h-3 mr-1" />
              Novo Cliente
            </BaseButton>
          </div>
          <ClienteSearchableSelect
            v-model="form.clienteId"
            :clientes="clientes"
            placeholder="Pesquisar cliente por nome, CPF ou telefone..."
            :required="true"
          />
        </div>

        <!-- Profissional (Read-only) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Profissional
          </label>
          <BaseInput
            :modelValue="profissionalInfo"
            :disabled="true"
            placeholder="Nenhum profissional selecionado"
            class="bg-gray-50"
          />
        </div>

        <!-- Título -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Título *
          </label>
          <BaseInput
            v-model="form.titulo"
            placeholder="Ex: Consulta de rotina"
            required
          />
        </div>

        <!-- Descrição -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Descrição
          </label>
          <textarea
            v-model="form.descricao"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            placeholder="Observações adicionais (opcional)"
          ></textarea>
        </div>

        <!-- Data -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Data *
          </label>
          <select
            v-model="form.data"
            @change="onDataChange"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
          >
            <option value="">Selecione uma data</option>
            <option
              v-for="dia in diasSemana"
              :key="dia.data.toISOString()"
              :value="formatarDataISO(dia.data)"
            >
              {{ dia.nomeCompleto }}, {{ dia.dia }}/{{ dia.data.getMonth() + 1 }}
              {{ getInfoDisponibilidade(formatarDataISO(dia.data)) }}
            </option>
          </select>
          <p v-if="form.data && horariosOcupadosInfo.length > 0" class="mt-1 text-xs text-amber-600">
            ⚠️ {{ horariosOcupadosInfo.length }} horário(s) já ocupado(s) nesta data
          </p>
        </div>

        <!-- Horários (habilitados apenas quando data estiver selecionada) -->
        <div class="grid grid-cols-2 gap-4">
          <!-- Hora Início -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Hora Início *
            </label>
            <select
              v-model="form.horaInicio"
              :disabled="!form.data"
              @change="onHoraInicioChange"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:text-gray-500"
              required
            >
              <option value="">Selecione</option>
              <option
                v-for="hora in horariosDisponiveis"
                :key="hora.value"
                :value="hora.value"
              >
                {{ hora.label }}
              </option>
            </select>
          </div>

          <!-- Hora Fim -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Hora Fim *
            </label>
            <select
              v-model="form.horaFim"
              :disabled="!form.horaInicio"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:text-gray-500"
              required
            >
              <option value="">Selecione</option>
              <option
                v-for="hora in horariosFimDisponiveis"
                :key="hora.value"
                :value="hora.value"
              >
                {{ hora.label }}
              </option>
            </select>
          </div>
        </div>
      </form>
    </template>

    <template #footer>
      <BaseButton
        variant="outline"
        @click="$emit('close')"
      >
        Cancelar
      </BaseButton>
      <BaseButton
        variant="primary"
        :disabled="!isFormValid || isSubmitting"
        @click="handleSubmit"
      >
        <span v-if="isSubmitting">Criando...</span>
        <span v-else>Criar Agendamento</span>
      </BaseButton>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from './BaseModal.vue'
import BaseInput from './BaseInput.vue'
import BaseButton from './BaseButton.vue'
import ClienteSearchableSelect from './ClienteSearchableSelect.vue'
import { PlusIcon } from '@heroicons/vue/24/outline'
import { useAgendamento } from '../composables/useAgendamento'
import { useToast } from '../composables/useToast'
import { useAgendamentoStore } from '../stores/agendamento'
import type { Profissional, Cliente, Agendamento } from '../../shared/types/database'

interface DiaSemana {
  data: Date
  dia: number
  nome: string
  nomeCompleto: string
}

interface Props {
  isOpen: boolean
  profissional?: Profissional | null
  clientes: Cliente[]
  diasSemana: DiaSemana[]
  agendamentosExistentes: Agendamento[]
}

interface FormData {
  clienteId: number | string
  titulo: string
  descricao: string
  data: string
  horaInicio: string
  horaFim: string
}

const props = withDefaults(defineProps<Props>(), {
  profissional: null,
  clientes: () => [],
  diasSemana: () => [],
  agendamentosExistentes: () => []
})

const emit = defineEmits<{
  close: []
  submit: [formData: FormData & { profissionalId: number }]
  openNovoCliente: []
}>()

// Composables
const { criarAgendamento } = useAgendamento()
const toast = useToast()
const agendamentoStore = useAgendamentoStore()

// Estado do formulário
const form = ref<FormData>({
  clienteId: '',
  titulo: '',
  descricao: '',
  data: '',
  horaInicio: '',
  horaFim: ''
})

// Estado de loading
const isSubmitting = ref(false)

// Computed para informações do profissional
const profissionalInfo = computed(() => {
  if (!props.profissional) return 'Nenhum profissional selecionado'
  return `${props.profissional.nome_profissional} - ${props.profissional.especialidade}`
})

// Gerar horários disponíveis (8h às 22h) filtrados por ocupação
const horariosDisponiveis = computed(() => {
  const horarios = []
  
  // Gerar todos os horários possíveis
  for (let i = 8; i <= 22; i++) {
    for (let j = 0; j < 60; j += 30) {
      const hora = String(i).padStart(2, '0')
      const minuto = String(j).padStart(2, '0')
      const valor = `${hora}:${minuto}`
      horarios.push({
        value: valor,
        label: valor
      })
    }
  }
  
    // Se não há data selecionada, retornar todos
  if (!form.value.data) {
    return horarios
  }
  
  // Filtrar horários ocupados na data selecionada
  const agendamentosNaData = props.agendamentosExistentes.filter(agendamento => 
    agendamento.data === form.value.data &&
    agendamento.profissional_id === props.profissional?.profissional_id
  )
  
  return horarios.filter(horario => {
    return !isHorarioOcupado(horario.value, agendamentosNaData)
  })
})

// Horários de fim baseados na hora de início e disponibilidade
const horariosFimDisponiveis = computed(() => {
  if (!form.value.horaInicio) return []
  
  const [horaInicio, minutoInicio] = form.value.horaInicio.split(':').map(Number)
  const inicioEmMinutos = (horaInicio || 0) * 60 + (minutoInicio || 0)
  
  // Filtrar horários ocupados se há data selecionada
  let horariosBase = horariosDisponiveis.value
  if (form.value.data) {
    const agendamentosNaData = props.agendamentosExistentes.filter(agendamento => 
      agendamento.data === form.value.data &&
      agendamento.profissional_id === props.profissional?.profissional_id
    )
    
    horariosBase = horariosBase.filter(horario => {
      return !isHorarioOcupado(horario.value, agendamentosNaData)
    })
  }
  
  // Retornar apenas horários posteriores ao início
  return horariosBase.filter(horario => {
    const [hora, minuto] = horario.value.split(':').map(Number)
    const horarioEmMinutos = (hora || 0) * 60 + (minuto || 0)
    return horarioEmMinutos > inicioEmMinutos
  })
})

// Validação do formulário
const isFormValid = computed(() => {
  return !!(
    form.value.clienteId &&
    form.value.titulo &&
    form.value.data &&
    form.value.horaInicio &&
    form.value.horaFim &&
    props.profissional
  )
})

// Informações dos horários ocupados na data atual
const horariosOcupadosInfo = computed(() => {
  if (!form.value.data) return []
  
  const agendamentosNaData = props.agendamentosExistentes.filter(agendamento => 
    agendamento.data === form.value.data &&
    agendamento.profissional_id === props.profissional?.profissional_id
  )
  
  return agendamentosNaData.map(agendamento => ({
    inicio: agendamento.hora_inicio,
    fim: agendamento.hora_fim,
    titulo: agendamento.titulo
  }))
})

// Funções
function formatarDataISO(data: Date): string {
  return data.toISOString().split('T')[0]!
}

function getInfoDisponibilidade(data: string): string {
  if (!props.profissional) return ''
  
  const agendamentosNaData = props.agendamentosExistentes.filter(agendamento => 
    agendamento.data === data &&
    agendamento.profissional_id === props.profissional?.profissional_id
  )
  
  if (agendamentosNaData.length === 0) return ''
  return `(${agendamentosNaData.length} ocupado${agendamentosNaData.length > 1 ? 's' : ''})`
}

function onDataChange() {
  // Limpar horários quando trocar a data
  form.value.horaInicio = ''
  form.value.horaFim = ''
}

function onHoraInicioChange() {
  // Limpar hora fim quando trocar hora início
  form.value.horaFim = ''
}

async function handleSubmit() {
  if (!isFormValid.value || !props.profissional || isSubmitting.value) return
  
  isSubmitting.value = true
  
  try {
    // Preparar dados para criação
    const dadosAgendamento = {
      profissional_id: props.profissional.profissional_id,
      cliente_id: Number(form.value.clienteId),
      data: form.value.data,
      hora_inicio: form.value.horaInicio,
      hora_fim: form.value.horaFim,
      titulo: form.value.titulo,
      descricao: form.value.descricao || undefined
    }

    console.log('📝 Submetendo agendamento:', dadosAgendamento)

    // Criar o agendamento
    const resultado = await criarAgendamento(dadosAgendamento)

    if (resultado.success) {
      // Mostrar toast de sucesso
      toast.success('Agendamento criado com sucesso!')
      
      // Atualizar cache do store para refletir o novo agendamento
      await agendamentoStore.fetchAgendamentosByProfissional(props.profissional.profissional_id, true)
      
      // Emitir evento de sucesso (caso o componente pai queira fazer algo)
      emit('submit', {
        ...form.value,
        profissionalId: props.profissional.profissional_id,
        clienteId: Number(form.value.clienteId)
      })
      
      // Fechar modal
      emit('close')
      
      console.log('✅ Agendamento criado e modal fechado')
    } else {
      // Mostrar toast de erro
      toast.error('Erro ao criar agendamento', resultado.error)
      console.error('❌ Erro ao criar agendamento:', resultado.error)
    }
  } catch (error: any) {
    // Erro inesperado
    console.error('❌ Erro inesperado:', error)
    toast.error('Erro inesperado', 'Ocorreu um erro inesperado ao criar o agendamento.')
  } finally {
    isSubmitting.value = false
  }
}

function abrirModalNovoCliente() {
  emit('openNovoCliente')
}

// Função para verificar se um horário específico está ocupado
function isHorarioOcupado(horario: string, agendamentos: Agendamento[]): boolean {
  const [horaInicio, minutoInicio] = horario.split(':').map(Number)
  const horarioEmMinutos = (horaInicio || 0) * 60 + (minutoInicio || 0)
  
  return agendamentos.some(agendamento => {
    if (!agendamento.hora_inicio || !agendamento.hora_fim) {
      return false
    }
    
    // Extrair apenas HH:MM do horário (remover segundos e timezone se existirem)
    // Formato esperado: "HH:MM:SS+TZ" ou "HH:MM"
    const horaInicioLimpa = agendamento.hora_inicio.split(':').slice(0, 2).join(':')
    const horaFimLimpa = agendamento.hora_fim.split(':').slice(0, 2).join(':')
    
    const [inicioH, inicioM] = horaInicioLimpa.split(':').map(Number)
    const [fimH, fimM] = horaFimLimpa.split(':').map(Number)
    
    const inicioEmMinutos = (inicioH || 0) * 60 + (inicioM || 0)
    const fimEmMinutos = (fimH || 0) * 60 + (fimM || 0)
    
    // Verificar se o horário está dentro do intervalo ocupado
    return horarioEmMinutos >= inicioEmMinutos && horarioEmMinutos < fimEmMinutos
  })
}

// Resetar formulário quando modal abrir/fechar
watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    form.value = {
      clienteId: '',
      titulo: '',
      descricao: '',
      data: '',
      horaInicio: '',
      horaFim: ''
    }
  }
})
</script>
