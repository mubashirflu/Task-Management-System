<template>
  <div id="app-root">
    <AppLayout>
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" :key="$route.path" />
        </Transition>
      </RouterView>
    </AppLayout>
  </div>
</template>

<script setup lang="ts">
import AppLayout from '@/components/layout/AppLayout.vue'
console.log("Firebase API:", import.meta.env.VITE_API_KEY)
</script>
