<template>
  <div class="tree-item">
    <button
      class="tree-item-row"
      :class="{ 'is-active': isActive }"
      :style="{ paddingLeft: `${depth * 16 + 8}px` }"
      @click="$emit('select', document.id)"
    >
      <button
        class="tree-expand"
        :class="{ 'has-children': hasChildren, expanded: isExpanded }"
        @click.stop="toggleExpand"
      >
        <Icon v-if="hasChildren" name="lucide:chevron-right" size="14" />
      </button>
      <span class="tree-icon">{{ document.icon }}</span>
      <span class="tree-title">{{ document.title || 'Untitled' }}</span>
      <div class="tree-actions" @click.stop>
        <button class="tree-action-btn" @click="$emit('newChild', document.id)" title="Add sub-page">
          <Icon name="lucide:plus" size="14" />
        </button>
      </div>
    </button>

    <!-- Recursive children -->
    <div v-if="isExpanded && hasChildren" class="tree-children">
      <SidebarPageTreeItem
        v-for="child in document.children"
        :key="child.id"
        :document="child"
        :depth="depth + 1"
        @select="(id) => $emit('select', id)"
        @new-child="(id) => $emit('newChild', id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Document } from '~/stores/document'

const props = defineProps<{
  document: Document & { children?: Document[] }
  depth: number
}>()

defineEmits<{
  select: [id: string]
  newChild: [parentId: string]
}>()

const route = useRoute()
const isExpanded = ref(true)

const hasChildren = computed(() => {
  return props.document.children && props.document.children.length > 0
})

const isActive = computed(() => {
  return route.params.id === props.document.id
})

function toggleExpand() {
  if (hasChildren.value) {
    isExpanded.value = !isExpanded.value
  }
}
</script>

<style scoped>
.tree-item-row {
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-size: 0.88rem;
  color: var(--text-secondary);
  transition: all var(--transition-fast);
  cursor: pointer;
  border: none;
  background: none;
  text-align: left;
}

.tree-item-row:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.tree-item-row.is-active {
  background: var(--bg-active);
  color: var(--text-primary);
}

.tree-expand {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 3px;
  flex-shrink: 0;
  transition: transform var(--transition-fast);
  opacity: 0;
}

.tree-expand.has-children {
  opacity: 0.5;
}

.tree-item-row:hover .tree-expand.has-children {
  opacity: 1;
}

.tree-expand.expanded {
  transform: rotate(90deg);
}

.tree-icon {
  font-size: 1em;
  flex-shrink: 0;
  width: 20px;
  text-align: center;
}

.tree-title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tree-actions {
  display: flex;
  gap: 2px;
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.tree-item-row:hover .tree-actions {
  opacity: 1;
}

.tree-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 3px;
  color: var(--text-tertiary);
}

.tree-action-btn:hover {
  background: var(--bg-active);
  color: var(--text-primary);
}

.tree-children {
  position: relative;
}
</style>
