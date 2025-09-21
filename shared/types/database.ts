// Tipos gerados para as tabelas do Supabase
export interface Database {
  public: {
    Tables: {
      ag_profiles: {
        Row: {
          id: number
          created_at: string
          user_id: string | null
          nome: string | null
          role: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          user_id?: string | null
          nome?: string | null
          role?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          user_id?: string | null
          nome?: string | null
          role?: string | null
        }
      },
      ag_agendamentos: {
        Row: {
          id: number
          created_at: string
          user_id: string | null
          profissional_id: number | null
          cliente_id: number | null
          data: string | null // yyyy-mm-dd
          hora_inicio: string | null // hh:mm:ss+tz
          hora_fim: string | null // hh:mm:ss+tz
          titulo: string | null
          descricao: string | null
          cancelado: boolean | null
          cancelado_as: string | null // hh:mm:ss+tz
        }
        Insert: {
          id?: number
          created_at?: string
          user_id?: string | null
          profissional_id?: number | null
          cliente_id?: number | null
          data?: string | null
          hora_inicio?: string | null
          hora_fim?: string | null
          titulo?: string | null
          descricao?: string | null
          cancelado?: boolean | null
          cancelado_as?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          user_id?: string | null
          profissional_id?: number | null
          cliente_id?: number | null
          data?: string | null
          hora_inicio?: string | null
          hora_fim?: string | null
          titulo?: string | null
          descricao?: string | null
          cancelado?: boolean | null
          cancelado_as?: string | null
        }
      },
      ag_especialidades: {
        Row: {
          id: number
          especialidade: string | null
        }
        Insert: {
          id?: number
          especialidade?: string | null
        }
        Update: {
          id?: number
          especialidade?: string | null
        }
      }
      ag_clientes: {
        Row: {
          id: number
          created_at: string
          cpf: string | null
          nome: string | null
          endereco: string | null
          email: string | null
          telefone: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          cpf?: string | null
          nome?: string | null
          endereco?: string | null
          email?: string | null
          telefone?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          cpf?: string | null
          nome?: string | null
          endereco?: string | null
          email?: string | null
          telefone?: string | null
        }
      }
    }
  }
}

// Re-export dos tipos do perfil para compatibilidade
export type UserProfile = Database['public']['Tables']['ag_profiles']['Row']
export type UserProfileInsert = Database['public']['Tables']['ag_profiles']['Insert']
export type UserProfileUpdate = Database['public']['Tables']['ag_profiles']['Update']

// Re-export dos tipos da especialidade
export type Especialidade = Database['public']['Tables']['ag_especialidades']['Row']
export type EspecialidadeInsert = Database['public']['Tables']['ag_especialidades']['Insert']
export type EspecialidadeUpdate = Database['public']['Tables']['ag_especialidades']['Update']

// Re-export dos tipos dos clientes
export type Cliente = Database['public']['Tables']['ag_clientes']['Row']
export type ClienteInsert = Database['public']['Tables']['ag_clientes']['Insert']
export type ClienteUpdate = Database['public']['Tables']['ag_clientes']['Update']

// Tipo para o retorno da RPC function fn_get_all_profissionais
export interface Profissional {
  profissional_id: number
  nome_profissional: string
  especialidade: string
}

// Re-export dos tipos de agendamento
export type Agendamento = Database['public']['Tables']['ag_agendamentos']['Row']
export type AgendamentoInsert = Database['public']['Tables']['ag_agendamentos']['Insert']
export type AgendamentoUpdate = Database['public']['Tables']['ag_agendamentos']['Update']

// Interface para a view de relatórios de agendamentos
export interface AgendamentoRelatorio {
  agendamento_id: number
  agendamento_criado_em: string
  data: string | null
  hora_inicio: string | null
  hora_fim: string | null
  titulo: string | null
  descricao: string | null
  cancelado: boolean | null
  cancelado_as: string | null
  cliente_id: number | null
  cliente_nome: string | null
  cliente_cpf: string | null
  cliente_email: string | null
  cliente_telefone: string | null
  profissional_id: number | null
  profissional_nome: string | null
  profissional_especialidade: string | null
}
