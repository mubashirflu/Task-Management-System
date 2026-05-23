<template>
  <div class="dashboard">
    <!-- Stats Grid -->
    <div class="stats-grid">
      <StatsCard label="Total Tasks"  :value="store.stats.total"      sub="All tasks available"  :icon="icons.total"      icon-bg="#ede9fe" />
      <StatsCard label="Completed"    :value="store.stats.completed"   sub="Tasks completed"      :icon="icons.completed"  icon-bg="#dcfce7" />
      <StatsCard label="In Progress"  :value="store.stats.inProgress"  sub="Tasks in progress"    :icon="icons.inProgress" icon-bg="#fef9c3" />
      <StatsCard label="Pending"      :value="store.stats.pending"     sub="Tasks pending"        :icon="icons.pending"    icon-bg="#fee2e2" />
    </div>

    <!-- Task Table Card -->
    <div class="task-table-card card">
      <div class="table-header">
        <h2 class="table-title">All Tasks</h2>
        <div class="table-actions">
          <div class="filter-dropdown" ref="filterRef">
            <button class="btn btn-outline" @click="filterOpen = !filterOpen">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Filter
            </button>
            <Transition name="fade">
              <div v-if="filterOpen" class="dropdown-menu">
                <button v-for="opt in filterOptions" :key="opt.value" class="dropdown-item"
                  :class="{ active: store.statusFilter === opt.value }" @click="applyFilter(opt.value)">
                  {{ opt.label }}
                </button>
              </div>
            </Transition>
          </div>
          <button class="btn btn-outline">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M7 12h10M11 18h2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Sort
          </button>
          <button class="btn btn-primary" @click="openModal(null)">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Add Task
          </button>
        </div>
      </div>

      <div v-if="store.loading" class="table-loading">
        <div class="spinner" />
      </div>
      <div v-else-if="store.paginatedTasks.length === 0" class="table-empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style="color: var(--color-text-muted)">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="currentColor" stroke-width="1.5"/>
          <rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        <p>No tasks found</p>
      </div>
      <TransitionGroup v-else name="fade" tag="div" class="task-list">
        <TaskRow v-for="task in store.paginatedTasks" :key="task.id" :task="task"
          @edit="openModal($event)" @delete="openConfirm($event)" />
      </TransitionGroup>

      <AppPagination :current-page="store.currentPage" :total-pages="store.totalPages"
        :total="store.filteredTasks.length" :per-page="store.perPage" @change="store.setPage($event)" />
    </div>

    <!-- Error Toast -->
    <Transition name="fade">
      <div v-if="store.error" class="error-toast">⚠️ {{ store.error }}</div>
    </Transition>

    <TaskModal v-model="modalOpen" :task="editingTask" :loading="false" @submit="handleSubmit" />
    <ConfirmModal v-model="confirmOpen" @confirm="handleDelete" />
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
onMounted(() => store.fetchTasks())

const modalOpen   = ref(false)
const editingTask = ref<Task | null>(null)
const confirmOpen = ref(false)
const deletingId  = ref<string | null>(null)

function openModal(task: Task | null) {
  editingTask.value = task
  modalOpen.value = true
}

function openConfirm(id: string) {
  deletingId.value = id
  confirmOpen.value = true
}

// ✅ Modal TURANT band hoga — optimistic update se task list instantly update hogi
async function handleSubmit(payload: TaskCreatePayload) {
  const isEdit = !!editingTask.value
  const editId = editingTask.value?.id ?? null

  modalOpen.value = false   // ← pehle band karo
  editingTask.value = null

  try {
    if (isEdit && editId) {
      await store.updateTask(editId, payload)
    } else {
      await store.createTask(payload)
    }
  } catch {
    // error toast automatically dikhega store.error se
  }
}

// ✅ Confirm modal TURANT band hoga
async function handleDelete() {
  const id = deletingId.value
  confirmOpen.value = false  // ← pehle band karo
  deletingId.value = null
  if (id) {
    try { await store.deleteTask(id) } catch { }
  }
}

const filterOpen = ref(false)
const filterRef = ref<HTMLElement | null>(null)
const filterOptions = [
  { value: 'all', label: 'All' },
  { value: 'completed', label: 'Completed' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'pending', label: 'Pending' },
]
function applyFilter(v: string) { store.setFilter(v); filterOpen.value = false }
function handleOutsideClick(e: MouseEvent) {
  if (filterRef.value && !filterRef.value.contains(e.target as Node)) filterOpen.value = false
}
onMounted(() => document.addEventListener('click', handleOutsideClick))
onBeforeUnmount(() => document.removeEventListener('click', handleOutsideClick))

const icons = {
  total: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="#6c63ff" stroke-width="2" stroke-linecap="round"/><rect x="9" y="3" width="6" height="4" rx="1" stroke="#6c63ff" stroke-width="2"/><path d="M9 12h6M9 16h4" stroke="#6c63ff" stroke-width="2" stroke-linecap="round"/></svg>`,
  completed: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#10b981" stroke-width="2"/><path d="M8 12l3 3 5-5" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  inProgress: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#f59e0b" stroke-width="2"/><path d="M12 6v6l4 2" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/></svg>`,
  pending: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="#ef4444" stroke-width="2"/><path d="M16 2v4M8 2v4M3 10h18" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/></svg>`,
}
</script>

<style scoped>
.dashboard { display: flex; flex-direction: column; gap: 24px; }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.task-table-card { overflow: hidden; }
.table-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 20px 16px; flex-wrap: wrap; gap: 12px; }
.table-title { font-size: 1.05rem; font-weight: 700; color: var(--color-text-primary); }
.table-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.filter-dropdown { position: relative; }
.dropdown-menu { position: absolute; top: calc(100% + 8px); left: 0; background: #fff; border: 1px solid var(--color-border); border-radius: var(--radius-sm); box-shadow: var(--shadow-md); z-index: 100; min-width: 140px; overflow: hidden; }
.dropdown-item { display: block; width: 100%; padding: 10px 16px; text-align: left; font-size: 0.85rem; color: var(--color-text-secondary); transition: background var(--transition); }
.dropdown-item:hover, .dropdown-item.active { background: var(--color-primary-light); color: var(--color-primary); }
.table-loading, .table-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 60px 20px; color: var(--color-text-muted); font-size: 0.875rem; }
.task-list { position: relative; }
.error-toast { position: fixed; bottom: 24px; right: 24px; background: #fee2e2; color: #dc2626; border: 1px solid #fca5a5; border-radius: var(--radius-sm); padding: 12px 20px; font-size: 0.875rem; font-weight: 500; z-index: 999; box-shadow: var(--shadow-md); }
@media (max-width: 1100px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px)  { .stats-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 400px)  { .stats-grid { grid-template-columns: 1fr; } }
</style>