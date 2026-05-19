<template>
  <div class="dashboard">
    <!-- Stats Grid -->
    <div class="stats-grid">
      <StatsCard
        label="Total Tasks"
        :value="stats.total"
        sub="All tasks available"
        :icon="icons.total"
        icon-bg="#ede9fe"
      />
      <StatsCard
        label="Completed"
        :value="stats.completed"
        sub="Tasks completed"
        :icon="icons.completed"
        icon-bg="#dcfce7"
      />
      <StatsCard
        label="In Progress"
        :value="stats.inProgress"
        sub="Tasks in progress"
        :icon="icons.inProgress"
        icon-bg="#fef9c3"
      />
      <StatsCard
        label="Pending"
        :value="stats.pending"
        sub="Tasks pending"
        :icon="icons.pending"
        icon-bg="#fee2e2"
      />
    </div>

    <!-- Task Table Card -->
    <div class="task-table-card card">
      <!-- Table Header -->
      <div class="table-header">
        <h2 class="table-title">All Tasks</h2>
        <div class="table-actions">
          <!-- Filter -->
          <div class="filter-dropdown" ref="filterRef">
            <button class="btn btn-outline" @click="filterOpen = !filterOpen">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Filter
            </button>
            <Transition name="fade">
              <div v-if="filterOpen" class="dropdown-menu">
                <button
                  v-for="opt in filterOptions"
                  :key="opt.value"
                  class="dropdown-item"
                  :class="{ active: store.statusFilter === opt.value }"
                  @click="applyFilter(opt.value)"
                >
                  {{ opt.label }}
                </button>
              </div>
            </Transition>
          </div>

          <!-- Sort -->
          <button class="btn btn-outline">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M7 12h10M11 18h2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Sort
          </button>

          <!-- Add Task -->
          <button class="btn btn-primary" @click="openModal(null)">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Add Task
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="store.loading" class="table-loading">
        <div class="spinner" />
      </div>

      <!-- Empty -->
      <div v-else-if="store.paginatedTasks.length === 0" class="table-empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style="color: var(--color-text-muted)">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="currentColor" stroke-width="1.5"/>
          <rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        <p>No tasks found</p>
      </div>

      <!-- Task List -->
      <TransitionGroup v-else name="fade" tag="div" class="task-list">
        <TaskRow
          v-for="task in store.paginatedTasks"
          :key="task.id"
          :task="task"
          @edit="openModal($event)"
          @delete="openConfirm($event)"
        />
      </TransitionGroup>

      <!-- Pagination -->
      <AppPagination
        :current-page="store.currentPage"
        :total-pages="store.totalPages"
        :total="store.filteredTasks.length"
        :per-page="store.perPage"
        @change="store.setPage($event)"
      />
    </div>

    <!-- Modals -->
    <TaskModal
      v-model="modalOpen"
      :task="editingTask"
      :loading="store.loading"
      @submit="handleSubmit"
    />
    <ConfirmModal
      v-model="confirmOpen"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import StatsCard from '@/components/dashboard/StatsCard.vue'
import TaskRow from '@/components/tasks/TaskRow.vue'
import TaskModal from '@/components/tasks/TaskModal.vue'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
import AppPagination from '@/components/ui/AppPagination.vue'
import type { Task, TaskCreatePayload } from '@/types'

const store = useTaskStore()
const stats = store.stats

// Fetch on mount
onMounted(() => store.fetchTasks())

// ── Modal state ──────────────────────────────────────────────────────────
const modalOpen   = ref(false)
const editingTask = ref<Task | null>(null)
const confirmOpen = ref(false)
const deletingId  = ref<number | null>(null)

function openModal(task: Task | null) {
  editingTask.value = task
  modalOpen.value = true
}

function openConfirm(id: number) {
  deletingId.value = id
  confirmOpen.value = true
}

async function handleSubmit(payload: TaskCreatePayload) {
  if (editingTask.value) {
    await store.updateTask(editingTask.value.id, payload)
  } else {
    await store.createTask(payload)
  }
  modalOpen.value = false
}

async function handleDelete() {
  if (deletingId.value) await store.deleteTask(deletingId.value)
  confirmOpen.value = false
  deletingId.value = null
}

// ── Filter dropdown ──────────────────────────────────────────────────────
const filterOpen = ref(false)
const filterRef = ref<HTMLElement | null>(null)

const filterOptions = [
  { value: 'all', label: 'All' },
  { value: 'completed', label: 'Completed' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'pending', label: 'Pending' },
]

function applyFilter(v: string) {
  store.setFilter(v)
  filterOpen.value = false
}

function handleOutsideClick(e: MouseEvent) {
  if (filterRef.value && !filterRef.value.contains(e.target as Node)) {
    filterOpen.value = false
  }
}
onMounted(() => document.addEventListener('click', handleOutsideClick))
onBeforeUnmount(() => document.removeEventListener('click', handleOutsideClick))

// ── Static icons for stat cards ──────────────────────────────────────────
const icons = {
  total: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="#6c63ff" stroke-width="2" stroke-linecap="round"/>
    <rect x="9" y="3" width="6" height="4" rx="1" stroke="#6c63ff" stroke-width="2"/>
    <path d="M9 12h6M9 16h4" stroke="#6c63ff" stroke-width="2" stroke-linecap="round"/>
  </svg>`,
  completed: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="#10b981" stroke-width="2"/>
    <path d="M8 12l3 3 5-5" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  inProgress: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="#f59e0b" stroke-width="2"/>
    <path d="M12 6v6l4 2" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/>
  </svg>`,
  pending: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="18" rx="2" stroke="#ef4444" stroke-width="2"/>
    <path d="M16 2v4M8 2v4M3 10h18" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/>
  </svg>`,
}
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

/* Table */
.task-table-card {
  overflow: hidden;
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.table-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.table-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

/* Filter dropdown */
.filter-dropdown {
  position: relative;
}
.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-md);
  z-index: 100;
  min-width: 140px;
  overflow: hidden;
}
.dropdown-item {
  display: block;
  width: 100%;
  padding: 10px 16px;
  text-align: left;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  transition: background var(--transition);
}
.dropdown-item:hover,
.dropdown-item.active {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

/* Loading / empty */
.table-loading,
.table-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 60px 20px;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.task-list {
  position: relative;
}

/* Responsive */
@media (max-width: 1100px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .stats-grid { grid-template-columns: 1fr 1fr; }
  .table-actions .btn span { display: none; }
}
@media (max-width: 400px) {
  .stats-grid { grid-template-columns: 1fr; }
}
</style>
