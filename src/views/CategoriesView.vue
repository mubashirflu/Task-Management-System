<template>
  <div class="categories-view">
    <div class="page-header">
      <div>
        <h1 class="page-title">Categories</h1>
        <p class="page-sub">Manage your task categories</p>
      </div>
    </div>

    <div class="categories-grid">
      <div v-for="cat in categories" :key="cat.slug" class="cat-card card">
        <div class="cat-icon" :style="{ background: cat.color + '20', color: cat.color }">
          <span v-html="catIcon(cat.slug)" />
        </div>
        <h3 class="cat-name">{{ cat.name }}</h3>
        <p class="cat-count">{{ taskCount(cat.slug) }} tasks</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { computed, onMounted } from 'vue'
import {  onMounted } from 'vue'
import { useTaskStore } from '@/stores/taskStore'

const store = useTaskStore()
onMounted(() => { if (!store.tasks.length) store.fetchTasks() })

const categories = [
  { name: 'Development', slug: 'development', color: '#6c63ff' },
  { name: 'Career', slug: 'career', color: '#f59e0b' },
  { name: 'Learning', slug: 'learning', color: '#10b981' },
  { name: 'DevOps', slug: 'devops', color: '#3b82f6' },
]

const taskCount = (slug: string) =>
  store.tasks.filter((t) => t.category === slug).length

const catIcon = (slug: string) => {
  const icons: Record<string, string> = {
    development: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><polyline points="16 18 22 12 16 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="8 6 2 12 8 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    career: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke="currentColor" stroke-width="2"/></svg>`,
    learning: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="currentColor" stroke-width="2"/></svg>`,
    devops: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2"/><path d="M8 21h8M12 17v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  }
  return icons[slug] ?? icons.development
}
</script>

<style scoped>
.categories-view { display: flex; flex-direction: column; gap: 24px; }
.page-header { display: flex; align-items: center; justify-content: space-between; }
.page-title { font-size: 1.4rem; font-weight: 800; color: var(--color-text-primary); }
.page-sub { font-size: 0.85rem; color: var(--color-text-secondary); margin-top: 2px; }

.categories-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.cat-card {
  padding: 28px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  transition: all var(--transition);
}
.cat-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }

.cat-icon {
  width: 64px; height: 64px;
  border-radius: var(--radius-lg);
  display: flex; align-items: center; justify-content: center;
}
.cat-name { font-size: 1rem; font-weight: 700; color: var(--color-text-primary); }
.cat-count { font-size: 0.8rem; color: var(--color-text-secondary); }

@media (max-width: 900px) { .categories-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px) { .categories-grid { grid-template-columns: 1fr 1fr; } }
</style>
