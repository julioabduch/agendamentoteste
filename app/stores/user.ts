import { defineStore } from 'pinia'
import type { UserProfile, UserState } from '../../shared/types/user'

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    profile: null,
    loading: false,
    error: null
  }),

  getters: {
    // Retorna se o usuário está logado e tem perfil
    isProfileLoaded: (state) => state.profile !== null,
    
    // Retorna o nome do usuário ou fallback
    userName: (state) => state.profile?.nome || 'Usuário',
    
    // Retorna o role do usuário
    userRole: (state) => state.profile?.role || 'user',
    
    // Verifica se é admin
    isAdmin: (state) => state.profile?.role === 'admin'
  },

  actions: {
    /**
     * Busca o perfil do usuário na tabela ag_profiles
     */
    async fetchProfile() {
      try {
        this.loading = true
        this.error = null

        const supabase = useSupabaseClient<any>()
        
        const { data, error } = await supabase
          .from('ag_profiles')
          .select('*')
          .single()

        if (error) {
          // Se não encontrar perfil, não é necessariamente um erro
          if (error.code === 'PGRST116') {
            console.log('Perfil não encontrado - usuário novo')
            this.profile = null
            return
          }
          throw error
        }

        this.profile = data as UserProfile
        
      } catch (error: any) {
        this.error = error.message || 'Erro ao buscar perfil do usuário'
        console.error('Erro ao buscar perfil:', error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Atualiza o perfil do usuário
     */
    async updateProfile(updates: Partial<Pick<UserProfile, 'nome' | 'role'>>) {
      try {
        this.loading = true
        this.error = null

        const supabase = useSupabaseClient<any>()
        const user = useSupabaseUser()

        if (!user.value) {
          throw new Error('Usuário não autenticado')
        }

        // Se ainda não tem perfil, criar um novo
        if (!this.profile) {
          const { data, error } = await supabase
            .from('ag_profiles')
            .insert({
              user_id: user.value.id,
              ...updates
            })
            .select()
            .single()

          if (error) throw error
          this.profile = data as UserProfile
        } else {
          // Atualizar perfil existente
          const { data, error } = await supabase
            .from('ag_profiles')
            .update(updates)
            .eq('user_id', user.value.id)
            .select()
            .single()

          if (error) throw error
          this.profile = data as UserProfile
        }

      } catch (error: any) {
        this.error = error.message || 'Erro ao atualizar perfil'
        console.error('Erro ao atualizar perfil:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Limpa os dados do perfil (usado no logout)
     */
    clearProfile() {
      this.profile = null
      this.error = null
      this.loading = false
    },

    /**
     * Inicializa o perfil quando o usuário faz login
     */
    async initializeProfile() {
      const user = useSupabaseUser()
      
      if (user.value && !this.profile) {
        await this.fetchProfile()
      }
    }
  }
})
