import { defineStore } from 'pinia'
import type { Agendamento } from '../../shared/types/database'
import { useSupabaseClient } from '#imports'

interface DiaSemana {
  data: Date
  dia: number
  nome: string
  nomeCompleto: string
}

// Interface para o cache de agendamentos por profissional e semana
interface CacheAgendamentos {
  [profissionalId: number]: {
    [chaveData: string]: Agendamento[]
  }
}

interface AgendamentoState {
  dataReferencia: Date
  agendamentos: Agendamento[]
  carregandoAgendamentos: boolean
  erroAgendamentos: string | null
  cacheAgendamentos: CacheAgendamentos
}

export const useAgendamentoStore = defineStore('agendamento', {
  state: (): AgendamentoState => ({
    dataReferencia: new Date(),
    agendamentos: [],
    carregandoAgendamentos: false,
    erroAgendamentos: null,
    cacheAgendamentos: {}
  }),

  getters: {
    /**
     * Retorna a data de referência formatada
     */
    dataReferenciaFormatada: (state) => {
      return state.dataReferencia.toLocaleDateString('pt-BR')
    },

    /**
     * Retorna o mês e ano da semana atual
     */
    mesAnoAtual: (state) => {
      return state.dataReferencia.toLocaleDateString('pt-BR', {
        month: 'long',
        year: 'numeric'
      })
    },

    /**
     * Calcula os dias da semana automaticamente com base na data de referência
     * Este getter é reativo e atualiza sempre que dataReferencia muda
     */
    diasSemana: (state) => {
      const diasDaSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
      const diasAbreviados = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
      
      // Garantir que trabalhamos com uma data limpa (sem horário)
      const dataRef = new Date(state.dataReferencia.getFullYear(), state.dataReferencia.getMonth(), state.dataReferencia.getDate())
      const diaDaSemanaDaRef = dataRef.getDay() // 0 = domingo, 1 = segunda, etc.
      
      // Calcular o domingo da semana (início da semana)
      const domingo = new Date(dataRef)
      domingo.setDate(dataRef.getDate() - diaDaSemanaDaRef)
      
      // Gerar array com os 7 dias da semana
      const diasCalculados: DiaSemana[] = []
      
      for (let i = 0; i < 7; i++) {
        // Criar nova data para cada dia da semana
        const dataAtual = new Date(domingo.getFullYear(), domingo.getMonth(), domingo.getDate() + i)
        
        diasCalculados.push({
          data: new Date(dataAtual),
          dia: dataAtual.getDate(),
          nome: diasAbreviados[i] || '',
          nomeCompleto: diasDaSemana[i] || ''
        })
      }
      
      return diasCalculados
    },

    /**
     * Retorna a chave única para a semana atual (formato: 2025-09-15)
     * Usa o domingo da semana como referência
     */
    chaveSemanaAtual(): string {
      const diasSemana = this.diasSemana
      if (diasSemana.length > 0 && diasSemana[0]) {
        // Pegar o domingo (primeiro dia) da semana como referência
        const domingo = diasSemana[0].data
        return domingo.toISOString().split('T')[0]! // formato: yyyy-mm-dd
      }
      return new Date().toISOString().split('T')[0]!
    },

    /**
     * Retorna as datas de início e fim da semana atual
     */
    rangeDatasSemana(): { inicio: string; fim: string } {
      const diasSemana = this.diasSemana
      if (diasSemana.length > 0 && diasSemana[0] && diasSemana[6]) {
        const inicio = diasSemana[0].data.toISOString().split('T')[0]! // domingo
        const fim = diasSemana[6].data.toISOString().split('T')[0]! // sábado
        return { inicio, fim }
      }
      const hoje = new Date()
      const inicioStr = hoje.toISOString().split('T')[0]!
      return { inicio: inicioStr, fim: inicioStr }
    },

    /**
     * Retorna os agendamentos filtrados para a semana atual
     */
    agendamentosSemanaAtual(): Agendamento[] {
      return this.agendamentos.filter(agendamento => {
        if (!agendamento.data) return false
        const dataAgendamento = agendamento.data
        const { inicio, fim } = this.rangeDatasSemana
        return dataAgendamento >= inicio && dataAgendamento <= fim
      })
    }
  },

  actions: {
    /**
     * Busca agendamentos de um profissional para a semana atual (não cancelados)
     * Inclui sistema de cache para evitar buscas desnecessárias
     * @param profissionalId id do profissional
     * @param forceRefresh força atualização ignorando cache
     */
    async fetchAgendamentosByProfissional(profissionalId: number, forceRefresh: boolean = false) {
      const chaveSemana = this.chaveSemanaAtual
      
      // Verificar se já temos os dados no cache
      if (!forceRefresh && 
          this.cacheAgendamentos[profissionalId]?.hasOwnProperty(chaveSemana)) {
        console.log('🎯 Usando cache para semana:', chaveSemana)
        this.agendamentos = this.cacheAgendamentos[profissionalId][chaveSemana] || []
        return
      }

      this.carregandoAgendamentos = true
      this.erroAgendamentos = null
      
      try {
        console.log('🔍 Buscando agendamentos para semana:', chaveSemana)
        const { inicio, fim } = this.rangeDatasSemana
        const supabase = useSupabaseClient<any>()
        
        const { data, error } = await supabase
          .from('ag_agendamentos')
          .select('*')
          .eq('profissional_id', profissionalId)
          .eq('cancelado', false)
          .gte('data', inicio) // maior ou igual à data de início da semana
          .lte('data', fim)    // menor ou igual à data de fim da semana
          
        if (error) throw error

        const agendamentos = data || []
        
        // Salvar no cache
        if (!this.cacheAgendamentos[profissionalId]) {
          this.cacheAgendamentos[profissionalId] = {}
        }
        this.cacheAgendamentos[profissionalId][chaveSemana] = agendamentos
        
        // Atualizar estado atual
        this.agendamentos = agendamentos
        
        console.log('✅ Agendamentos carregados e salvos no cache:', agendamentos.length)
        
      } catch (err: any) {
        this.erroAgendamentos = err.message || 'Erro ao buscar agendamentos'
        this.agendamentos = []
        console.error('❌ Erro ao buscar agendamentos:', err)
      } finally {
        this.carregandoAgendamentos = false
      }
    },
    /**
     * Avança uma semana (soma 7 dias na data de referência)
     * @param profissionalId id do profissional para buscar agendamentos automaticamente
     */
    async avancarSemana(profissionalId?: number) {
      const novaData = new Date(this.dataReferencia)
      novaData.setDate(novaData.getDate() + 7)
      this.dataReferencia = novaData
      
      // Buscar agendamentos da nova semana se profissionalId for fornecido
      if (profissionalId) {
        await this.fetchAgendamentosByProfissional(profissionalId)
      }
    },

    /**
     * Volta uma semana (subtrai 7 dias da data de referência)
     * @param profissionalId id do profissional para buscar agendamentos automaticamente
     */
    async voltarSemana(profissionalId?: number) {
      const novaData = new Date(this.dataReferencia)
      novaData.setDate(novaData.getDate() - 7)
      this.dataReferencia = novaData
      
      // Buscar agendamentos da nova semana se profissionalId for fornecido
      if (profissionalId) {
        await this.fetchAgendamentosByProfissional(profissionalId)
      }
    },

    /**
     * Define uma nova data de referência
     * @param novaData nova data de referência
     * @param profissionalId id do profissional para buscar agendamentos automaticamente
     */
    async setDataReferencia(novaData: Date, profissionalId?: number) {
      this.dataReferencia = new Date(novaData)
      
      // Buscar agendamentos da nova semana se profissionalId for fornecido
      if (profissionalId) {
        await this.fetchAgendamentosByProfissional(profissionalId)
      }
    },

    /**
     * Volta para a semana atual (data atual)
     * @param profissionalId id do profissional para buscar agendamentos automaticamente
     */
    async voltarParaHoje(profissionalId?: number) {
      this.dataReferencia = new Date()
      
      // Buscar agendamentos da semana atual se profissionalId for fornecido
      if (profissionalId) {
        await this.fetchAgendamentosByProfissional(profissionalId)
      }
    },

    /**
     * Limpa o cache de um profissional específico ou todo o cache
     */
    limparCache(profissionalId?: number) {
      if (profissionalId) {
        delete this.cacheAgendamentos[profissionalId]
        console.log('🗑️ Cache limpo para profissional:', profissionalId)
      } else {
        this.cacheAgendamentos = {}
        console.log('🗑️ Todo o cache foi limpo')
      }
    }
  }
})
