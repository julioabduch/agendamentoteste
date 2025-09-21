import { useSupabaseClient } from '#imports'
import type { AgendamentoInsert, AgendamentoRelatorio } from '../../shared/types/database'

/**
 * Composable para gerenciar operações de agendamentos
 */
export const useAgendamento = () => {
  const supabase = useSupabaseClient<any>()

  /**
   * Cria um novo agendamento
   */
  const criarAgendamento = async (dadosAgendamento: {
    profissional_id: number
    cliente_id: number
    data: string // formato: yyyy-mm-dd
    hora_inicio: string // formato: HH:MM
    hora_fim: string // formato: HH:MM
    titulo?: string
    descricao?: string
  }) => {
    try {
      // Preparar dados para inserção
      const agendamentoParaInserir: AgendamentoInsert = {
        profissional_id: dadosAgendamento.profissional_id,
        cliente_id: dadosAgendamento.cliente_id,
        data: dadosAgendamento.data,
        hora_inicio: dadosAgendamento.hora_inicio,
        hora_fim: dadosAgendamento.hora_fim,
        titulo: dadosAgendamento.titulo || null,
        descricao: dadosAgendamento.descricao || null,
        cancelado: false
        // id, created_at, user_id serão preenchidos automaticamente pelo Supabase
      }

      console.log('📝 Criando agendamento:', agendamentoParaInserir)

      const { data, error } = await supabase
        .from('ag_agendamentos')
        .insert(agendamentoParaInserir)
        .select('*')
        .single()

      if (error) {
        throw new Error(`Erro ao criar agendamento: ${error.message}`)
      }

      console.log('✅ Agendamento criado com sucesso:', data)
      return { success: true, data }

    } catch (err: any) {
      console.error('❌ Erro na função criarAgendamento:', err)
      return { 
        success: false, 
        error: err.message || 'Erro desconhecido ao criar agendamento' 
      }
    }
  }

  /**
   * Atualiza um agendamento existente
   */
  const atualizarAgendamento = async (id: number, dadosAgendamento: {
    profissional_id?: number
    cliente_id?: number
    data?: string
    hora_inicio?: string
    hora_fim?: string
    titulo?: string
    descricao?: string
    cancelado?: boolean
  }) => {
    try {
      console.log('📝 Atualizando agendamento:', id, dadosAgendamento)

      const { data, error } = await supabase
        .from('ag_agendamentos')
        .update(dadosAgendamento)
        .eq('id', id)
        .select('*')
        .single()

      if (error) {
        console.error('❌ Erro ao atualizar agendamento:', error)
        throw new Error(`Erro ao atualizar agendamento: ${error.message}`)
      }

      console.log('✅ Agendamento atualizado com sucesso:', data)
      return { success: true, data }

    } catch (err: any) {
      console.error('❌ Erro na função atualizarAgendamento:', err)
      return { 
        success: false, 
        error: err.message || 'Erro desconhecido ao atualizar agendamento' 
      }
    }
  }

  /**
   * Cancela um agendamento (soft delete)
   */
  const cancelarAgendamento = async (id: number) => {
    try {
      console.log('🗑️ Cancelando agendamento:', id)

      const { data, error } = await supabase
        .from('ag_agendamentos')
        .update({ 
          cancelado: true,
          cancelado_as: new Date().toISOString()
        })
        .eq('id', id)
        .select('*')
        .single()

      if (error) {
        console.error('❌ Erro ao cancelar agendamento:', error)
        throw new Error(`Erro ao cancelar agendamento: ${error.message}`)
      }

      console.log('✅ Agendamento cancelado com sucesso:', data)
      return { success: true, data }

    } catch (err: any) {
      console.error('❌ Erro na função cancelarAgendamento:', err)
      return { 
        success: false, 
        error: err.message || 'Erro desconhecido ao cancelar agendamento' 
      }
    }
  }

  /**
   * Busca relatório de agendamentos com filtros
   * 
   * @param filtros - Opções de filtro para o relatório
   * @param filtros.dataInicio - Data de início (formato: yyyy-mm-dd)
   * @param filtros.dataFim - Data de fim (formato: yyyy-mm-dd) 
   * @param filtros.profissionalId - ID do profissional
   * @param filtros.clienteId - ID do cliente
   * @param filtros.incluirCancelados - Se deve incluir agendamentos cancelados (padrão: false)
   * 
   * @example
   * // Buscar todos agendamentos ativos
   * const resultado = await buscarRelatorioAgendamentos()
   * 
   * // Buscar agendamentos de um período específico
   * const resultado = await buscarRelatorioAgendamentos({
   *   dataInicio: '2025-09-01',
   *   dataFim: '2025-09-30'
   * })
   * 
   * // Buscar agendamentos de um profissional específico incluindo cancelados
   * const resultado = await buscarRelatorioAgendamentos({
   *   profissionalId: 1,
   *   incluirCancelados: true
   * })
   */
  const buscarRelatorioAgendamentos = async (filtros?: {
    dataInicio?: string // formato: yyyy-mm-dd
    dataFim?: string // formato: yyyy-mm-dd
    profissionalId?: number
    clienteId?: number
    incluirCancelados?: boolean
  }) => {
    try {
      console.log('📊 Buscando relatório de agendamentos:', filtros)

      // Usar a função RPC que bypassa o RLS
      const { data, error } = await supabase.rpc('fn_agendamentos_completos')

      if (error) {
        console.error('❌ Erro ao buscar relatório:', error)
        throw new Error(`Erro ao buscar relatório: ${error.message}`)
      }

      let agendamentos = data as AgendamentoRelatorio[] || []

      // Aplicar filtros manualmente já que o RPC retorna todos os dados
      if (filtros) {
        agendamentos = agendamentos.filter(agendamento => {
          // Filtro por data início
          if (filtros.dataInicio && agendamento.data && agendamento.data < filtros.dataInicio) {
            return false
          }

          // Filtro por data fim
          if (filtros.dataFim && agendamento.data && agendamento.data > filtros.dataFim) {
            return false
          }

          // Filtro por profissional
          if (filtros.profissionalId && agendamento.profissional_id !== filtros.profissionalId) {
            return false
          }

          // Filtro por cliente
          if (filtros.clienteId && agendamento.cliente_id !== filtros.clienteId) {
            return false
          }

          // Filtro para incluir/excluir cancelados
          if (!filtros.incluirCancelados && agendamento.cancelado) {
            return false
          }

          return true
        })

        // Ordenar manualmente por data e hora
        agendamentos.sort((a, b) => {
          // Verificar se os campos não são null antes de comparar
          const dataA = a.data || '0000-00-00'
          const dataB = b.data || '0000-00-00'
          const dataComparacao = dataA.localeCompare(dataB)
          
          if (dataComparacao !== 0) return dataComparacao
          
          const horaA = a.hora_inicio || '00:00'
          const horaB = b.hora_inicio || '00:00'
          return horaA.localeCompare(horaB)
        })
      }
      
      console.log('✅ Relatório carregado com sucesso:', {
        total: agendamentos.length,
        periodo: filtros?.dataInicio && filtros?.dataFim ? 
          `${filtros.dataInicio} a ${filtros.dataFim}` : 'Todos',
        filtros
      })

      return { success: true, data: agendamentos }

    } catch (err: any) {
      console.error('❌ Erro na função buscarRelatorioAgendamentos:', err)
      return { 
        success: false, 
        error: err.message || 'Erro desconhecido ao buscar relatório' 
      }
    }
  }

  return {
    criarAgendamento,
    atualizarAgendamento,
    cancelarAgendamento,
    buscarRelatorioAgendamentos
  }
}
