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
      }
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
