<template>
  <div class="h-screen flex overflow-hidden bg-gray-50">
    <!-- Sidebar -->
    <div class="w-64 flex-shrink-0">
      <AppSidebar />
    </div>
    
    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col overflow-hidden">
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
