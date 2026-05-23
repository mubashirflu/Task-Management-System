
// import { defineStore } from 'pinia'
// import { ref, computed } from 'vue'

// import {
//   collection,
//   getDocs,
//   addDoc,
//   updateDoc,
//   deleteDoc,
//   doc
// } from "firebase/firestore"

// import { db } from "@/firebase"
// import type { Task, TaskCreatePayload, TaskStats } from '@/types'

// export const useTaskStore = defineStore('tasks', () => {

//   const tasks = ref<Task[]>([])
//   const loading = ref(false)
//   const error = ref<string | null>(null)

//   const searchQuery = ref('')
//   const statusFilter = ref<string>('all')
//   const currentPage = ref(1)
//   const perPage = ref(5)

//   // ───────────────────────── COMPUTED

//   const stats = computed<TaskStats>(() => ({
//     total: tasks.value.length,
//     completed: tasks.value.filter(t => t.status === 'completed').length,
//     inProgress: tasks.value.filter(t => t.status === 'in-progress').length,
//     pending: tasks.value.filter(t => t.status === 'pending').length,
//   }))

//   const filteredTasks = computed(() => {
//     let list = tasks.value

//     if (searchQuery.value.trim()) {
//       const q = searchQuery.value.toLowerCase()

//       list = list.filter(t =>
//         t.title.toLowerCase().includes(q) ||
//         t.description.toLowerCase().includes(q) ||
//         t.assignee.toLowerCase().includes(q)
//       )
//     }

//     if (statusFilter.value !== 'all') {
//       list = list.filter(t => t.status === statusFilter.value)
//     }

//     return list
//   })

//   const paginatedTasks = computed(() => {
//     const start = (currentPage.value - 1) * perPage.value
//     return filteredTasks.value.slice(start, start + perPage.value)
//   })

//   const totalPages = computed(() =>
//     Math.ceil(filteredTasks.value.length / perPage.value)
//   )

//   // ───────────────────────── FIREBASE ACTIONS

//   async function fetchTasks() {
//     loading.value = true
//     error.value = null

//     try {
//       const snap = await getDocs(collection(db, "tasks"))

//       tasks.value = snap.docs.map(d => ({
//         id: d.id,
//         ...(d.data() as Omit<Task, 'id'>)
//       }))

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
//       const now = new Date().toISOString()

//       const docRef = await addDoc(collection(db, "tasks"), {
//         ...payload,
//         createdAt: now,
//         updatedAt: now
//       })

//       const newTask: Task = {
//         id: docRef.id,
//         ...payload,
//         createdAt: now,
//         updatedAt: now
//       }

//       tasks.value.unshift(newTask)

//     } catch (e) {
//       error.value = 'Failed to create task.'
//       throw e
//     } finally {
//       loading.value = false
//     }
//   }

//   async function updateTask(id: string, payload: Partial<TaskCreatePayload>) {
//     loading.value = true
//     error.value = null

//     try {
//       const now = new Date().toISOString()

//       const taskRef = doc(db, "tasks", id)

//       await updateDoc(taskRef, {
//         ...payload,
//         updatedAt: now
//       })

//       const idx = tasks.value.findIndex(t => t.id === id)

//       if (idx !== -1) {
//         tasks.value[idx] = {
//           ...tasks.value[idx],
//           ...payload,
//           updatedAt: now
//         }
//       }

//     } catch (e) {
//       error.value = 'Failed to update task.'
//       throw e
//     } finally {
//       loading.value = false
//     }
//   }

//   async function deleteTask(id: string) {
//     loading.value = true
//     error.value = null

//     try {
//       await deleteDoc(doc(db, "tasks", id))
//       tasks.value = tasks.value.filter(t => t.id !== id)

//     } catch (e) {
//       error.value = 'Failed to delete task.'
//       throw e
//     } finally {
//       loading.value = false
//     }
//   }

//   // ───────────────────────── UI HELPERS

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
  doc,
  query,
  orderBy
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

  // ── COMPUTED ─────────────────────────────────────────────────────────

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

  // ── FETCH — har reload par Firebase se data aata hai ─────────────────

  async function fetchTasks() {
    loading.value = true
    error.value = null
    try {
      const q = query(collection(db, "tasks"), orderBy("createdAt", "desc"))
      const snap = await getDocs(q)
      tasks.value = snap.docs.map(d => ({
        id: d.id,
        ...(d.data() as Omit<Task, 'id'>)
      }))
    } catch (e) {
      error.value = 'Failed to fetch tasks.'
      console.error('fetchTasks error:', e)
    } finally {
      loading.value = false
    }
  }

  // ── CREATE — optimistic update ────────────────────────────────────────

  async function createTask(payload: TaskCreatePayload) {
    const now = new Date().toISOString()
    const tempId = `temp_${Date.now()}`

    // 1. Turant UI mein dikhao
    const optimisticTask: Task = { id: tempId, ...payload, createdAt: now, updatedAt: now }
    tasks.value.unshift(optimisticTask)

    try {
      // 2. Firebase mein save karo
      const docRef = await addDoc(collection(db, "tasks"), {
        ...payload, createdAt: now, updatedAt: now
      })
      // 3. Temp id replace karo real id se
      const idx = tasks.value.findIndex(t => t.id === tempId)
      if (idx !== -1) tasks.value[idx] = { ...optimisticTask, id: docRef.id }

    } catch (e) {
      // Firebase fail — UI se hata do
      tasks.value = tasks.value.filter(t => t.id !== tempId)
      error.value = 'Task save nahi hua. Dobara try karo.'
      console.error('createTask error:', e)
      throw e
    }
  }

  // ── UPDATE — optimistic ───────────────────────────────────────────────

  async function updateTask(id: string, payload: Partial<TaskCreatePayload>) {
    const now = new Date().toISOString()
    const idx = tasks.value.findIndex(t => t.id === id)
    const backup = idx !== -1 ? { ...tasks.value[idx] } : null

    if (idx !== -1) tasks.value[idx] = { ...tasks.value[idx], ...payload, updatedAt: now }

    try {
      await updateDoc(doc(db, "tasks", id), { ...payload, updatedAt: now })
    } catch (e) {
      if (backup && idx !== -1) tasks.value[idx] = backup
      error.value = 'Task update nahi hua. Dobara try karo.'
      console.error('updateTask error:', e)
      throw e
    }
  }

  // ── DELETE — optimistic ───────────────────────────────────────────────

  async function deleteTask(id: string) {
    const backup = [...tasks.value]
    tasks.value = tasks.value.filter(t => t.id !== id)

    try {
      await deleteDoc(doc(db, "tasks", id))
    } catch (e) {
      tasks.value = backup
      error.value = 'Task delete nahi hua. Dobara try karo.'
      console.error('deleteTask error:', e)
      throw e
    }
  }

  // ── UI HELPERS ────────────────────────────────────────────────────────

  function setSearch(q: string) { searchQuery.value = q; currentPage.value = 1 }
  function setFilter(status: string) { statusFilter.value = status; currentPage.value = 1 }
  function setPage(page: number) { currentPage.value = page }

  // ✅ Error auto clear — 3 second baad
  function clearError() { error.value = null }

  return {
    tasks, loading, error, searchQuery, statusFilter, currentPage, perPage,
    stats, filteredTasks, paginatedTasks, totalPages,
    fetchTasks, createTask, updateTask, deleteTask,
    setSearch, setFilter, setPage, clearError
  }
})