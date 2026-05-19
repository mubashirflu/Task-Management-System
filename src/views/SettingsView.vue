<template>
  <div class="settings-view">
    <div class="page-header">
      <div>
        <h1 class="page-title">Settings</h1>
        <p class="page-sub">Configure your preferences</p>
      </div>
    </div>

    <div class="settings-grid">
      <div class="settings-card card">
        <h3>Profile Settings</h3>
        <div class="setting-group">
          <label>Full Name</label>
          <input class="form-control" type="text" value="Muhammad Mubashir" />
        </div>
        <div class="setting-group">
          <label>Email</label>
          <input class="form-control" type="email" value="mubashir@example.com" />
        </div>
        <div class="setting-group">
          <label>Country</label>
          <input class="form-control" type="text" value="Pakistan" />
        </div>
        <button class="btn btn-primary" style="margin-top: 8px;">Save Changes</button>
      </div>

      <div class="settings-card card">
        <h3>App Preferences</h3>
        <div class="preference-item">
          <div>
            <p class="pref-label">Tasks per page</p>
            <p class="pref-desc">How many tasks to show per page</p>
          </div>
          <select class="form-control" style="width: 80px;" v-model.number="perPage" @change="store.perPage = perPage">
            <option :value="3">3</option>
            <option :value="5">5</option>
            <option :value="10">10</option>
          </select>
        </div>
        <div class="preference-item">
          <div>
            <p class="pref-label">Default Status Filter</p>
            <p class="pref-desc">Default filter when opening tasks</p>
          </div>
          <select class="form-control" style="width: 130px;">
            <option>All</option>
            <option>Completed</option>
            <option>In Progress</option>
            <option>Pending</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTaskStore } from '@/stores/taskStore'

const store = useTaskStore()
const perPage = ref(store.perPage)
</script>

<style scoped>
.settings-view { display: flex; flex-direction: column; gap: 24px; }
.page-header { display: flex; align-items: center; justify-content: space-between; }
.page-title { font-size: 1.4rem; font-weight: 800; color: var(--color-text-primary); }
.page-sub { font-size: 0.85rem; color: var(--color-text-secondary); margin-top: 2px; }

.settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

.settings-card {
  padding: 24px;
  display: flex; flex-direction: column; gap: 16px;
}
.settings-card h3 { font-size: 1rem; font-weight: 700; color: var(--color-text-primary); border-bottom: 1px solid var(--color-border); padding-bottom: 12px; }

.setting-group { display: flex; flex-direction: column; gap: 6px; }
.setting-group label { font-size: 0.8rem; font-weight: 600; color: var(--color-text-secondary); }

.preference-item { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.pref-label { font-size: 0.875rem; font-weight: 600; color: var(--color-text-primary); }
.pref-desc { font-size: 0.75rem; color: var(--color-text-muted); margin-top: 2px; }

@media (max-width: 768px) { .settings-grid { grid-template-columns: 1fr; } }
</style>
