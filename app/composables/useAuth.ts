export const useAuth = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Login com email e senha
  const signIn = async (email: string, password: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      })

      if (signInError) {
        error.value = signInError.message
        return { success: false, error: signInError.message }
      }

      // Redirecionar para a página inicial após login bem-sucedido
      await navigateTo('/')
      return { success: true, data }
      
    } catch (err: any) {
      error.value = err.message || 'Erro inesperado durante o login'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Logout
  const signOut = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const { error: signOutError } = await supabase.auth.signOut()
      
      if (signOutError) {
        error.value = signOutError.message
        return { success: false, error: signOutError.message }
      }

      // Redirecionar para login após logout
      await navigateTo('/login')
      return { success: true }
      
    } catch (err: any) {
      error.value = err.message || 'Erro inesperado durante o logout'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Login com OTP (email magic link)
  const signInWithOtp = async (email: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const { data, error: otpError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/confirm`,
        }
      })

      if (otpError) {
        error.value = otpError.message
        return { success: false, error: otpError.message }
      }

      return { success: true, data }
      
    } catch (err: any) {
      error.value = err.message || 'Erro inesperado durante o envio do OTP'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  return {
    // Estado
    user: readonly(user),
    isLoading: readonly(isLoading),
    error: readonly(error),
    
    // Ações
    signIn,
    signOut,
    signInWithOtp,
    
    // Helpers
    isAuthenticated: computed(() => !!user.value),
    clearError: () => { error.value = null }
  }
}
