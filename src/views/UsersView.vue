<template>
  <div class="users-view">
    <div class="page-header">
      <div>
        <h1 class="page-title">Users</h1>
        <p class="page-sub">Manage system users</p>
      </div>
    </div>

    <div class="users-grid">
      <div class="user-card card">
        <div class="user-avatar-lg">M</div>
        <h3>Muhammad Mubashir</h3>
        <p class="user-role">Developer</p>
        <div class="user-meta">
          <span>Pakistan</span>
          <span>22 years old</span>
        </div>
        <div class="user-stats">
          <div class="user-stat">
            <span class="stat-num">{{ store.stats.total }}</span>
            <span class="stat-lbl">Tasks</span>
          </div>
          <div class="user-stat">
            <span class="stat-num">{{ store.stats.completed }}</span>
            <span class="stat-lbl">Done</span>
          </div>
          <div class="user-stat">
            <span class="stat-num">{{ store.stats.inProgress }}</span>
            <span class="stat-lbl">Active</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useTaskStore } from '@/stores/taskStore'

const store = useTaskStore()
onMounted(() => { if (!store.tasks.length) store.fetchTasks() })
</script>

<style scoped>
.users-view { display: flex; flex-direction: column; gap: 24px; }
.page-header { display: flex; align-items: center; justify-content: space-between; }
.page-title { font-size: 1.4rem; font-weight: 800; color: var(--color-text-primary); }
.page-sub { font-size: 0.85rem; color: var(--color-text-secondary); margin-top: 2px; }

.users-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }

.user-card {
  padding: 32px 24px;
  display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center;
}
.user-avatar-lg {
  width: 80px; height: 80px; background: var(--color-primary); color: #fff;
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-size: 2rem; font-weight: 700;
}
.user-card h3 { font-size: 1.05rem; font-weight: 700; color: var(--color-text-primary); }
.user-role { font-size: 0.8rem; color: var(--color-primary); font-weight: 600; background: var(--color-primary-light); padding: 3px 12px; border-radius: 99px; }
.user-meta { display: flex; gap: 12px; font-size: 0.78rem; color: var(--color-text-muted); }
.user-stats { display: flex; gap: 24px; margin-top: 8px; border-top: 1px solid var(--color-border); padding-top: 16px; width: 100%; justify-content: center; }
.user-stat { display: flex; flex-direction: column; align-items: center; gap: 3px; }
.stat-num { font-size: 1.4rem; font-weight: 800; color: var(--color-text-primary); }
.stat-lbl { font-size: 0.72rem; color: var(--color-text-muted); }
</style>
