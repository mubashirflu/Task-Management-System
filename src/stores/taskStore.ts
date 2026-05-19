import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { taskService } from '@/composables/useApi'
import type { Task, TaskCreatePayload, TaskStats } from '@/types'

export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')
  const statusFilter = ref<string>('all')
  const currentPage = ref(1)
  const perPage = ref(5)

  // ── Computed ─────────────────────────────────────────────────────────────
  const stats = computed<TaskStats>(() => ({
    total: tasks.value.length,
    completed: tasks.value.filter((t) => t.status === 'completed').length,
    inProgress: tasks.value.filter((t) => t.status === 'in-progress').length,
    pending: tasks.value.filter((t) => t.status === 'pending').length,
  }))

  const filteredTasks = computed(() => {
    let list = tasks.value

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.assignee.toLowerCase().includes(q),
      )
    }

    if (statusFilter.value !== 'all') {
      list = list.filter((t) => t.status === statusFilter.value)
    }

    return list
  })

  const paginatedTasks = computed(() => {
    const start = (currentPage.value - 1) * perPage.value
    return filteredTasks.value.slice(start, start + perPage.value)
  })

  const totalPages = computed(() =>
    Math.ceil(filteredTasks.value.length / perPage.value),
  )

  // ── Actions ───────────────────────────────────────────────────────────────
  async function fetchTasks() {
    loading.value = true
    error.value = null
    try {
      const { data } = await taskService.getAll()
      tasks.value = data
    } catch (e) {
      error.value = 'Failed to fetch tasks.'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  async function createTask(payload: TaskCreatePayload) {
    loading.value = true
    error.value = null
    try {
      const { data } = await taskService.create(payload)
      tasks.value.push(data)
    } catch (e) {
      error.value = 'Failed to create task.'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateTask(id: number, payload: Partial<TaskCreatePayload>) {
    loading.value = true
    error.value = null
    try {
      const { data } = await taskService.update(id, payload)
      const idx = tasks.value.findIndex((t) => t.id === id)
      if (idx !== -1) tasks.value[idx] = data
    } catch (e) {
      error.value = 'Failed to update task.'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteTask(id: number) {
    loading.value = true
    error.value = null
    try {
      await taskService.delete(id)
      tasks.value = tasks.value.filter((t) => t.id !== id)
    } catch (e) {
      error.value = 'Failed to delete task.'
      throw e
    } finally {
      loading.value = false
    }
  }

  function setSearch(q: string) {
    searchQuery.value = q
    currentPage.value = 1
  }

  function setFilter(status: string) {
    statusFilter.value = status
    currentPage.value = 1
  }

  function setPage(page: number) {
    currentPage.value = page
  }

  return {
    tasks,
    loading,
    error,
    searchQuery,
    statusFilter,
    currentPage,
    perPage,
    stats,
    filteredTasks,
    paginatedTasks,
    totalPages,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    setSearch,
    setFilter,
    setPage,
  }
})
