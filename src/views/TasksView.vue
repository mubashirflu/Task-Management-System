<template>
  <div class="tasks-view">
    <div class="page-header">
      <div>
        <h1 class="page-title">All Tasks</h1>
        <p class="page-sub">Manage and track all your tasks</p>
      </div>
      <button class="btn btn-primary" @click="openModal(null)">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        Add Task
      </button>
    </div>

    <!-- Filter Tabs -->
    <div class="filter-tabs card">
      <button
        v-for="opt in filterOptions"
        :key="opt.value"
        class="filter-tab"
        :class="{ active: store.statusFilter === opt.value }"
        @click="store.setFilter(opt.value)"
      >
        {{ opt.label }}
        <span class="filter-tab-count">{{ opt.count }}</span>
      </button>
    </div>

    <!-- Task List -->
    <div class="task-table-card card">
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
        <TaskRow
          v-for="task in store.paginatedTasks"
          :key="task.id"
          :task="task"
          @edit="openModal($event)"
          @delete="openConfirm($event)"
        />
      </TransitionGroup>

      <AppPagination
        :current-page="store.currentPage"
        :total-pages="store.totalPages"
        :total="store.filteredTasks.length"
        :per-page="store.perPage"
        @change="store.setPage($event)"
      />
    </div>

    <TaskModal v-model="modalOpen" :task="editingTask" :loading="store.loading" @submit="handleSubmit" />
    <ConfirmModal v-model="confirmOpen" @confirm="handleDelete" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTaskStore } from '@/stores/taskStore'
import TaskRow from '@/components/tasks/TaskRow.vue'
import TaskModal from '@/components/tasks/TaskModal.vue'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
import AppPagination from '@/components/ui/AppPagination.vue'
import type { Task, TaskCreatePayload } from '@/types'

const store = useTaskStore()
const route = useRoute()

onMounted(() => {
  store.fetchTasks()
  if (route.query.action === 'add') openModal(null)
})

const filterOptions = computed(() => [
  { value: 'all', label: 'All', count: store.tasks.length },
  { value: 'completed', label: 'Completed', count: store.stats.completed },
  { value: 'in-progress', label: 'In Progress', count: store.stats.inProgress },
  { value: 'pending', label: 'Pending', count: store.stats.pending },
])

const modalOpen = ref(false)
const editingTask = ref<Task | null>(null)
const confirmOpen = ref(false)
const deletingId = ref<number | null>(null)

function openModal(task: Task | null) {
  editingTask.value = task
  modalOpen.value = true
}
function openConfirm(id: number) {
  deletingId.value = id
  confirmOpen.value = true
}
async function handleSubmit(payload: TaskCreatePayload) {
  if (editingTask.value) await store.updateTask(editingTask.value.id, payload)
  else await store.createTask(payload)
  modalOpen.value = false
}
async function handleDelete() {
  if (deletingId.value) await store.deleteTask(deletingId.value)
  confirmOpen.value = false
  deletingId.value = null
}
</script>

<style scoped>
.tasks-view { display: flex; flex-direction: column; gap: 20px; }

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}
.page-title { font-size: 1.4rem; font-weight: 800; color: var(--color-text-primary); }
.page-sub { font-size: 0.85rem; color: var(--color-text-secondary); margin-top: 2px; }

.filter-tabs {
  display: flex;
  gap: 4px;
  padding: 8px;
  flex-wrap: wrap;
}
.filter-tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  transition: all var(--transition);
}
.filter-tab:hover { background: var(--color-body-bg); }
.filter-tab.active { background: var(--color-primary); color: #fff; }
.filter-tab-count {
  background: rgba(0,0,0,0.08);
  border-radius: 99px;
  padding: 1px 7px;
  font-size: 0.72rem;
}
.filter-tab.active .filter-tab-count { background: rgba(255,255,255,0.25); }

.task-table-card { overflow: hidden; }
.table-loading, .table-empty {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 12px; padding: 60px 20px;
  color: var(--color-text-muted); font-size: 0.875rem;
}
</style>
