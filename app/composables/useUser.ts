import { useUserStore } from '~/stores/user'

/**
 * Composable para gerenciar dados do usuário via Pinia store
 */
export const useUser = () => {
  const userStore = useUserStore()

  // Estados reativo do store
  const profile = computed(() => userStore.profile)
  const loading = computed(() => userStore.loading)
  const error = computed(() => userStore.error)

  // Getters do store
  const isProfileLoaded = computed(() => userStore.isProfileLoaded)
  const userName = computed(() => userStore.userName)
  const userRole = computed(() => userStore.userRole)
  const isAdmin = computed(() => userStore.isAdmin)

  // Ações do store
  const fetchProfile = () => userStore.fetchProfile()
  const updateProfile = (data: Parameters<typeof userStore.updateProfile>[0]) => 
    userStore.updateProfile(data)
  const clearProfile = () => userStore.clearProfile()
  const initializeProfile = () => userStore.initializeProfile()

  return {
    // Estados
    profile: readonly(profile),
    loading: readonly(loading),
    error: readonly(error),
    
    // Getters
    isProfileLoaded: readonly(isProfileLoaded),
    userName: readonly(userName),
    userRole: readonly(userRole),
    isAdmin: readonly(isAdmin),
    
    // Ações
    fetchProfile,
    updateProfile,
    clearProfile,
    initializeProfile
  }
}
