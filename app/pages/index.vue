<template>
  <div class="home-page">
    <div class="home-content">
      <div class="home-hero">
        <span class="hero-icon">🐝</span>
        <h1>Pesky Markdown Writer</h1>
        <p class="hero-subtitle">A beautiful, Notion-like collaborative editor</p>
      </div>

      <div class="home-actions">
        <div class="recent-pages" v-if="recentDocs.length > 0">
          <h3>Recent Pages</h3>
          <div class="page-grid">
            <button
              v-for="doc in recentDocs"
              :key="doc.id"
              class="page-card"
              @click="navigateTo(`/document/${doc.id}`)"
            >
              <span class="page-card-icon">{{ doc.icon }}</span>
              <span class="page-card-title">{{ doc.title || 'Untitled' }}</span>
              <span class="page-card-date">{{ formatDate(doc.updated_at) }}</span>
            </button>
          </div>
        </div>

        <div class="empty-state" v-else>
          <Icon name="lucide:file-text" size="48" class="empty-icon" />
          <h3>No pages yet</h3>
          <p>Create your first page to get started</p>
          <button class="btn btn-primary" @click="createFirst" style="max-width: 200px;">
            <Icon name="lucide:plus" size="16" />
            New Page
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const documentStore = useDocumentStore()
const router = useRouter()

const recentDocs = computed(() => {
  return [...documentStore.documents]
    .filter(d => !d.is_archived)
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 8)
})

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

function createFirst() {
  const doc = documentStore.createLocalDocument(null)
  router.push(`/document/${doc.id}`)
}
</script>

<style scoped>
.home-page {
  display: flex;
  justify-content: center;
  padding: 3rem 1.5rem;
  min-height: 100vh;
}

.home-content {
  max-width: 800px;
  width: 100%;
}

.home-hero {
  text-align: center;
  padding: 3rem 0 2rem;
}

.hero-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 1rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.home-hero h1 {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent-primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.home-actions {
  margin-top: 2rem;
}

.recent-pages h3 {
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-tertiary);
  margin-bottom: 1rem;
}

.page-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.page-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1rem;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  background: var(--bg-primary);
  cursor: pointer;
  transition: all var(--transition-fast);
  text-align: left;
}

.page-card:hover {
  border-color: var(--border-strong);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.page-card-icon {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.page-card-title {
  font-weight: 500;
  font-size: 0.92rem;
  margin-bottom: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.page-card-date {
  font-size: 0.78rem;
  color: var(--text-tertiary);
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-secondary);
}

.empty-icon {
  color: var(--text-tertiary);
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.empty-state p {
  margin-bottom: 1.5rem;
}
</style>
