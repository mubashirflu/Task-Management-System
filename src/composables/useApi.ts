import axios from 'axios'
import type { Task, TaskCreatePayload, User, Category } from '@/types'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// ── Tasks ──────────────────────────────────────────────────────────────────
export const taskService = {
  getAll: () => api.get<Task[]>('/tasks'),

  getById: (id: number) => api.get<Task>(`/tasks/${id}`),

  create: (payload: TaskCreatePayload) =>
    api.post<Task>('/tasks', {
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),

  update: (id: number, payload: Partial<TaskCreatePayload>) =>
    api.patch<Task>(`/tasks/${id}`, {
      ...payload,
      updatedAt: new Date().toISOString(),
    }),

  delete: (id: number) => api.delete(`/tasks/${id}`),
}

// ── Users ──────────────────────────────────────────────────────────────────
export const userService = {
  getAll: () => api.get<User[]>('/users'),
  getById: (id: number) => api.get<User>(`/users/${id}`),
}

// ── Categories ─────────────────────────────────────────────────────────────
export const categoryService = {
  getAll: () => api.get<Category[]>('/categories'),
}
