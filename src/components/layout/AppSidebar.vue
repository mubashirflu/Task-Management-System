<template>
  <aside class="sidebar" :class="{ open }">
    <!-- Logo -->
    <div class="sidebar-logo">
      <div class="logo-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
          <rect x="9" y="3" width="6" height="4" rx="1" stroke="#fff" stroke-width="2"/>
          <path d="M9 12h6M9 16h4" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
      <span class="logo-text">Task Manager</span>
    </div>

    <!-- Navigation -->
    <nav class="sidebar-nav">
      <RouterLink
        v-for="item in navItems"
        :key="item.name"
        :to="item.to"
        class="nav-item"
        active-class="nav-item--active"
        @click="$emit('close')"
      >
        <span class="nav-icon" v-html="item.icon" />
        <span>{{ item.name }}</span>
      </RouterLink>
    </nav>

    <!-- Promo Card -->
    <div class="sidebar-promo">
      <div class="promo-text">
        <p class="promo-title">Stay Organized</p>
        <p class="promo-desc">Manage your tasks efficiently and boost your productivity.</p>
      </div>
      <div class="promo-illustration">
        <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
          <rect x="15" y="10" width="60" height="72" rx="8" fill="rgba(108,99,255,0.3)"/>
          <rect x="22" y="22" width="40" height="5" rx="2.5" fill="rgba(255,255,255,0.5)"/>
          <rect x="22" y="34" width="30" height="5" rx="2.5" fill="rgba(255,255,255,0.4)"/>
          <rect x="22" y="46" width="35" height="5" rx="2.5" fill="rgba(255,255,255,0.4)"/>
          <rect x="22" y="58" width="25" height="5" rx="2.5" fill="rgba(255,255,255,0.3)"/>
          <circle cx="72" cy="72" r="18" fill="#10b981"/>
          <path d="M64 72l5 5 10-10" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
defineProps<{ open: boolean }>()
defineEmits<{ (e: 'close'): void }>()

const navItems = [
  {
    name: 'Dashboard',
    to: '/',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
      <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
      <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
      <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
    </svg>`,
  },
  {
    name: 'Tasks',
    to: '/tasks',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" stroke-width="2"/>
      <path d="M9 12h6M9 16h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
  },
  {
    name: 'Add Task',
    to: '/tasks?action=add',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
      <path d="M12 8v8M8 12h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
  },
  {
    name: 'Categories',
    to: '/categories',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
      <rect x="14" y="3" width="7" height="4" rx="1" stroke="currentColor" stroke-width="2"/>
      <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
      <rect x="14" y="10" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
    </svg>`,
  },
  {
    name: 'Users',
    to: '/users',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
  },
  {
    name: 'Settings',
    to: '/settings',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" stroke-width="2"/>
    </svg>`,
  },
]
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: var(--sidebar-width);
  height: 100vh;
  background: var(--color-sidebar-bg);
  display: flex;
  flex-direction: column;
  z-index: 100;
  overflow-y: auto;
  transition: transform var(--transition);
}

/* ── Logo ── */
.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 22px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.logo-icon {
  width: 38px;
  height: 38px;
  background: var(--color-primary);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.logo-text {
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.01em;
}

/* ── Nav ── */
.sidebar-nav {
  flex: 1;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  border-radius: var(--radius-sm);
  color: var(--color-sidebar-text);
  font-size: 0.875rem;
  font-weight: 500;
  transition: all var(--transition);
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
}

.nav-item--active {
  background: var(--color-primary);
  color: #fff;
}

.nav-item--active:hover {
  background: var(--color-primary-dark);
}

.nav-icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

/* ── Promo ── */
.sidebar-promo {
  margin: 12px;
  background: linear-gradient(135deg, #2d2b55 0%, #1e1c3a 100%);
  border-radius: var(--radius-md);
  padding: 18px 16px 0;
  border: 1px solid rgba(108, 99, 255, 0.3);
  overflow: hidden;
  position: relative;
}

.promo-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 6px;
}

.promo-desc {
  font-size: 0.75rem;
  color: var(--color-sidebar-text);
  line-height: 1.5;
}

.promo-illustration {
  display: flex;
  justify-content: center;
  margin-top: 12px;
}

/* ── Responsive ── */
@media (max-width: 1024px) {
  .sidebar {
    transform: translateX(-100%);
  }
  .sidebar.open {
    transform: translateX(0);
  }
}
</style>
