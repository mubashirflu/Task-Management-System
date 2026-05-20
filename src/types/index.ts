export type TaskStatus = 'completed' | 'in-progress' | 'pending'
export type TaskCategory = 'development' | 'career' | 'learning' | 'devops'

export interface Task {
  // id: number
  id:string,
  title: string
  description: string
  status: TaskStatus
  category: TaskCategory
  assignee: string
  country: string
  age: number | null
  createdAt: string
  updatedAt: string
}

export interface TaskCreatePayload {
  title: string
  description: string
  status: TaskStatus
  category: TaskCategory
  assignee: string
  country: string
  age: number | null
}

export interface User {
  // id: number
  id:string,
  name: string
  email: string
  avatar: string
  country: string
  age: number
  role: string
}

export interface Category {
  // id: number
  id:string,
  name: string
  slug: string
  color: string
}

export interface TaskStats {
  total: number
  completed: number
  inProgress: number
  pending: number
}

export interface PaginationMeta {
  currentPage: number
  perPage: number
  total: number
  totalPages: number
}
