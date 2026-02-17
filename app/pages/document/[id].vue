<template>
  <div class="document-page">
    <DocumentDocumentHeader
      v-if="doc"
      :title="doc.title"
      :icon="doc.icon"
      :cover-url="doc.cover_url"
      @update:title="handleTitleUpdate"
      @update:icon="handleIconUpdate"
    />
    <EditorTiptapEditor
      v-if="doc"
      :model-value="doc.content"
      @update:model-value="handleContentUpdate"
    />
    <div v-else class="not-found">
      <Icon name="lucide:file-question" size="48" />
      <h2>Document not found</h2>
      <p>This document doesn't exist or has been deleted.</p>
      <NuxtLink to="/" class="btn btn-primary" style="max-width: 180px; margin-top: 1rem;">
        Go Home
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const documentStore = useDocumentStore()

const docId = computed(() => route.params.id as string)

const doc = computed(() => {
  return documentStore.documents.find(d => d.id === docId.value) || null
})

// Debounced save
let saveTimeout: ReturnType<typeof setTimeout> | null = null

function handleContentUpdate(content: object) {
  if (!docId.value) return
  documentStore.updateLocalDocument(docId.value, { content })

  // Debounced save to Supabase (when connected)
  if (saveTimeout) clearTimeout(saveTimeout)
  saveTimeout = setTimeout(() => {
    // documentStore.updateDocument(docId.value, { content })
  }, 1000)
}

function handleTitleUpdate(title: string) {
  if (!docId.value) return
  documentStore.updateLocalDocument(docId.value, { title })
}

function handleIconUpdate(icon: string) {
  if (!docId.value) return
  documentStore.updateLocalDocument(docId.value, { icon })
}

// Set current document
watch(doc, (val) => {
  documentStore.currentDocument = val
}, { immediate: true })

useHead({
  title: computed(() => doc.value?.title ? `${doc.value.title} — Pesky Writer` : 'Pesky Writer'),
})
</script>

<style scoped>
.document-page {
  min-height: 100vh;
  padding-bottom: 6rem;
}

.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  color: var(--text-secondary);
  gap: 0.5rem;
}

.not-found h2 {
  color: var(--text-primary);
}
</style>
