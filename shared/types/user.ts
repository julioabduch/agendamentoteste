// Re-export dos tipos do database
export type { UserProfile, UserProfileInsert, UserProfileUpdate } from './database'
import type { UserProfile } from './database'

// Tipos para o estado do store de usuário
export interface UserState {
  profile: UserProfile | null
  loading: boolean
  error: string | null
}

// Tipos para ações do store
export interface UserActions {
  fetchProfile(): Promise<void>
  updateProfile(data: Partial<Pick<UserProfile, 'nome' | 'role'>>): Promise<void>
  clearProfile(): void
}
