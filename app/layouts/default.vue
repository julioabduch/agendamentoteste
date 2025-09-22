<template>
  <div class="h-screen grid grid-cols-[auto_1fr] overflow-hidden bg-gray-50">
    <!-- Sidebar -->
    <AppSidebar />
    
    <!-- Main Content Area -->
    <div class="flex flex-col overflow-hidden">
      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
// Layout padrão com sidebar
</script>
