// import { defineStore } from 'pinia'
// import { ref, computed } from 'vue'
// import { taskService } from '@/composables/useApi'
// import type { Task, TaskCreatePayload, TaskStats } from '@/types'

// export const useTaskStore = defineStore('tasks', () => {
//   const tasks = ref<Task[]>([])
//   const loading = ref(false)
//   const error = ref<string | null>(null)
//   const searchQuery = ref('')
//   const statusFilter = ref<string>('all')
//   const currentPage = ref(1)
//   const perPage = ref(5)

//   const stats = computed<TaskStats>(() => ({
//     total: tasks.value.length,
//     completed: tasks.value.filter((t) => t.status === 'completed').length,
//     inProgress: tasks.value.filter((t) => t.status === 'in-progress').length,
//     pending: tasks.value.filter((t) => t.status === 'pending').length,
//   }))

//   const filteredTasks = computed(() => {
//     let list = tasks.value

//     if (searchQuery.value.trim()) {
//       const q = searchQuery.value.toLowerCase()
//       list = list.filter(
//         (t) =>
//           t.title.toLowerCase().includes(q) ||
//           t.description.toLowerCase().includes(q) ||
//           t.assignee.toLowerCase().includes(q),
//       )
//     }

//     if (statusFilter.value !== 'all') {
//       list = list.filter((t) => t.status === statusFilter.value)
//     }

//     return list
//   })

//   const paginatedTasks = computed(() => {
//     const start = (currentPage.value - 1) * perPage.value
//     return filteredTasks.value.slice(start, start + perPage.value)
//   })

//   const totalPages = computed(() =>
//     Math.ceil(filteredTasks.value.length / perPage.value),
//   )

//   async function fetchTasks() {
//     loading.value = true
//     error.value = null
//     try {
//       const { data } = await taskService.getAll()
//       tasks.value = data
//     } catch (e) {
//       error.value = 'Failed to fetch tasks.'
//       console.error(e)
//     } finally {
//       loading.value = false
//     }
//   }

//   async function createTask(payload: TaskCreatePayload) {
//     loading.value = true
//     error.value = null
//     try {
//       const { data } = await taskService.create(payload)
//       tasks.value.push(data)
//     } catch (e) {
//       error.value = 'Failed to create task.'
//       throw e
//     } finally {
//       loading.value = false
//     }
//   }

//   async function updateTask(id: number, payload: Partial<TaskCreatePayload>) {
//     loading.value = true
//     error.value = null
//     try {
//       const { data } = await taskService.update(id, payload)
//       const idx = tasks.value.findIndex((t) => t.id === id)
//       if (idx !== -1) tasks.value[idx] = data
//     } catch (e) {
//       error.value = 'Failed to update task.'
//       throw e
//     } finally {
//       loading.value = false
//     }
//   }

//   async function deleteTask(id: number) {
//     loading.value = true
//     error.value = null
//     try {
//       await taskService.delete(id)
//       tasks.value = tasks.value.filter((t) => t.id !== id)
//     } catch (e) {
//       error.value = 'Failed to delete task.'
//       throw e
//     } finally {
//       loading.value = false
//     }
//   }

//   function setSearch(q: string) {
//     searchQuery.value = q
//     currentPage.value = 1
//   }

//   function setFilter(status: string) {
//     statusFilter.value = status
//     currentPage.value = 1
//   }

//   function setPage(page: number) {
//     currentPage.value = page
//   }

//   return {
//     tasks,
//     loading,
//     error,
//     searchQuery,
//     statusFilter,
//     currentPage,
//     perPage,
//     stats,
//     filteredTasks,
//     paginatedTasks,
//     totalPages,
//     fetchTasks,
//     createTask,
//     updateTask,
//     deleteTask,
//     setSearch,
//     setFilter,
//     setPage,
//   }
// })

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore"

import { db } from "@/firebase"
import type { Task, TaskCreatePayload, TaskStats } from '@/types'

export const useTaskStore = defineStore('tasks', () => {

  const tasks = ref<Task[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const searchQuery = ref('')
  const statusFilter = ref<string>('all')
  const currentPage = ref(1)
  const perPage = ref(5)

  // ───────────────────────── COMPUTED

  const stats = computed<TaskStats>(() => ({
    total: tasks.value.length,
    completed: tasks.value.filter(t => t.status === 'completed').length,
    inProgress: tasks.value.filter(t => t.status === 'in-progress').length,
    pending: tasks.value.filter(t => t.status === 'pending').length,
  }))

  const filteredTasks = computed(() => {
    let list = tasks.value

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()

      list = list.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.assignee.toLowerCase().includes(q)
      )
    }

    if (statusFilter.value !== 'all') {
      list = list.filter(t => t.status === statusFilter.value)
    }

    return list
  })

  const paginatedTasks = computed(() => {
    const start = (currentPage.value - 1) * perPage.value
    return filteredTasks.value.slice(start, start + perPage.value)
  })

  const totalPages = computed(() =>
    Math.ceil(filteredTasks.value.length / perPage.value)
  )

  // ───────────────────────── FIREBASE ACTIONS

  async function fetchTasks() {
    loading.value = true
    error.value = null

    try {
      const snap = await getDocs(collection(db, "tasks"))

      tasks.value = snap.docs.map(d => ({
        id: d.id,
        ...(d.data() as Omit<Task, 'id'>)
      }))

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
      const now = new Date().toISOString()

      const docRef = await addDoc(collection(db, "tasks"), {
        ...payload,
        createdAt: now,
        updatedAt: now
      })

      const newTask: Task = {
        id: docRef.id,
        ...payload,
        createdAt: now,
        updatedAt: now
      }

      tasks.value.unshift(newTask)

    } catch (e) {
      error.value = 'Failed to create task.'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateTask(id: string, payload: Partial<TaskCreatePayload>) {
    loading.value = true
    error.value = null

    try {
      const now = new Date().toISOString()

      const taskRef = doc(db, "tasks", id)

      await updateDoc(taskRef, {
        ...payload,
        updatedAt: now
      })

      const idx = tasks.value.findIndex(t => t.id === id)

      if (idx !== -1) {
        tasks.value[idx] = {
          ...tasks.value[idx],
          ...payload,
          updatedAt: now
        }
      }

    } catch (e) {
      error.value = 'Failed to update task.'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteTask(id: string) {
    loading.value = true
    error.value = null

    try {
      await deleteDoc(doc(db, "tasks", id))
      tasks.value = tasks.value.filter(t => t.id !== id)

    } catch (e) {
      error.value = 'Failed to delete task.'
      throw e
    } finally {
      loading.value = false
    }
  }

  // ───────────────────────── UI HELPERS

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