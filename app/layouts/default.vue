<template>
  <div class="layout-default">
    <Sidebar />
    <main class="layout-main" :class="{ 'sidebar-collapsed': !sidebarOpen }">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const sidebarOpen = useState('sidebarOpen', () => true)
</script>

<style scoped>
.layout-default {
  display: flex;
  min-height: 100vh;
}

.layout-main {
  flex: 1;
  min-width: 0;
  margin-left: var(--sidebar-width);
  transition: margin-left var(--transition-normal);
}

.layout-main.sidebar-collapsed {
  margin-left: 0;
}

@media (max-width: 768px) {
  .layout-main {
    margin-left: 0;
  }
}
</style>
