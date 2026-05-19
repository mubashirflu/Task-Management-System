<template>
  <header class="topbar">
    <div class="topbar-left">
      <button class="hamburger" @click="$emit('toggle-sidebar')">
        <span /><span /><span />
      </button>
      <div class="topbar-greeting">
        <h1 class="greeting-title">Welcome back, Mubashir! 👋</h1>
        <p class="greeting-sub">Here's what's happening with your tasks today.</p>
      </div>
    </div>

    <div class="topbar-right">
      <div class="search-box">
        <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
          <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <input
          v-model="localSearch"
          class="search-input"
          type="text"
          placeholder="Search tasks..."
          @input="onSearch"
        />
      </div>

      <button class="icon-btn notification-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="notif-dot" />
      </button>

      <div class="user-menu">
        <div class="user-avatar">M</div>
        <span class="user-name">Mubashir</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTaskStore } from '@/stores/taskStore'

defineEmits<{ (e: 'toggle-sidebar'): void }>()

const store = useTaskStore()
const localSearch = ref('')

function onSearch() {
  store.setSearch(localSearch.value)
}
</script>

<style scoped>
.topbar {
  height: var(--topbar-height);
  background: #fff;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  gap: 20px;
  position: sticky;
  top: 0;
  z-index: 50;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 4px;
  flex-shrink: 0;
}
.hamburger span {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--color-text-secondary);
  border-radius: 2px;
  transition: var(--transition);
}

.greeting-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.greeting-sub {
  font-size: 0.78rem;
  color: var(--color-text-secondary);
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
}

/* Search */
.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--color-body-bg);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 9px 14px;
  transition: border-color var(--transition);
}
.search-box:focus-within {
  border-color: var(--color-primary);
  background: #fff;
}
.search-icon {
  color: var(--color-text-muted);
  flex-shrink: 0;
}
.search-input {
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.875rem;
  color: var(--color-text-primary);
  width: 200px;
}
.search-input::placeholder {
  color: var(--color-text-muted);
}

/* Notification */
.icon-btn {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  border: 1.5px solid var(--color-border);
  background: #fff;
  transition: all var(--transition);
}
.icon-btn:hover {
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-color: var(--color-primary);
}
.notif-dot {
  position: absolute;
  top: 8px;
  right: 9px;
  width: 8px;
  height: 8px;
  background: var(--color-primary);
  border-radius: 50%;
  border: 2px solid #fff;
}

/* User */
.user-menu {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  border: 1.5px solid var(--color-border);
  transition: all var(--transition);
}
.user-menu:hover {
  background: var(--color-primary-light);
  border-color: var(--color-primary);
}
.user-avatar {
  width: 30px;
  height: 30px;
  background: var(--color-primary);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
}
.user-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

@media (max-width: 1024px) {
  .hamburger { display: flex; }
  .greeting-sub { display: none; }
}

@media (max-width: 640px) {
  .topbar { padding: 0 16px; }
  .search-box { display: none; }
  .user-name { display: none; }
  .greeting-title { font-size: 0.9rem; }
}
</style>
