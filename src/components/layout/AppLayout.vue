<template>
  <div class="app-layout" :class="{ 'sidebar-open': sidebarOpen }">
    <AppSidebar :open="sidebarOpen" @close="sidebarOpen = false" />
    <div class="app-main">
      <AppTopbar @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      <main class="app-content">
        <slot />
      </main>
    </div>
    <!-- Overlay for mobile -->
    <div class="sidebar-overlay" @click="sidebarOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppSidebar from './AppSidebar.vue'
import AppTopbar from './AppTopbar.vue'

const sidebarOpen = ref(false)
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  position: relative;
}

.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  margin-left: var(--sidebar-width);
  transition: margin-left var(--transition);
}

.app-content {
  flex: 1;
  padding: 28px;
  overflow-y: auto;
}

.sidebar-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 99;
}

@media (max-width: 1024px) {
  .app-main {
    margin-left: 0;
  }

  .app-layout.sidebar-open .sidebar-overlay {
    display: block;
  }
}

@media (max-width: 640px) {
  .app-content {
    padding: 16px;
  }
}
</style>
