<template>
  <div class="task-row">
    <div class="task-icon-wrap" :class="`task-icon-wrap--${task.category}`">
      <span v-html="categoryIcon" />
    </div>

    <div class="task-info">
      <h3 class="task-title">{{ task.title }}</h3>
      <p class="task-desc">{{ task.description }}</p>
      <div class="task-meta">
        <span class="meta-item">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2"/>
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          {{ task.assignee }}
        </span>
        <span class="meta-sep">|</span>
        <span class="meta-item">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M4 22v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          {{ task.country }}
        </span>
        <template v-if="task.age">
          <span class="meta-sep">|</span>
          <span class="meta-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
              <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            {{ task.age }} years old
          </span>
        </template>
      </div>
    </div>

    <div class="task-actions">
      <span class="badge" :class="`badge-${statusClass}`">
        <span class="badge-dot" />
        {{ statusLabel }}
      </span>

      <div class="action-btns">
        <button class="btn-icon btn-icon-edit" title="Edit" @click="$emit('edit', task)">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        <button class="btn-icon btn-icon-delete" title="Delete" @click="$emit('delete', task.id)">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Task } from '@/types'

const props = defineProps<{ task: Task }>()
// defineEmits<{
//   (e: 'edit', task: Task): void
//   (e: 'delete', id: number): void
// }>()
defineEmits<{
  (e: 'edit', task: Task): void
  (e: 'delete', id: string): void
}>()

const statusClass = computed(() => props.task.status)
const statusLabel = computed(() => {
  const map: Record<string, string> = {
    completed: 'Completed',
    'in-progress': 'In Progress',
    pending: 'Pending',
  }
  return map[props.task.status] ?? props.task.status
})

const categoryIcon = computed(() => {
  const icons: Record<string, string> = {
    development: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <polyline points="16 18 22 12 16 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <polyline points="8 6 2 12 8 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    career: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2"/>
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke="currentColor" stroke-width="2"/>
    </svg>`,
    learning: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="currentColor" stroke-width="2"/>
    </svg>`,
    devops: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2"/>
      <path d="M8 21h8M12 17v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
  }
  return icons[props.task.category] ?? icons.development
})
</script>

<style scoped>
.task-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  border-bottom: 1px solid var(--color-border);
  transition: background var(--transition);
}
.task-row:last-child {
  border-bottom: none;
}
.task-row:hover {
  background: #fafafa;
}

/* Icon */
.task-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.task-icon-wrap--development { background: #f0efff; color: var(--color-primary); }
.task-icon-wrap--career      { background: #fffbeb; color: #f59e0b; }
.task-icon-wrap--learning    { background: #ecfdf5; color: #10b981; }
.task-icon-wrap--devops      { background: #eff6ff; color: #3b82f6; }

/* Info */
.task-info {
  flex: 1;
  min-width: 0;
}
.task-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 3px;
}
.task-desc {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.task-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: var(--color-text-muted);
}
.meta-sep {
  color: var(--color-border);
  font-size: 0.75rem;
}

/* Actions */
.task-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}
.action-btns {
  display: flex;
  gap: 8px;
}

/* Badge dot */
.badge-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .task-row { flex-wrap: wrap; }
  .task-actions { width: 100%; justify-content: space-between; }
}
@media (max-width: 480px) {
  .task-icon-wrap { display: none; }
}
</style>
