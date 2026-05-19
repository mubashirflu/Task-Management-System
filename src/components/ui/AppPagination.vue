<template>
  <div class="pagination-wrap">
    <p class="pagination-info">
      Showing {{ from }} to {{ to }} of {{ total }} tasks
    </p>
    <div class="pagination-controls">
      <button
        class="page-btn"
        :disabled="currentPage <= 1"
        @click="$emit('change', currentPage - 1)"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>

      <button
        v-for="page in pages"
        :key="page"
        class="page-btn"
        :class="{ active: page === currentPage }"
        @click="$emit('change', page)"
      >
        {{ page }}
      </button>

      <button
        class="page-btn"
        :disabled="currentPage >= totalPages"
        @click="$emit('change', currentPage + 1)"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  currentPage: number
  totalPages: number
  total: number
  perPage: number
}>()
defineEmits<{ (e: 'change', page: number): void }>()

const from = computed(() => Math.min((props.currentPage - 1) * props.perPage + 1, props.total))
const to   = computed(() => Math.min(props.currentPage * props.perPage, props.total))

const pages = computed(() => {
  const p: number[] = []
  for (let i = 1; i <= props.totalPages; i++) p.push(i)
  return p
})
</script>

<style scoped>
.pagination-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-top: 1px solid var(--color-border);
  flex-wrap: wrap;
  gap: 12px;
}
.pagination-info {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}
.pagination-controls {
  display: flex;
  align-items: center;
  gap: 6px;
}
.page-btn {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  border: 1.5px solid var(--color-border);
  background: #fff;
  transition: all var(--transition);
}
.page-btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: var(--color-primary-light);
}
.page-btn.active {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}
.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
