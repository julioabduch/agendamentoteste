// Tipo para agendamento no sistema de scheduling
export interface AgendamentoSchedule {
  id: string
  cliente_nome: string
  horario_inicio: string
  horario_fim: string
  dia_semana: number // 0-6 (domingo a sábado)
  confirmado?: boolean
  cancelado?: boolean
  observacoes?: string
}

// Tipo para exibição do item de agendamento
export interface AgendamentoDisplay {
  id: string
  cliente_nome: string
  horario_inicio: string
  horario_fim: string
  confirmado?: boolean
  cancelado?: boolean
  observacoes?: string
}
