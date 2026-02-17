<template>
  <div class="document-header">
    <div class="cover-placeholder" v-if="!coverUrl">
      <!-- Optional: add cover image functionality later -->
    </div>

    <div class="header-content">
      <button class="icon-picker" @click="pickIcon" :title="'Change icon'">
        {{ currentIcon }}
      </button>
      <input
        class="title-input"
        :value="title"
        @input="handleTitleChange"
        placeholder="Untitled"
        ref="titleInput"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  icon: string
  coverUrl?: string | null
}>()

const emit = defineEmits<{
  'update:title': [value: string]
  'update:icon': [value: string]
}>()

const currentIcon = computed(() => props.icon || '📄')
const titleInput = ref<HTMLInputElement>()

function handleTitleChange(e: Event) {
  const target = e.target as HTMLInputElement
  emit('update:title', target.value)
}

const icons = ['📄', '📝', '📋', '📌', '📎', '📊', '📈', '🎯', '💡', '🔥', '⭐', '🚀', '🎨', '🎵', '📸', '🏠', '💼', '🎮', '📚', '🔬', '🌟', '💎', '🍀', '🌈', '⚡', '🦋', '🐝', '🌸', '🎪', '🏆']

function pickIcon() {
  // Simple icon picker — cycle through icons
  const currentIndex = icons.indexOf(currentIcon.value)
  const nextIndex = (currentIndex + 1) % icons.length
  emit('update:icon', icons[nextIndex])
}
</script>

<style scoped>
.document-header {
  max-width: 900px;
  margin: 0 auto;
  padding: 4rem 1rem 1rem;
}

.header-content {
  display: flex;
  align-items: flex-start;
  gap: 4px;
}

.icon-picker {
  font-size: 3rem;
  line-height: 1;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: var(--radius-md);
  padding: 4px;
  transition: background var(--transition-fast);
  flex-shrink: 0;
}

.icon-picker:hover {
  background: var(--bg-hover);
}

.title-input {
  font-size: 2.2rem;
  font-weight: 700;
  border: none;
  outline: none;
  background: transparent;
  color: var(--text-primary);
  width: 100%;
  padding: 8px 0;
  line-height: 1.2;
  font-family: inherit;
}

.title-input::placeholder {
  color: var(--text-tertiary);
}
</style>
