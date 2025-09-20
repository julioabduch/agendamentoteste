export default defineNuxtPlugin(async () => {
  // Aguardar hidratação completa antes de inicializar
  await nextTick()
  
  const user = useSupabaseUser()
  const userStore = useUserStore()

  // Observar mudanças no estado de autenticação apenas no cliente
  if (process.client) {
    watch(user, async (newUser) => {
      if (newUser) {
        // Usuário logado - buscar perfil
        console.log('Usuário logado, buscando perfil...')
        await userStore.initializeProfile()
      } else {
        // Usuário deslogado - limpar store
        console.log('Usuário deslogado, limpando perfil...')
        userStore.clearProfile()
      }
    }, { immediate: true })
  }
})
