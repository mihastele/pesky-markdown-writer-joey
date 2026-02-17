<template>
  <div
    class="slash-menu"
    :style="menuStyle"
    ref="menuRef"
  >
    <button
      v-for="(item, index) in items"
      :key="item.title"
      class="slash-menu-item"
      :class="{ 'is-selected': index === selectedIndex }"
      @click="$emit('select', item)"
      @mouseenter="hoveredIndex = index"
    >
      <div class="slash-menu-item-icon">{{ item.icon }}</div>
      <div class="slash-menu-item-content">
        <span class="slash-menu-item-title">{{ item.title }}</span>
        <span class="slash-menu-item-description">{{ item.description }}</span>
      </div>
    </button>
    <div v-if="items.length === 0" class="slash-menu-empty">
      No results found
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  items: Array<{
    title: string
    description: string
    icon: string
    command: (editor: any) => void
  }>
  selectedIndex: number
  position: { top: number; left: number }
}>()

defineEmits<{
  select: [item: typeof props.items[0]]
}>()

const hoveredIndex = ref(-1)
const menuRef = ref<HTMLElement | null>(null)

const menuStyle = computed(() => ({
  position: 'fixed' as const,
  top: `${props.position.top}px`,
  left: `${props.position.left}px`,
  zIndex: 100,
}))

// Scroll selected item into view
watch(() => props.selectedIndex, (idx) => {
  if (!menuRef.value) return
  const items = menuRef.value.querySelectorAll('.slash-menu-item')
  items[idx]?.scrollIntoView({ block: 'nearest' })
})
</script>

<style scoped>
.slash-menu-empty {
  padding: 12px 16px;
  color: var(--text-tertiary);
  font-size: 0.85rem;
  text-align: center;
}
</style>
