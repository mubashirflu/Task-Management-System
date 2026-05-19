<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-backdrop" @click.self="$emit('update:modelValue', false)">
        <div class="confirm-box card">
          <div class="confirm-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#ef4444" stroke-width="2"/>
              <path d="M12 8v4M12 16h.01" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <h3>Delete Task</h3>
          <p>Are you sure you want to delete this task? This action cannot be undone.</p>
          <div class="confirm-actions">
            <button class="btn btn-outline" @click="$emit('update:modelValue', false)">Cancel</button>
            <button class="btn btn-danger" @click="$emit('confirm')">Delete</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{ modelValue: boolean }>()
defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'confirm'): void
}>()
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}
.confirm-box {
  width: 100%;
  max-width: 380px;
  padding: 32px 28px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.confirm-icon {
  width: 60px;
  height: 60px;
  background: #fff0f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.confirm-box h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text-primary);
}
.confirm-box p {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
}
.confirm-actions {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}
.btn-danger {
  background: #ef4444;
  color: #fff;
  padding: 10px 20px;
  border-radius: var(--radius-sm);
  font-weight: 600;
  font-size: 0.875rem;
  display: inline-flex;
  transition: all var(--transition);
}
.btn-danger:hover {
  background: #dc2626;
  box-shadow: 0 4px 14px rgba(239, 68, 68, 0.4);
}
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
