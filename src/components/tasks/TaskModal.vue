<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-backdrop" @click.self="$emit('update:modelValue', false)">
        <div class="modal-box card">
          <!-- Header -->
          <div class="modal-header">
            <h2>{{ isEdit ? 'Edit Task' : 'Add New Task' }}</h2>
            <button class="modal-close" @click="$emit('update:modelValue', false)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>

          <!-- Form -->
          <form class="modal-form" @submit.prevent="submit">
            <div class="form-row">
              <div class="form-group">
                <label>Title *</label>
                <input v-model="form.title" class="form-control" type="text" placeholder="Task title" required />
              </div>
            </div>

            <div class="form-group">
              <label>Description *</label>
              <textarea v-model="form.description" class="form-control" rows="3" placeholder="Task description" required />
            </div>

            <div class="form-row two-cols">
              <div class="form-group">
                <label>Status *</label>
                <select v-model="form.status" class="form-control" required>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div class="form-group">
                <label>Category *</label>
                <select v-model="form.category" class="form-control" required>
                  <option value="development">Development</option>
                  <option value="career">Career</option>
                  <option value="learning">Learning</option>
                  <option value="devops">DevOps</option>
                </select>
              </div>
            </div>

            <div class="form-row two-cols">
              <div class="form-group">
                <label>Assignee</label>
                <input v-model="form.assignee" class="form-control" type="text" placeholder="Name" />
              </div>
              <div class="form-group">
                <label>Country</label>
                <input v-model="form.country" class="form-control" type="text" placeholder="Country" />
              </div>
            </div>

            <div class="form-group">
              <label>Age</label>
              <input v-model.number="form.age" class="form-control" type="number" placeholder="Age (optional)" min="1" />
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-outline" @click="$emit('update:modelValue', false)">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" :disabled="loading">
                <span v-if="loading" class="btn-spinner" />
                {{ isEdit ? 'Save Changes' : 'Add Task' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Task, TaskCreatePayload, TaskStatus, TaskCategory } from '@/types'

const props = defineProps<{
  modelValue: boolean
  task?: Task | null
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'submit', payload: TaskCreatePayload): void
}>()

const isEdit = ref(false)

const defaultForm = (): TaskCreatePayload => ({
  title: '',
  description: '',
  status: 'pending' as TaskStatus,
  category: 'development' as TaskCategory,
  assignee: 'Muhammad Mubashir',
  country: 'Pakistan',
  age: null,
})

const form = ref<TaskCreatePayload>(defaultForm())

watch(
  () => props.task,
  (t) => {
    if (t) {
      isEdit.value = true
      form.value = {
        title: t.title,
        description: t.description,
        status: t.status,
        category: t.category,
        assignee: t.assignee,
        country: t.country,
        age: t.age,
      }
    } else {
      isEdit.value = false
      form.value = defaultForm()
    }
  },
  { immediate: true },
)

watch(
  () => props.modelValue,
  (open) => {
    if (!open && !props.task) form.value = defaultForm()
  },
)

function submit() {
  emit('submit', { ...form.value })
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-box {
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 24px 16px;
  border-bottom: 1px solid var(--color-border);
}
.modal-header h2 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text-primary);
}
.modal-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  transition: all var(--transition);
}
.modal-close:hover {
  background: #f0f0f0;
  color: var(--color-text-primary);
}

.modal-form {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.form-group label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text-secondary);
}
.form-control {
  resize: vertical;
}

.form-row.two-cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 6px;
}

.btn-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  display: inline-block;
}

/* Transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active .modal-box,
.modal-leave-active .modal-box {
  transition: transform 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal-box,
.modal-leave-to .modal-box {
  transform: scale(0.96) translateY(10px);
}

@media (max-width: 480px) {
  .form-row.two-cols { grid-template-columns: 1fr; }
}
</style>
