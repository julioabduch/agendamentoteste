<template>
  <aside class="h-full bg-white border-r border-gray-200 shadow-sm flex flex-col">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6 2a1 1 0 000 2h8a1 1 0 100-2H6zM3 6a1 1 0 011-1h12a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V6zM5 8a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm0 3a1 1 0 011-1h3a1 1 0 110 2H6a1 1 0 01-1-1z"/>
            </svg>
          </div>
          <div>
            <h1 class="text-lg font-bold text-gray-900">AgendaPro</h1>
            <p class="text-sm text-gray-500">Sistema de Agendamento</p>
          </div>
        </div>
        
        <!-- Close button for mobile -->
        <button 
          @click="$emit('close')"
          class="lg:hidden p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <XMarkIcon class="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 p-4 space-y-1">
      <NuxtLink 
        to="/"
        @click="$emit('close')"
        class="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
        :class="{ 'bg-blue-50 text-blue-700 border-r-2 border-blue-600': $route.path === '/' }"
      >
        <HomeIcon class="w-5 h-5 mr-3" />
        <span>Dashboard</span>
      </NuxtLink>
      
      <NuxtLink 
        to="/especialidades"
        @click="$emit('close')"
        class="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
        :class="{ 'bg-blue-50 text-blue-700 border-r-2 border-blue-600': $route.path === '/especialidades' }"
      >
        <AcademicCapIcon class="w-5 h-5 mr-3" />
        <span>Especialidades</span>
      </NuxtLink>
      
      <NuxtLink 
        to="/agendamentos"
        @click="$emit('close')"
        class="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
        :class="{ 'bg-blue-50 text-blue-700 border-r-2 border-blue-600': $route.path === '/agendamentos' }"
      >
        <CalendarIcon class="w-5 h-5 mr-3" />
        <span>Agendamentos</span>
      </NuxtLink>
      
      <NuxtLink 
        to="/clientes"
        @click="$emit('close')"
        class="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
        :class="{ 'bg-blue-50 text-blue-700 border-r-2 border-blue-600': $route.path === '/clientes' }"
      >
        <UsersIcon class="w-5 h-5 mr-3" />
        <span>Clientes</span>
      </NuxtLink>
      
      <NuxtLink 
        to="/profissionais"
        @click="$emit('close')"
        class="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
        :class="{ 'bg-blue-50 text-blue-700 border-r-2 border-blue-600': $route.path === '/profissionais' }"
      >
        <UserGroupIcon class="w-5 h-5 mr-3" />
        <span>Profissionais</span>
      </NuxtLink>
    </nav>

    <!-- Footer -->
    <div class="p-4 border-t border-gray-200">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
          <UserIcon class="w-4 h-4 text-gray-600" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate">
            {{ userStore.profile?.nome || 'Usuário' }}
          </p>
          <p class="text-xs text-gray-500 truncate">
            {{ userStore.profile?.role || 'Admin' }}
          </p>
        </div>
        <button
          @click="signOut"
          class="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          title="Sair"
        >
          <ArrowRightOnRectangleIcon class="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { 
  HomeIcon, 
  CalendarIcon, 
  UsersIcon, 
  UserGroupIcon,
  AcademicCapIcon,
  XMarkIcon,
  UserIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'

// Emits
defineEmits<{
  close: []
}>()

// Stores
const userStore = useUserStore()
const supabase = useSupabaseClient()

// Sign out function
const signOut = async () => {
  await supabase.auth.signOut()
  await navigateTo('/login')
}
</script>
