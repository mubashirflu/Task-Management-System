<template>
  <div class="stats-card card">
    <div class="stats-icon" :style="{ background: iconBg }">
      <span v-html="icon" />
    </div>
    <div class="stats-info">
      <p class="stats-label">{{ label }}</p>
      <h2 class="stats-value">{{ value }}</h2>
      <p class="stats-sub">{{ sub }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: number
  sub: string
  icon: string
  iconBg: string
}>()
</script>

<style scoped>
.stats-card {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 22px 20px;
  transition: box-shadow var(--transition), transform var(--transition);
}
.stats-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.stats-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stats-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 4px;
}

.stats-value {
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-text-primary);
  line-height: 1;
  margin-bottom: 4px;
}

.stats-sub {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}
</style>
